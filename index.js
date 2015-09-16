/**
 * Created by reharik on 8/13/15.
 */
'use strict';

var extend = require('extend');
var registry = require('./registry');

module.exports = function(handlers, _options) {
    var options = {
        logger: {
            moduleName: 'EventDispatcher'
        }
    };
    extend(options, _options || {});
    var container = registry(options);
    console.log(container);
    console.log(container.whatDoIHave());
    var plugin = container.getInstanceOf('eventDispatcher');

    return plugin(handlers, options);
};
