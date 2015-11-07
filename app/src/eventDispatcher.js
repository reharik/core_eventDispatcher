/**
 * Created by rharik on 6/18/15.
 */
"use strict";

var eventDispatcher = function eventDispatcher(eventstore,
                                               bufferToJson,
                                               logger,
                                               rx,
                                               invariant,
                                               extend,
                                               isobjectempty,
                                               eventmodels,
                                               JSON,
                                               _) {
    return function(_options) {
        var ef = eventmodels.eventFunctions;
        var fh = eventmodels.functionalHelpers;
        var isCommand =  _.compose(_.map(fh.matches('command')), _.chain(fh.safeProp('streamType')), ef.parseMetadata);
        var isValidCommand = x=> _.and(ef.isNonSystemEvent(x), _.and(isCommand(x).isJust(), ef.parseData(x).isJust()));
        var eventName =  _.compose(_.chain(fh.safeProp('eventName')), ef.parseMetadata);
        var continuationId =  _.compose(_.chain(fh.safeProp('continuationId')), ef.parseMetadata);
        var originalPosition =  _.map(fh.safeProp('originalPosition'));

        logger.trace('constructor | constructing gesDispatcher base version');
        logger.debug('constructor | gesDispatcher base options passed in ' + _options);

        var options = {
            stream: '$all',
            // e.g. event, command, notification
            targetStreamType: 'event'
        };
        extend(options, _options);
        logger.debug('constructor | gesDispatcher base options after merge ' + JSON.stringify(options, null, 4));

        var startDispatching = function(_handlers) {
            invariant(_handlers, 'Dispatcher requires at least one handler');
            var serveHandlers = _.curry(x => serveEventToHandlers(_handlers,x));
            logger.info('startDispatching | startDispatching called');

            rx.Observable.fromEvent(eventstore.subscribeToAllFrom(), 'event')
                .filter(isValidCommand)
                .map(createGesEvent2)
                .forEach(serveHandlers,
                    error => {
                    throw error;
                    });
        };

        var createGesEvent2 = function(payload) {
            var vent = {
                eventName       : eventName(payload),
                continuationId  : continuationId(payload),
                originalPosition: originalPosition(payload),
                data            : ef.parseData(payload)
            };
            console.log(vent);
            return vent
        };
        //    var createGesEvent = function(payload) {
        //    logger.debug('createGesEvent | event passed through filter');
        //    var vent = eventmodels.gesEvent(bufferToJson(payload.OriginalEvent.Metadata).eventName,
        //        payload.OriginalEvent.Data,
        //        payload.OriginalEvent.Metadata,
        //        payload.OriginalPosition
        //    );
        //    logger.info('createGesEvent | event transfered into gesEvent: ' + JSON.stringify(vent, null, 4));
        //    return vent;
        //};

        var serveEventToHandlers = function(handlers, vent) {
            logger.info('serveEventToHandlers | looping through event handlers');
            handlers.filter(h=> {
                    logger.info('serveEventToHandlers | checking event handler :' + h.eventHandlerName + ' for eventName: ' + vent.eventName);
                    logger.trace('serveEventToHandlers | ' + h.eventHandlerName + ' handles these events: ' + h.handlesEvents);
                    return h.handlesEvents.some(x=>x === vent.eventName);
                })
                .forEach(h=> {
                    logger.debug('serveEventToHandlers | '+h.eventHandlerName+' event handler does handle event type: ' + vent.eventName);
                    h.handleEvent(vent);
                    logger.debug('serveEventToHandlers | event handler finished handling event');
                });

            logger.info('serveEventToHandlers | event processed by dispatcher');
        };

        return {
            startDispatching: startDispatching
        };
    }
};
module.exports = eventDispatcher;
