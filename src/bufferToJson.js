/**
 * Created by rharik on 7/7/15.
 */
'use strict';

var logger = require('corelogger');

module.exports = function() {
    var bufferToJson = function bufferToJson(item) {
        if (!Buffer.isBuffer(item)) {
            logger.info('bufferToJson | item is not a buffer, returning original item');

            return item;
        }
        logger.info('bufferToJson | item is a buffer, parsing buffer');

        return JSON.parse(item.toString('utf8'));
    };

    return bufferToJson;
};
