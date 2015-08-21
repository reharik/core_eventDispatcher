/**
 * Created by rharik on 6/18/15.
 */

var invariant = require('invariant');
var extend = require('extend');
var isObjectEmpty = require('is-object-empty');
var eventModels = require('eventmodels')();
var JSON = require('JSON');
var rx = require('rx');

module.exports = function(_handlers, _eventStore, _bufferToJson, _logger, _options) {
    var logger = _logger;
    var handlers = _handlers;
    var bufferToJson =_bufferToJson;
    var eventStore = _eventStore;
    logger.trace('constructor | constructing gesDispatcher base version');
    logger.debug('constructor | gesDispatcher base options passed in ' + _options);

    var options = {
        stream: '$all',
        // e.g. event, command, notification
        targetStreamType: 'event'
    };
    extend(options, _options);
    logger.debug('constructor | gesDispatcher base options after merge ' + JSON.stringify(options, null, 4));

    var startDispatching = function () {
        logger.info('constructor | startDispatching called');
        //this.setMetadata
        var subscription = eventStore.gesConnection.subscribeToAllFrom();

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

    var filterEvents = function (payload) {
       //logger.info('event received by dispatcher');
        //logger.trace('filtering event for system events ($)');
        if (!payload.Event || !payload.Event.EventType || payload.Event.EventType.startsWith('$')) {
            console.log('payload');
            return false;
        }
        //logger.trace('event passed filter for system events ($)');
        //logger.trace('filtering event for empty metadata');
        if (isObjectEmpty(payload.OriginalEvent.Metadata)) {
            logger.trace('filterEvents | metadata is empty');
            return false;
        }
        logger.trace('filterEvents | event has metadata');
        logger.trace('filterEvents | filtering event for empty data');
        if (isObjectEmpty(payload.OriginalEvent.Data)) {
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

    var createGesEvent = function (payload) {
        console.log('payload');
        console.log(payload);
        logger.debug('createGesEvent | event passed through filter');
        var vent = eventModels.GesEvent.init(bufferToJson(payload.OriginalEvent.Metadata).eventName,
            payload.OriginalEvent.Data,
            payload.OriginalEvent.Metadata,
            payload.OriginalPosition
        );
        logger.info('createGesEvent | event transfered into gesEvent: ' + JSON.stringify(vent, null, 4));
        return vent;
    };

    var serveEventToHandlers = function (vent) {
        logger.info('serveEventToHandlers | looping through event handlers');

        handlers
            .filter(h=> {
                logger.info('serveEventToHandlers | checking event handler :' + h.eventHandlerName + ' for eventName: ' + vent.eventName);
                logger.trace('serveEventToHandlers | '+h.eventHandlerName + ' handles these events: ' + h.handlesEvents);
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
        startDispatching:startDispatching
    };
};