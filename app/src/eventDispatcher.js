/**
 * Created by rharik on 6/18/15.
 */
"use strict";

var eventDispatcher = function eventDispatcher(eventstore,
                                               logger,
                                               rx,
                                               R,
                                               mapAndFilterStream,
                                               serveToHandlers,treis) {
    return function(_handlers, streamType) {
        logger.info('startDispatching | startDispatching called');
        var log = function(x){ console.log(x); return x; };


        var _s = serveToHandlers(_handlers);
        var mAndF = mapAndFilterStream(streamType);
        var stream = rx.Observable.fromEvent(eventstore.subscribeToAllFrom(), 'event')
            .filter( mAndF.isValidStreamType)
            .map( mAndF.transformEvent);

        //var result = stream.subscribe();
        //var fuck = (x,h) => h.handleEvent(x);
        var result = stream.subscribe(_s.serveEventToHandlers);
    };
};
module.exports = eventDispatcher;

