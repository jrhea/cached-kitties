var router = require('express').Router();
var swaggerJSDoc = require('swagger-jsdoc');
var path = require('path');

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Cached Kitties,
    version: '1.0.0',
    description: 'A Crypto Kitty read cache API service.',
  },
  basePath: '/',
};
// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['../routes/api/*.js'],// pass all in array
  };
// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve the swagger.json file
router.get('/swagger/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// serve the swagger.html file
router.get('/swagger', (req, res) => {
  res.sendFile(path.join(__dirname + '/swagger.html'));
})

module.exports = router;

