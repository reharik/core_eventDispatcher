/**
 * Created by rharik on 11/7/15.
 */


module.exports = function functions(R, _fantasy, eventmodels,treis) {
    return function(_handlers) {
        var ef = eventmodels.eventFunctions;
        var fh = eventmodels.functionalHelpers;
        var log = function(x){ console.log(x); return x; };
        var Left =_fantasy.Either.Left;
        var Right =_fantasy.Either.Right;

        var safeHandlers =  R.isEmpty(_handlers) ? Left('Dispatcher requires at least one handler') : Right(_handlers);

        var matchName = vent => R.chain(R.any(x=>x==vent.eventName));
        //matchHandler:: handler -> bool
        var matchHandler = vent => R.compose(R.map(matchName(vent),fh.safeProp('handlesEvents')));

        //var filteredHandlers = x=> R.extend(R.filter(matchHandler(x)),safeHandlers);
        var filteredHandlers = x=> safeHandlers.extend(R.filter(matchHandler(x)));

        var serveEventToHandlers = x=>
        //{
            //console.log(x);
            //console.log(filteredHandlers(x));
            //}
            //return

        // consider lense or something.  right now h is an array
            filteredHandlers(x).map(h=>h.handleEvent(x));
        //}
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
