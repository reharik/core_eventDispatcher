/**
 * Created by rharik on 6/18/15.
 */

var invariant = require('invariant');
var extend = require('extend');
var isObjectEmpty = require('isObjectEmpty');
var eventModels = require('eventModels');
var JSON = require('JSON');
var rx = require('rx');

module.exports = function(_handlers, eventStore, _bufferToJson, _logger, _options) {
    var logger = _logger;
    var handlers = _handlers;
    var bufferToJson =_bufferToJson;
    logger.trace('constructing gesDispatcher base version');
    logger.debug('gesDispatcher base options passed in ' + _options);

    var options = {
        stream: '$all',
        // e.g. event, command, notification
        targetStreamType: 'event'
    };
    extend(options, _options);
    logger.debug('gesDispatcher base options after merge ' + JSON.stringify(options, null, 4));

    var startDispatching = function () {
        logger.info('startDispatching called');
        //this.setMetadata();
        var subscription = eventStore.subscribeToAllFrom();

        //Dispatcher gets raw events from ges in the EventData Form
        logger.debug('observable created');
        var relevantEvents = rx.Observable.fromEvent(subscription, 'event')
            .filter(filterEvents, this)
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
            return false;
        }
        //logger.trace('event passed filter for system events ($)');
        //logger.trace('filtering event for empty metadata');
        if (_.isEmpty(payload.OriginalEvent.Metadata)) {
            logger.trace('metadata is empty');
            return false;
        }
        logger.trace('event has metadata');
        logger.trace('filtering event for empty data');
        if (isObjectEmpty(payload.OriginalEvent.Data)) {
            logger.trace('data is empty');
            return false;
        }
        logger.trace('event has data');
        logger.trace('filtering event for streamType');

        var metadata = bufferToJson(payload.OriginalEvent.Metadata);
        if (!metadata || !metadata.streamType || metadata.streamType != options.targetStreamType) {
            logger.trace('event is not of proper stream type. Expected' + options.targetStreamType + ' but was ' + metadata.streamType);
            return false;
        }

        logger.trace('event is of proper targetStreamType');
        return true;
    };

    var createGesEvent = function (payload) {
        logger.debug('event passed through filter');
        var vent = new GesEvent(bufferToJson(payload.OriginalEvent.Metadata).eventName,
            payload.OriginalEvent.Data,
            payload.OriginalEvent.Metadata,
            payload.OriginalPosition
        );
        logger.info('event transfered into gesEvent: ' + JSON.stringify(vent, null, 4));
        return vent;
    };

    var serveEventToHandlers = function (vent) {
        logger.info('looping through event handlers');

        handlers
            .filter(h=> {
                logger.info('checking event handler :' + h.eventHandlerName + ' for eventTypeName: ' + vent.eventName);
                logger.trace(h.eventHandlerName + ' handles these events: ' + h.handlesEvents);
                return h.handlesEvents.includes(vent.eventName);
            })
            .forEach(m=> {
                logger.debug('event handler does handle event type: ' + vent.eventName);
                m.handleEvent(vent);
                logger.debug('event handler finished handling event');
            });

        logger.info('event processed by dispatcher');
    };

    return {
        startDispatching:startDispatching
    };
};