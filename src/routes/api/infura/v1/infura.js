var router = require('express').Router();
    axios = require('axios');
    responseTime = require('response-time');

var baseURL = 'https://api.infura.io/v1/jsonrpc';

// add X-Response-Time header
router.use(responseTime());

/**
 * @swagger
 * /api/infura/v1/{network}/view_getTransactionsByHash:
 *   get:
 *     summary: Returns all transactions found in a block hash
 *     produces:
 *       - application/json
 *     tags:
 *       - Infura
 *     parameters:
 *       - name: network
 *         description: desired network to query
 *         in: path
 *         required: true
 *         type: string
 *         enum: [mainnet, ropsten]
 *         example: mainnet
 *       - name: params
 *         description: a string representing an array containing the hash (32 bytes) of a block
 *         in: query
 *         required: true
 *         type: string
 *         example: '["0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35"]'
 *     responses:
 *       200:
 *         description: a list of transactions
 *         schema:
 *           type: array
 *           items:
 *             type: object
 */
router.get('/:network/view_getTransactionsByHash', function(req, res, next) {
    var url = baseURL+'/'+req.params.network+'/eth_getBlockTransactionCountByHash?params='+req.query.params;
    return query(url,req.cache).then(result => {
        let promises = [];
        let txCount = parseInt(result.result);
        let params = JSON.parse(req.query.params);
        params.push("0x0");
        for(let i = 0; i < txCount; i++){
            params[1]="0x"+i.toString(16);
            url = baseURL+'/'+req.params.network+'/eth_getTransactionByBlockHashAndIndex?params='+JSON.stringify(params);
            promises.push(query(url,req.cache));
        }
        Promise.all(promises).then(results => {
            res.status(200).json(results);
        });
    }).catch(err => {
        res.json(err);
    });
});

/**
 * @swagger
 * /api/infura/v1/{network}/view_getTransactionsByHashAndAddress:
 *   get:
 *     summary: Returns transactions to a specific addresss found in a block hash
 *     produces:
 *       - application/json
 *     tags:
 *       - Infura
 *     parameters:
 *       - name: network
 *         description: desired network to query
 *         in: path
 *         required: true
 *         type: string
 *         enum: [mainnet, ropsten]
 *         example: mainnet
 *       - name: params
 *         description: a string representing an array containing the hash (32 bytes) of a block and an address
 *         in: query
 *         required: true
 *         type: string
 *         example: '["0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35","0xfb0f7189b354660e649ae14261a9fe0e8febf369"]'
 *     responses:
 *       200:
 *         description: a list of transactions
 *         schema:
 *           type: array
 *           items:
 *             type: object
 */
router.get('/:network/view_getTransactionsByHashAndAddress', function(req, res, next) {
    let params = JSON.parse(req.query.params);
    let hash = params[0]
    let address = params[1];
    var url = baseURL+'/'+req.params.network+'/eth_getBlockTransactionCountByHash?params=["'+hash+'"]';
    return query(url,req.cache).then(result => {
        let promises = [];
        let txCount = parseInt(result.result);
        for(let i = 0; i < txCount; i++){
            let index = "0x"+i.toString(16);
            url = baseURL+'/'+req.params.network+'/eth_getTransactionByBlockHashAndIndex?params=['+JSON.stringify(hash)+','+JSON.stringify(index)+']';
            promises.push(query(url,req.cache));
        }
        Promise.all(promises).then(results => {
            let filteredResults = [];
            for(let i = 0; i < results.length; i++){
                if (results[i].result.to == address){
                    filteredResults.push(results[i]);
                }
            }
            res.status(200).json(filteredResults);
        });
    }).catch(err => {
        res.json(err);
    });
});

/**
 * @swagger
 * /api/infura/v1/{network}/{method}:
 *   get:
 *     summary: Infura API passthrough endpoint
 *     produces:
 *       - application/json
 *     tags:
 *       - Infura
 *     parameters:
 *       - name: network
 *         description: desired network to query
 *         in: path
 *         required: true
 *         type: string
 *         enum: [mainnet, ropsten]
 *         example: mainnet
 *       - name: method
 *         description:
 *         in: path
 *         required: true
 *         type: string
 *         enum: [eth_gasPrice, eth_getBlockByHash, eth_getBlockTransactionCountByHash, eth_getTransactionByBlockHashAndIndex]
 *         example: eth_getBlockTransactionCountByHash
 *       - name: params
 *         description: a string representing the parameter value needed by the selected Infura API endpoint
 *         in: query
 *         required: false
 *         type: string
 *         example: '["0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35"]'
 *     responses:
 *       200:
 *         description: response from Infura API
 */
router.get('/:network/:method', function(req, res, next) {
    var url = baseURL + req.url;
    return query(url,req.cache).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.json(err);
    });
});

function query(url,cache){
    return new Promise((resolve,reject) => {
        queryCache(url,cache).then((result) => {
            if(result){
                const resultJSON = JSON.parse(result);
                resolve(resultJSON);
            }
            else{
                queryAPI(url,cache).then(response => {
                    resolve(response);
                }).catch(err => {
                    return new Error(err);
                });
            }
        });
    });
}

function queryCache(url,cache){
    return new Promise((resolve,reject) => {
        cache.get(url, (err,result) => {
            resolve(result);
        });
    });
}

function queryAPI(url,cache){
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
