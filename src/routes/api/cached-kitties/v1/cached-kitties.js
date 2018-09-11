var router = require('express').Router();
    axios = require('axios');
    responseTime = require('response-time');
    kitties = require('../../../models/kitties');
    auction = require('../../../models/auction');
    query = require('../../../../utils/cache-inf').query;

// add X-Response-Time header
router.use(responseTime());

/**
 * @swagger
 * /api/cached-kitties/v1/{network}/kitties/{id}/{block}:
 *   get:
 *     summary: Returns details on a CryptoKitty by Id at a specific block height
 *     produces:
 *       - application/json
 *     tags:
 *       - CryptoKitties
 *     parameters:
 *       - name: network
 *         description: desired network to query
 *         in: path
 *         required: true
 *         type: string
 *         enum: [mainnet, ropsten]
 *         example: ropsten
 *       - name: id
 *         description: a unique CryptoKitty ID
 *         in: path
 *         required: true
 *         type: integer
 *         example: 12
 *       - name: block
 *         description: the target block to inspect
 *         in: path
 *         required: true
 *         type: integer
 *         example: 6303417
 *     responses:
 *       200:
 *         description: details about a particular CryptoKitty
 */
//http://localhost:8080/api/cached-kitties/v1/ropsten/kitties/12/6303417
router.get('/:network/kitties/:id/:block', function(req, res, next) {
    if(!isNaN(req.params.block)){
        var url = req.params.network+'/kitties/'+req.params.id+'/'+req.params.block;
        return query(url, kitties.getKittyById(req.params.id, req.params.block), req.cache).then(result => {
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

/**
 * @swagger
 * /api/cached-kitties/v1/{network}/kitties/{id}:
 *   get:
 *     summary: Returns details on a CryptoKitty by Id at the latest block
 *     produces:
 *       - application/json
 *     tags:
 *       - CryptoKitties
 *     parameters:
 *       - name: network
 *         description: desired network to query
 *         in: path
 *         required: true
 *         type: string
 *         enum: [mainnet, ropsten]
 *         example: ropsten
 *       - name: id
 *         description: a unique CryptoKitty ID
 *         in: path
 *         required: true
 *         type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: details about a particular CryptoKitty
 */
router.get('/:network/kitties/:id', function(req, res, next) {
    kitties.getKittyById(req.params.id, 'latest').then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.json(err);
    });
});

/**
 * @swagger
 * /api/cached-kitties/v1/{network}/getKittiesSoldByBlock/{fromBlock}/{toBlock}:
 *   get:
 *     summary: Find Kitties sold within a block range
 *     produces:
 *       - application/json
 *     tags:
 *       - CryptoKitties
 *     parameters:
 *       - name: network
 *         description: desired network to query
 *         in: path
 *         required: true
 *         type: string
 *         enum: [mainnet, ropsten]
 *         example: ropsten
 *       - name: fromBlock
 *         description: starting block height
 *         in: path
 *         required: true
 *         type: integer
 *         example: 6303970
 *       - name: toBlock
 *         description: ending block height
 *         in: path
 *         required: true
 *         type: integer
 *         example: 6303973
 *     responses:
 *       200:
 *         description: list of CrytoKitties sold
 */
//List of Kitties sold by block
//http://localhost:8080/api/v1/cached-kitties/ropsten/getKittiesSoldByBlock/6303970/6303973/
router.get('/:network/getKittiesSoldByBlock/:fromBlock/:toBlock', function(req, res, next) {
    var url = req.params.network+'/getKittiesSoldByBlock/'+req.params.fromBlock+'/'+req.params.toBlock;
    return query(url, auction.getKittiesSoldByBlock(req.params.fromBlock, req.params.toBlock),req.cache).then(result => {
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

module.exports = router;
