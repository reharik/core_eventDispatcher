/**
 * Created by rharik on 11/7/15.
 */

"use strict";

module.exports = function functions(R, _fantasy, eventmodels,treis) {
    return function(_handlers) {
        var ef = eventmodels.eventFunctions;
        var fh = eventmodels.functionalHelpers;
        var log = function(x){ console.log(x); return x; };
        var Left =_fantasy.Either.Left;
        var Right =_fantasy.Either.Right;

        //safeHandlers:: [JSON]-> Either<string,[JSON]>
        var safeHandlers =  R.or(R.isEmpty(_handlers), R.isNil(_handlers)) ? Left('Dispatcher requires at least one handler') : Right(_handlers);

        //matchName:: JSON -> bool
        var matchName = vent => R.chain(log,R.any(x=>x==vent.eventName));

        //matchHandler:: JSON -> (JSON -> bool)
        var matchHandler = vent => R.compose(R.map(matchName(vent),fh.safeProp('handlesEvents')));

        //filteredHandlers:: JSON -> [JSON]
        //var filteredHandlers = x=> R.map(R.filter(matchHandler(x)),safeHandlers);
        var filteredHandlers = x => safeHandlers.bimap(function(y) { throw new Error(y) }, R.filter(matchHandler(x)));
//        var filteredHandlers = x => safeHandlers.bimap(function(y) { throw new Error(y) }, (y)=> {var f=  R.filter(matchHandler(x)); console.log('fffff');console.log(R.map(f));return f});

        //serveEventToHandlers:: JSON -> ()

        //var serveEventToHandlers = x=> R.compose(R.map(a=>a.handleEvent(x)), filteredHandlers(x));

        // first one doesn't work because a=>a.handleEvent(x) is not curried
        var serveEventToHandlers = x=> filteredHandlers(x).map(R.map(a=> a.handleEvent(x)));

         return {
            safeHandlers,
            matchHandler,
            matchName,
            filteredHandlers,
            //getMatchingHandler,
            serveEventToHandlers
        }
    }
};
