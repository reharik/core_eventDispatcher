/**
 * Created by reharik on 11/14/15.
 */
"use strict";


var should = require('chai').should();
var expect = require('chai').expect;

var container = require('../../registry_test')({});

var _ = container.getInstanceOf('_');
var _fantasy = container.getInstanceOf('_fantasy');
var Maybe = _fantasy.Maybe;
var Right = _fantasy.Either.Right;
var Left = _fantasy.Either.Left;
var uuid = container.getInstanceOf('uuid');
var treis = container.getInstanceOf('treis');
var _mut = container.getInstanceOf('serveToHandlers');
var mut;
var eventData;
var continuationId = uuid.v4();
var sysEvent;
var matchingHandler;
var handlers;
var testHandler = container.getInstanceOf('TestEventHandler');
var _testHandler2 = container.getInstanceOf('TestEventHandler2');
var testHandler;
var testHandler2;
var bootstrapper;

describe('gesDispatcher', function() {
    before(function() {
    });

    beforeEach(function() {
        sysEvent = {
            Event           : { EventType: '$event' }
        };
        eventData = {
            eventName       : 'someEventNotificationOn',
            continuationId  : '6d4f1122-b866-409f-98d8-10fb6451de3c',
            originalPosition: 'the originalPosition',
            data            : {some: 'data'}
        };

        bootstrapper = {
            eventName       : 'bootstrapApplication',
            continuationId  : '',
            originalPosition: {
                Position: {
                    commitPosition : '19957',
                    CommitPosition : '19957',
                    preparePosition: '19957',
                    PreparePosition: '19957'
                }
            },
            data            : {data: 'bootstrap please'}
        };

        handlers =[{
            handlesEvents:['someEventNotificationOn','someOtherCrap']
        },
                    {
                        handlesEvents:['someOtherCrap']
                    }];

        matchingHandler = {
            handlesEvents:['someEventNotificationOn','someOtherCrap']
        };

        //testHandler = _testHandler();
        testHandler2 = _testHandler2();
        mut = _mut([testHandler,testHandler2]);

    });

    afterEach(function() {
    });

    describe('#MATCHNAME', function() {
        context('matchName called on matching name', function() {
            it('should return true', function() {
                mut.matchName(eventData)(Maybe.of(['someEventNotificationOn', 'someOtherCrap'])).should.be.true;
            });
        });

        context('matchName called on matching name', function() {
            it('should return true', function() {
                mut.matchName(eventData)(Maybe.of(['someOtherCrap'])).should.be.false;
            });
        });
    });

    describe('#MATCHHANDLER', function() {
        context('matchHandler called an array with non matching value', function() {
            it('should return proper values', function() {
                mut.matchHandler(eventData)(matchingHandler).should.be.true;
            });
        });
    });

    describe('#FILTEREDHANDLERS', function() {
        context('filteredHandlers called an array with non matching value', function() {
            it('should return proper values', function() {
                //console.log(mut.filteredHandlers(eventData));
                //console.log(mut.filteredHandlers(eventData));
                mut.filteredHandlers(eventData).should.eql(Right([testHandler]));
            });
        });
    });

    describe('#FILTEREDHANDLERS', function() {
        context('filteredHandlers called an array with non matching value', function() {
            it('should return proper values', function() {
                //console.log(mut.filteredHandlers(eventData));
                mut.filteredHandlers(eventData).should.eql(Right([testHandler]));
            });
        });
    });

    describe('#SERVEEVENTTOHANDLERS', function() {
        context('serveEventToHandlers with an event that it handles', function() {
            it('should call the handler', function() {
   console.log('xxxxxxxxxx')
                //console.log(mut.filteredHandlers(bootstrapper));
                mut.serveEventToHandlers(bootstrapper);
                //testHandler.getHandledEvents().length.should.equal(1);
            });
        });

    //    context('serveEventToHandlers with an event that it does not handle', function() {
    //        it('should NOT call the handler', async function() {
    //            eventData.eventName = "scoobydoo";
    //            await mut.serveEventToHandlers(eventData);
    //            testHandler.getHandledEvents().length.should.equal(0);
    //        });
    //    });
    //
    //    context('serveEventToHandlers with an event does not have a name', function() {
    //        it('should not blow up', async function() {
    //            eventData.eventName = undefined;
    //            await mut.serveEventToHandlers(eventData);
    //            testHandler.getHandledEvents().length.should.equal(0);
    //        });
    //    });
    });
});
