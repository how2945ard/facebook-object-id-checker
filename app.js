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
var token = 'EAACEdEose0cBAFBPyHoBmu0v82xvLq28nib4e1jbQ5PeNt6t4slZCmuwIAVDRqTMMZBEwe9ARtm0FwMOs6RJWYkZC0vWMz8zsQHH8XRp9KZBFvWkzAW4aZBjmYh8Uqpomow2dgPQfr7Ie6S3eNStCY98tOmNnL3A2lOkj9iRMTgZDZD';

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
    if (!message.application) {
      console.log()
      console.log(message.created_time)
      console.log(message.link)
      console.log(message.url)
      console.log()
    }
  })
  .catch((error) => {
    console.error(error)
  })

promiseWhile(() => true, idCacher)