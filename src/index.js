/**
 * Created by reharik on 8/13/15.
 */

var _eventDispatcher = require('./eventDispatcher');
var extend = require('extend');
var corelogger = require('corelogger');
var invariant = require('invariant');

module.exports = function index(handlers, eventStore, _options) {
    var options = {
        logger: {
            moduleName: "EventDispatcher"
        }
    };

    extend(options, _options || {});

    invariant(handlers, "Dispatcher requires at least one handler");

    corelogger.changeOptions({moduleName: "EventDispatcher"});
    return _eventDispatcher(handlers, options);
};