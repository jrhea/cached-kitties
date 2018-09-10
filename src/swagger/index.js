var router = require('express').Router();
var swaggerJSDoc = require('swagger-jsdoc');
// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Cached Kitties',
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
  apis: ['./routes/api/cached-kitties/v1/*.js','./routes/api/infura/v1/*.js'],
  };
// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);