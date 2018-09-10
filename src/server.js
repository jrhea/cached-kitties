var express    = require('express');
    bodyParser = require('body-parser');
    cors = require('cors');
    redis = require('redis');
    terminus = require ('@godaddy/terminus');

var app = express();
var cache = redis.createClient();

function startCache() {
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
}

var cacheMiddleware = function (req,res,next) {
    if(!cache || cache.status !== 'ready') {
        startCache();
    }
    req.cache = cache;
    next();
}

app.use(cacheMiddleware);

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
  return cache.status === 'ready' ? Promise.resolve() : Promise.reject(new Error('not ready'));
}
//HEALTHCHECK BLOCK

// serve api
var server = app.listen( process.env.PORT || 8080, function(){
  console.log('Listening on ' + this.address().address + ':' + this.address().port);
});

terminus(server, {
  signal: 'SIGINT',
  healthChecks: {
    '/healthcheck': onHealthCheck,
  },
  onSignal
});
