/**
 * Created by reharik on 11/14/15.
 */


var should = require('chai').should();
var expect = require('chai').expect;

var container = require('../../registry_test')({});

var _ = container.getInstanceOf('_');
var _fantasy = container.getInstanceOf('_fantasy');
var Maybe = _fantasy.Maybe;
var Right = _fantasy.Either.Right;
var Left = _fantasy.Either.Left;
var Identity = _fantasy.Identity;
var uuid = container.getInstanceOf('uuid');
var treis = container.getInstanceOf('treis');
var _mut = container.getInstanceOf('serveToHandlers');
var mut;
var eventData;
var continuationId = uuid.v4();
var sysEvent;
var rHandlers;
var matchingHandler;
var handlers;


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
        rHandlers =Right([{
                        handlesEvents:['someEventNotificationOn','someOtherCrap']
                    },
                    {
                        handlesEvents:['someOtherCrap']
                    }]);

        handlers =[{
            handlesEvents:['someEventNotificationOn','someOtherCrap']
        },
                    {
                        handlesEvents:['someOtherCrap']
                    }];

        matchingHandler = {
            handlesEvents:['someEventNotificationOn','someOtherCrap']
        };

        mut = _mut(handlers);

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
                console.log(mut.filteredHandlers(eventData));
                mut.filteredHandlers(eventData)[0].should.eql(handlers[0]);
            });
        });

        context('filteredHandlers called a left value', function() {
            it('should return proper values', function() {
                mut = _mut();
                console.log(mut.filteredHandlers(eventData))
            });
        });
    });

    describe('#FILTEREDHANDLERS', function() {
        context('filteredHandlers called an array with non matching value', function() {
            it('should return proper values', function() {
                //console.log(mut.filteredHandlers(eventData));
                console.log(mut.filteredHandlers(eventData));
                mut.filteredHandlers(eventData)[0].should.eql(handlers[0]);
            });
        });
    });
});
