/**
 * Created by rharik on 11/7/15.
 */


module.exports = function functions(eventmodels, _fantasy, _) {
    return function() {
        var ef             = eventmodels.eventFunctions;
        var fh             = eventmodels.functionalHelpers;
        var Maybe          = _fantasy.Maybe;
        var matchesCommand = _.compose(_.chain(fh.maybeMatches('command')), _.chain(fh.safeProp('streamType')), ef.parseMetadata);
        var isValidCommand = x => [ef.isNonSystemEvent, matchesCommand, ef.parseData]
            .map( fn => fn(x).isJust() )
            .reduce( (a,b) => a && b );

        var eventName        = _.compose(_.chain(fh.safeProp('eventName')), ef.parseMetadata);
        var continuationId   = _.compose(_.chain(fh.safeProp('continuationId')), ef.parseMetadata);
        var originalPosition = fh.safeProp('OriginalPosition');

        var transformEvent = function(payload) {
            var vent = {
                eventName       : _.map(eventName) payload),
                continuationId  : continuationId(payload),
                originalPosition: originalPosition(payload),
                data            : ef.parseData(payload)
            };
            console.log(vent);
            return vent
        };

        var serveEventToHandlers = function(handlers, vent) {
            handlers
                .filter(h=> h.handlesEvents.some(x=>x === vent.eventName))
                .forEach(h=> h.handleEvent(vent));
        };

        return {
            matchesCommand,
            isValidCommand,
            eventName,
            continuationId,
            originalPosition,
            transformEvent,
            serveEventToHandlers
        }
    }
};
