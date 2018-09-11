var cache = null;

function startCache() {
  cache = redis.createClient();

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
    if(!cache || !cache.ready) {
        startCache();
    }
    req.cache = cache;
    next();
}

module.exports = {
    cacheMiddleware: cacheMiddleware,
    cache: cache
}
