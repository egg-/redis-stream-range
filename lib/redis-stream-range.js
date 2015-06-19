/**
 * redis-stream-range.js
 */

'use strict';

var util = require('util');
var Readable = require('stream').Readable;

var RedisStreamRange = function(client, key, opt) {
    // allow call without new
    if (this instanceof RedisStreamRange === false) {
        return new RedisStreamRange(client, key, opt);
    }

    Readable.call(this, opt);

    this._client = client;
    this._key = key;
    this._size = (opt && opt.chunkSize) ? opt.chunkSize : 10;
    this._delimiter = (opt && opt.delimiter) ? opt.delimiter : "\n";
    this._autoClose = (opt && typeof opt.autoClose !== 'undefined') ? opt.autoClose : true;
    this._cursor = 0;
    this._ended = false;
};

util.inherits(RedisStreamRange, Readable);

RedisStreamRange.prototype._onend = function(length) {
    if ( ! this._ended) {
        this._ended = true;
        if (this._autoClose) {
            this._client.end();
        }

        this.emit('end', length);
    }
    return true;
};

RedisStreamRange.prototype._read = function(size) {
    var self = this;

    size = self._size;

    var start = self._cursor;
    var end = self._cursor + size - 1;

    self._cursor += size;

    self._client.llen(this._key, function(err, length) {
        if (err) {
            return self.emit('error', err);
        }

        if (length === 0) {
            return self._onend(length);
        }

        self._client.lrange(self._key, start, end, function(err, list) {
            if (err) {
                return self.emit('error', err);
            }

            if ( ! list.length) {
                return self._onend(length);
            }

            if (self._cursor < length) {
                list.push('');
            }

            self.push(list.join(self._delimiter));
        });
    })
};

module.exports = RedisStreamRange;
