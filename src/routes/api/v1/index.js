var router = require('express').Router();

router.use('/infura', require('./infura'));
router.use('/cached-kitties', require('./cached-kitties'));

module.exports = router;