# redis-stream-range

[![version](https://img.shields.io/npm/v/redis-stream-range.svg) ![download](https://img.shields.io/npm/dm/redis-stream-range.svg)](https://www.npmjs.com/package/redis-stream-range)

Return a node.js api readable stream from list elements.

## Usage

```javascript
var redis = require('redis');
var es = require('event-stream');
var RedisStreamRange = require('..');

var stream = new RedisStreamRange(
    redis.createClient(),
    'hippo2390461',
    {
        chunkSize: 10,
        delimiter: "\n",
        autoClose: true
    }
);

stream.on('data', function(chunk) {
    console.log(chunk);
})
stream.on('end', function(length) {
    console.log('length: ', length);
});

stream
    .pipe(es.split())
    .pipe(es.map(function(data, cb) {
        console.log(data);
        cb(null, data);
    }));

```


## Dependencies
* redis: https://www.npmjs.com/package/redis

## Methods

```javascript
var stream = new RedisStreamRange(redis.createClient(), 'list name');
stream.pipe(process.stdout);
```

### new RedisStreamRange(client, list, [opt])

Return an instance of stream.
* client: redis client instance
* list: list name
* [opt]: extra option
 * chunkSize: default `10`
 * delimiter: default `\n`
 * autoClose: default `true` (close redis connection)

## LICENSE

redis-stream-range is licensed under the MIT license.