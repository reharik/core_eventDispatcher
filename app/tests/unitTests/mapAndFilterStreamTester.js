///**
// * Created by rharik on 11/7/15.
// */
//"use strict";
//
//
//var should = require('chai').should();
//var expect = require('chai').expect;
//
//var container = require('../../registry_test')({});
//
//var eventmodels     = container.getInstanceOf('eventmodels');
//var _            = container.getInstanceOf('_');
//var _fantasy            = container.getInstanceOf('_fantasy');
//var ef = eventmodels.eventFunctions;
//var fh = eventmodels.functionalHelpers;
//var Maybe = _fantasy.Maybe;
//var uuid = container.getInstanceOf('uuid');
//var _mut = container.getInstanceOf('mapAndFilterStream');
//var mut;
//var eventData;
//var continuationId = uuid.v4();
//var sysEvent;
//
//
//describe('gesDispatcher', function() {
//    before(function() {
//    });
//
//    beforeEach(function() {
//        sysEvent = {
//            Event           : { EventType: '$event' }
//        };
//        eventData = {
//            Event           : {EventType: 'event'},
//            OriginalPosition: {
//                x: '123',
//                y: '456'
//            },
//            OriginalEvent   : {
//                Metadata: new Buffer(JSON.stringify({
//                    eventName     : 'someEventNotificationOn',
//                    streamType    : 'command',
//                    continuationId: continuationId
//                })),
//                Data    : new Buffer(JSON.stringify({'some': 'data'}))
//            }
//        };
//        mut = _mut('command');
//
//    });
//
//    afterEach(function() {
//    });
//
//    describe('#MATCHESSTREAMTYPE', function() {
//        context('matchesStreamType called on a command', function() {
//            it('should return maybe of true', function() {
//                mut.matchesStreamType(eventData).should.eql(Maybe.of(true));
//            });
//        });
//
//        context('matchesStreamType called on an event', function() {
//            it('should return maybe.false', function() {
//                eventData.OriginalEvent.Metadata = new Buffer(JSON.stringify({
//                    eventName : 'someEventNotificationOn',
//                    streamType: 'event'
//                }));
//                mut.matchesStreamType(eventData).should.eql(Maybe.of(false));
//            })
//        });
//
//        context('matchesStreamType called on empty value', function() {
//            it('should return false', function() {
//                mut.matchesStreamType({}).should.eql(Maybe.Nothing());
//            })
//        });
//
//    });
//
//    describe('#ISVALIDSTREAMTYPE', function() {
//        context('isValidStreamType called on a valid command', function() {
//            it('should return true', function() {
//                mut.isValidStreamType(eventData).should.be.true;
//            });
//        });
//        context('isValidStreamType called on a system event', function() {
//            it('should return false', function() {
//                eventData.Event.EventType = '$event';
//                mut.isValidStreamType(eventData).should.be.false;
//            });
//        });
//
//        context('isValidStreamType called on a non comamnd event', function() {
//            it('should return false', function() {
//                eventData.OriginalEvent.Metadata = new Buffer(JSON.stringify({
//                    eventName : 'someEventNotificationOn',
//                    streamType: 'event'
//                }));
//                mut.isValidStreamType(eventData).should.be.false;
//            });
//        });
//        context('isValidStreamType called on a comamnd with no data', function() {
//            it('should return false', function() {
//                eventData.OriginalEvent.Data = {};
//                mut.isValidStreamType(eventData).should.be.false;
//            });
//        });
//    });
//
//    describe('#EVENTNAME', function() {
//        context('called on an event with a name', function() {
//            it('should return proper name', function() {
//                mut.eventName(eventData).should.eql(Maybe.of('someEventNotificationOn'));
//            });
//        });
//        context('called on an event with no namew ', function() {
//            it('should return nothing', function() {
//                eventData.OriginalEvent.Metadata = new Buffer(JSON.stringify({
//                    streamType: 'command'
//                }));
//                mut.eventName(eventData).should.eql(Maybe.Nothing());
//            });
//        });
//    });
//
//    describe('#CONTINUEATION', function() {
//        context('called on an event with a continuationID', function() {
//            it('should return proper continuationID', function() {
//                mut.continuationId(eventData).should.eql(Maybe.of(continuationId));
//            });
//        });
//
//        context('called on an event with no continuationID', function() {
//            it('should return proper Maybe Nothin', function() {
//                eventData.OriginalEvent.Metadata = new Buffer(JSON.stringify({
//                    streamType: 'command'
//                }));
//                mut.continuationId(eventData).should.eql(Maybe.Nothing());
//            });
//        });
//    });
//
//    describe('#ORIGINALPOSITION', function() {
//        context('called on an event with an originalPosition', function() {
//            it('should return proper originalPosition', function() {
//                mut.originalPosition(eventData).should.eql(Maybe.of(eventData.OriginalPosition));
//            });
//        });
//
//        context('called on an eventn with no originalPosition', function() {
//            it('should return proper Maybe Nothin', function() {
//                eventData.OriginalPosition = undefined;
//                mut.originalPosition(eventData).should.eql(Maybe.Nothing());
//            });
//        });
//    });
//
//    describe('#TRANSFORMEVENT', function() {
//        context('called on an event with all expected properties', function() {
//            it('should return new event form with all properties', function() {
//                var event = mut.transformEvent(eventData);
//                event.continuationId.should.eql(continuationId);
//            });
//        });
//
//    });
//
//    describe('#ISNONSYSTEMEVENT', function() {
//        context('when calling isNonSystemEvent on a system event', function() {
//            it('should return a null maybe', function() {
//                mut.isNonSystemEvent(sysEvent).should.eql(Maybe.of(false));
//            })
//        });
//        //
//        context('when calling isNonSystemEvent on a NON system event', function() {
//            it('should return a maybe of true', function() {
//                mut.isNonSystemEvent(eventData).should.eql(Maybe.of(true));
//            })
//        });
//    });
//});
