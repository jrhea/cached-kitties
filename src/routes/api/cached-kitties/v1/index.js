var router = require('express').Router();

router.use('/', require('./cached-kitties'));

module.exports = router;
