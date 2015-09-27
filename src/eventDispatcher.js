/**
 * Created by rharik on 6/18/15.
 */

var eventDispatcher = function eventDispatcher(eventstore,
                                               bufferToJson,
                                               logger,
                                               rx,
                                               invariant,
                                               extend,
                                               isobjectempty,
                                               eventmodels,
                                               JSON) {
    return function(_options) {
        var handlers;
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
            handlers = _handlers;
            invariant(handlers, 'Dispatcher requires at least one handler');
            logger.info('startDispatching | startDispatching called');

            var subscription = eventstore.subscribeToAllFrom();

            //Dispatcher gets raw events from ges in the EventData Form
            logger.debug('constructor | observable created');
            var relevantEvents = rx.Observable.fromEvent(subscription, 'event')
                .filter(filterEvents)
                .map(createGesEvent, this);
            relevantEvents.forEach(vent => serveEventToHandlers(vent),
                    error => {
                    throw error;
                }
            );
        };

        var filterEvents = function(payload) {
            //logger.info('event received by dispatcher');
            //logger.info(payload);
            //logger.trace('filtering event for system events ($)');
            if (!payload.Event || !payload.Event.EventType || payload.Event.EventType.startsWith('$')) {
                return false;
            }
            logger.trace('event passed filter for system events ($)');
            logger.trace('filtering event for empty metadata');
            logger.info(payload);
            if (isobjectempty(payload.OriginalEvent.Metadata)) {
                logger.trace('filterEvents | metadata is empty');
                return false;
            }
            logger.trace('filterEvents | event has metadata');
            logger.trace('filterEvents | filtering event for empty data');
            if (isobjectempty(payload.OriginalEvent.Data)) {
                logger.trace('filterEvents | data is empty');
                return false;
            }
            logger.trace('filterEvents | event has data');
            logger.trace('filterEvents | filtering event for streamType');

            var metadata = bufferToJson(payload.OriginalEvent.Metadata);
            if (!metadata || !metadata.streamType || metadata.streamType != options.targetStreamType) {
                logger.trace('filterEvents | event is not of proper stream type. Expected ' + options.targetStreamType + ' but was ' + metadata.streamType);
                return false;
            }

            logger.trace('filterEvents | event is of proper targetStreamType');
            return true;
        };

        var createGesEvent = function(payload) {
            logger.debug('createGesEvent | event passed through filter');
            console.log('payload.OriginalEvent')
            console.log(payload.OriginalEvent)
            console.log(bufferToJson(payload.OriginalEvent.Metadata))
            var vent = eventmodels.gesEvent(bufferToJson(payload.OriginalEvent.Metadata).eventName,
                payload.OriginalEvent.Data,
                payload.OriginalEvent.Metadata,
                payload.OriginalPosition
            );
            logger.info('createGesEvent | event transfered into gesEvent: ' + JSON.stringify(vent, null, 4));
            return vent;
        };

        var serveEventToHandlers = function(vent) {
            logger.info('serveEventToHandlers | looping through event handlers');

            handlers
                .filter(h=> {
                    logger.info('serveEventToHandlers | checking event handler :' + h.eventHandlerName + ' for eventName: ' + vent.eventName);
                    logger.trace('serveEventToHandlers | ' + h.eventHandlerName + ' handles these events: ' + h.handlesEvents);
                    return h.handlesEvents.includes(vent.eventName);
                })
                .forEach(m=> {
                    logger.debug('serveEventToHandlers | event handler does handle event type: ' + vent.eventName);
                    m.handleEvent(vent);
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
