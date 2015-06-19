"use strict";

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
        cb(null, data);
    }))
    .pipe(process.stdout);
