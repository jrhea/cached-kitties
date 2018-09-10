var router = require('express').Router();
    axios = require('axios');
    redis = require('redis');
    responseTime = require('response-time');
    kitties = require('../../models/kitties');
    auction = require('../../models/auction');

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

//Retrieve Kitty by Id at a specific block height
//http://localhost:8080/api/v1/cached-kitties/ropsten/kitties/12/6303417
router.get('/:network/kitties/:id/:block', function(req, res, next) {
    if(!isNaN(req.params.block)){
        var url = req.params.network+'/kitties/'+req.params.id+'/'+req.params.block;
        return query(url, kitties.getKittyById(req.params.id, req.params.block)).then(result => {
            res.status(200).json(result)
        }).catch(err => {
            res.json(err);
        });
    }
    else{
        kitties.getKittyById(req.params.id, 'latest').then(result => {
            res.status(200).json(result)
        }).catch(err => {
            res.json(err);
        });
    }
});
//Retrieve Kitty by Id at the latest block height
//http://localhost:8080/api/v1/cached-kitties/ropsten/kitties/12
router.get('/:network/kitties/:id', function(req, res, next) {
    kitties.getKittyById(req.params.id, 'latest').then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.json(err);
    });
});

//List of Kitties sold by block
//http://localhost:8080/api/v1/cached-kitties/ropsten/getKittiesSoldByBlock/6303970/6303973/
router.get('/:network/getKittiesSoldByBlock/:fromBlock/:toBlock', function(req, res, next) {
    var url = req.params.network+'/getKittiesSoldByBlock/'+req.params.fromBlock+'/'+req.params.toBlock;
    return query(url, auction.getKittiesSoldByBlock(req.params.fromBlock, req.params.toBlock)).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.json(err);
    });
});

//List of Kitties for sale by block
/*router.get('/:network/getKittiesForSaleByBlock/:fromBlock/:toBlock', function(req, res, next) {
});

//List of Kitties sold by block
router.get('/:network/getKittiesSoldByBlock/:fromBlock/:toBlock', function(req, res, next) {
});

// status codes
//-1 not for sale
// 0 for sale
// 1 sold
// 2 undefined
// store values by block
router.get('/:network/getKitties/:status/:traits/:fromBlock/:toBlock', function(req, res, next) {
});

//get kitties by trait
router.get('/:network/trait/:trait/calcAvgForSale/:hours', function(req, res, next) {
});

//Average value of gen X kitty for sale over last Y hrs
//filter by trait
router.get('/:network/trait/:trait/calcAvgForSale/:hours', function(req, res, next) {
});

//Variance of gen X kitty for sale over last Y hrs
router.get('/:network/gen/:gen/calcVarianceForSale/:hours', function(req, res, next) {
});

//Average value of gen X kitty sold over last Y hrs
router.get('/:network/gen/:gen/calcAvgSold/:hours', function(req, res, next) {
});

//Variance of gen X kitty for sold over last Y hrs
router.get('/:network/gen/:gen/calcVarianceSold/:hours', function(req, res, next) {
});

//List of for sale kitties that are undervalued ( we will have to create a model that predicts which kitties can be immediately bought and sold for a profit )
router.get('/:network/listUnderValuedKitties', function(req, res, next) {
});*/

function query(url, query){
    return new Promise((resolve,reject) => {
        queryCache(url).then((result) => {
            if(result){
                console.log('Returning cached result');
                const resultJSON = JSON.parse(result);
                resolve(resultJSON);
            }
            else{
                queryAPI(url, query).then(response => {
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

function queryAPI(url, query){
    return query.then((resolve, reject) => {
        //Don't cache result if it contains an error message from infura
        if(resolve){
            cache.set(url,JSON.stringify(resolve));
        }
        else{
            throw new Error(JSON.stringify(reject));
        }
        return resolve;
    }).catch(err => {
        //console.log(err);
        return new Error(err);
    });
};

module.exports = router;