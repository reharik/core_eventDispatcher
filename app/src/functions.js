/**
 * Created by rharik on 11/7/15.
 */


module.exports = function functions(eventmodels, _fantasy, _) {
    return function() {
        var ef             = eventmodels.eventFunctions;
        var fh             = eventmodels.functionalHelpers;
        var Maybe          = _fantasy.Maybe;
        //var hasData = ef.parseData.map(x=> x.isJust() ? Maybe.of(true):Maybe.of(false));
        //var hasData = _.compose( _.map(Maybe.isJust() ? Maybe.of(true):Maybe.of(false)) ,ef.parseData);
        var matchesCommand = _.compose( Maybe.maybe(Maybe.of(false), Maybe), _.chain(fh.maybeMatches('command')), _.chain(fh.safeProp('streamType')), ef.parseMetadata);
        //var isValidCommand   = _.compose(fh.log,_.and(ef.isNonSystemEvent, _.compose(matchesCommand,fh.log, ef.parseData)));
        //var isValidCommand   = _.and(ef.isNonSystemEvent, _.and(matchesCommand, ef.parseData));
        var isValidCommand   = x => _.and(ef.isNonSystemEvent(x), _.and(matchesCommand(x).isJust(), ef.parseData(x).isJust()));
        //
        //    var isValidCommand = x => [matchesCommand, ef.parseData]
        //        .map(fn => {console.log('xxxxxxxxxx');console.log(fn.toString()); console.log(fn(x)); return fn(x)}).reduce(z=>{console.log('zzzzzzz');console.log(z);return  z === Maybe.of(true)});

        var eventName        = _.compose(_.chain(fh.safeProp('eventName')), ef.parseMetadata);
        var continuationId   = _.compose(_.chain(fh.safeProp('continuationId')), ef.parseMetadata);
        var originalPosition = fh.safeProp('originalPosition');

        var transformEvent = function(payload) {
            var vent = {
                eventName       : eventName(payload),
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
