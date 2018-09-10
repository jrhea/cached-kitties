var router = require('express').Router();
    axios = require('axios');
    redis = require('redis');
    responseTime = require('response-time');

// create and connect redis client to local instance.
var cache = redis.createClient();

cache.on('connect', () => {
  console.log('Connected to redis');
  cache.flushdb((err,succeeded) => {
    if(succeeded) {
        console.log('Flushed Redis Cache');
    }
  })
});
// Print redis errors to the console
cache.on('error', (err) => {
  console.log("Error " + err);
});

// add X-Response-Time header
router.use(responseTime());

router.get('/:network/view_getTransactionsByHash', function(req, res, next) {
    var url = 'https://api.infura.io/v1/jsonrpc/'+req.params.network+'/eth_getBlockTransactionCountByHash?params='+req.query.params;
    return query(url).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.json(err);
    });
});

router.get('/:network/:method', function(req, res, next) {
    var url = 'https://api.infura.io/v1/jsonrpc' + req.url;
    return query(url).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.json(err);
    });
});

function query(url){
    return new Promise((resolve,reject) => {
        queryCache(url).then((result) => {
            if(result){
                console.log('Returning cached result');
                const resultJSON = JSON.parse(result);
                resolve(resultJSON);
            }
            else{
                queryAPI(url).then(response => {
                    resolve(response);
                }).catch(err => {
                    return new Error(err);
                });
            }
        });
    });
}

function queryCache(url){
    return new Promise((resolve,reject) => {
        cache.get(url, (err,result) => {
            resolve(result);
        });
    });
}

function queryAPI(url){
    return axios.get(url).then(response => {
        //Don't cache result if it contains an error message from infura
        if(!response.data.hasOwnProperty('error') && !(response.data.hasOwnProperty('result') && response.data.result === null && typeof response.data.result === "object") ){
            cache.set(url,JSON.stringify(response.data));
        }
        else{
            throw new Error(JSON.stringify(response.data.error));
        }
        return response.data;
    }).catch(err => {
        //console.log(err);
        return new Error(err);
    });
};

module.exports = router;