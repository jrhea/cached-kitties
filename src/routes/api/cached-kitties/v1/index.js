var router = require('express').Router();

router.use('/cached-kitties', require('./cached-kitties'));

module.exports = router;
