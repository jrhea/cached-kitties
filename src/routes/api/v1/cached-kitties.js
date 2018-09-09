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

//List of Kitties for sale between two dates
router.get('/:network/getKittiesForSaleByDates', function(req, res, next) {
});

//List of Kitties sold between two dates
router.get('/:network/getKittiesSoldByDates', function(req, res, next) {
});


//Average value of gen X kitty for sale over last Y hrs
router.get('/:network/gen/:gen/calcAvgForSale/:hours', function(req, res, next) {
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
});

module.exports = router;