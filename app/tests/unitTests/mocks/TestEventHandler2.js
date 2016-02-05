/**
 * Created by rharik on 6/19/15.
 */
"use strict";

module.exports = function() {
    return function testEventHandler2() {
        var handlesEvents    = [
        ];
        var eventsHandled    = [];
        var eventHandlerName = 'TestEventHandler';

        var handleEvent        = function(vent) {
            console.log("HHHEEERRREEE")
            eventsHandled.push(vent);
        };
        var clearEventsHandled = function() {
            eventsHandled = [];
        };
        var getHandledEvents   = function() {
            return eventsHandled;
        };
        return {
            handlesEvents,
            eventHandlerName,
            handleEvent,
            clearEventsHandled,
            getHandledEvents,
            eventsHandled
        }

    };
};
