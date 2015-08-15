/**
 * Created by reharik on 8/13/15.
 */

var _eventDispatcher = require('./eventDispatcher');
var _bufferToJson = require('./bufferToJson');
var extend = require('extend');
var yowlWrapper = require('yowlWrapper');

module.exports = function index(handlers, eventStore, _options) {
    var options = {
        logger: {
            moduleName: "EventDispatcher"
        }
    };

    extend(options, _options || {});

    invariant(handlers, "Dispatcher requires at least one handler");

    var logger = yowlWrapper(options.logger);
    var bufferToJson = _bufferToJson(logger);
    return _eventDispatcher(handlers, eventStore, bufferToJson, logger, options);
};