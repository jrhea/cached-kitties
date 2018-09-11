var express    = require('express');
    bodyParser = require('body-parser');
    cors = require('cors');
    redis = require('redis');
    terminus = require ('@godaddy/terminus');
    CacheMiddleware = require('./cacheMiddleware');

var app = express();
var cache = CacheMiddleware.cache;

app.use(CacheMiddleware.cacheMiddleware);

// allows CORS
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//generate Swagger Docs
var swaggerJSDoc = require('swagger-jsdoc');
var path = require('path');
var swaggerSpec = require('./swagger');

// serve the swagger.json file
app.get('/swagger/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// serve the swagger.html file
app.get('/swagger', (req, res) => {
  res.sendFile(path.join(__dirname + '/swagger/swagger.html'));
})

//app.use(require('./swagger'));
app.use(require('./routes'));

//HEALTHCHECK BLOCK
function onSignal() {
  console.log('Server is starting cleanup...');
  return cache.quit().then(
    () => console.log('Redis Disconnected')
  ).catch(
    err => console.log('Error Disconnecting from Redis', err.stack)
  );
}

async function onHealthCheck() {
  if(cache) {
    return cache.ready ? Promise.resolve() : Promise.reject(new Error('not ready'));
  } else {
    return Promise.resolve();
  }
}
//HEALTHCHECK BLOCK

// serve api
var server = app.listen( process.env.PORT || 8080, function(){
  console.log('Listening on ' + this.address().address + ':' + this.address().port);
});

terminus(server, {
  healthChecks: {
    '/healthcheck': onHealthCheck,
  },
  timeout: 5000,
  signal: 'SIGINT',
  onSignal
});

module.exports = app; //for unit tests

