var graph = require('fbgraph');
var Promise = require('bluebird');
var Redis = require('ioredis');
var EventEmitter = require('events');
var Event = new EventEmitter();

promiseWhile = (condition, action) => {
  var resolver = Promise.defer();

  var loop = () => {
    if (!condition()) return resolver.resolve();
    return Promise.cast(action())
      .then(loop);
  };

  process.nextTick(loop);

  return resolver.promise;
};
var redisClient = new Redis({
  host: 'localhost',
  port: '6379'
});

Promise.promisifyAll(graph);

var options = {
  timeout: 3000,
  pool: {
    maxSockets: Infinity
  },
  headers: {
    connection: "keep-alive"
  }
};
var token = 'EAACEdEose0cBAMPCKgbk2cskYJGGPTWGmGsda04ZBWaJ6SnLvwDLgxPF8tf5HjCMMZBfPRBTwCZCFbXCa4axEsw80oXcdObR2QtvScB9KUTe3xNWJOSuFj6YOqtXGImkuy6KmXP0JyzihruIg4amDVfepvInZCoQWdfB7QZAMmAZDZD';

// var ID = 526382450745876;
// redisClient
//   .set('fb-id', ID + '')

var redisGetFbId = () => redisClient
  .multi()
  .get('fb-id')
  .incr('fb-id')
  .exec()
  .then(value => value[0][1])

graph
  .setAccessToken(token)
  .setOptions(options);

var idCacher = () => redisGetFbId()
  .then((id) => graph.getAsync(id + ''))
  .then((message) => {
    console.log(message)
  })
  .catch((error) => {
    console.error(error)
  })

promiseWhile(() => true, idCacher)