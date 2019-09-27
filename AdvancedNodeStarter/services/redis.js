// Redis configuration
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const redisClient = redis.createClient(redisUrl);
const util = require('util');
redisClient.hget = util.promisify(redisClient.hget)

if (process.env.NODE_ENV !== 'development') {
  redisClient.flushall();
}

const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec; 


// This function allows user to choose to cache, as well as giving options to decide how to the hashing should work
// Remember prototype on patches a single instance of an object.

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || 'default_key');  
  // Allows for function chaining.
  return this;
}

// Do not use arrow function, because 'this' needs to make the proper reference
// Monkey patch Mongoose's query execution function so then it accesses the cache before it actually queries
//
mongoose.Query.prototype.exec = async function() {
  //Generate a unique cache key for a specific type of cache
  if (!this.useCache) {
    console.log('use no cache.');
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  // Check redis 
  const cachedQuery = await redisClient.hget(this.hashKey, key);
  if ( cachedQuery) {
    // What gets stored in redis is a stringed json, but what was originally queried was actually a mongoose model object
    // Which stringify chained to json, so parsing for json isn't enough
    console.log('using cache.');
    const parsed = JSON.parse(cachedQuery);
    // What happen here is that if multiple entities are stored by the key, as opposed to 1 thing, an array of json object would be return, even after parsing, 
    // so each one of them needs to be mapped.
    return Array.isArray(parsed) ? parsed.map( each => new this.model(each)) : new this.model(parsed);
  
  }
  console.log('caching...')
  const query = await exec.apply(this, arguments);
  redisClient.hset(this.hashKey, key, JSON.stringify(query), 'EX', 60);
  return query
}

module.exports = {
  clearHash( hashKey ) {
    redisClient.del(JSON.stringify(hashKey));
  },

}


