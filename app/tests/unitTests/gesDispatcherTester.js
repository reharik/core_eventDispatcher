///**
// * Created by rharik on 6/19/15.
// */
//
//var should = require('chai').should();
//var expect = require('chai').expect;
//
//var options = {
//    dagon:{
//        logger: {
//            moduleName: 'EventDispatcher'
//        }
//    },
//    logger: {
//        moduleName: 'EventDispatcher',
//        level:'error'
//    }
//};
//
//var container = require('../../registry_test')(options);
//
//var eventModels     = container.getInstanceOf('eventmodels');
//var _mut            = container.getInstanceOf('eventDispatcher');
//var _fantasy            = container.getInstanceOf('_fantasy');
//var _            = container.getInstanceOf('_');
//var eventStore      = container.getInstanceOf('eventstore');
//var _testHandler = container.getInstanceOf('TestEventHandler');
//var uuid = container.getInstanceOf('uuid');
//var testHandler;
//var mut;
//
//
//describe('gesDispatcher', function() {
//
//
//    before(function() {
//
//    });
//
//    beforeEach(function() {
//        mut             = _mut();
//        testHandler = _testHandler();
//    });
//
//    afterEach(function(){
//        testHandler.clearEventsHandled();
//        eventStore.reset();
//    });
//
//    describe('#Instanciate Dispatcher', function() {
//        context('when instanciating dispatcher with no handlers', function() {
//            it('should throw proper error', function() {
//                var errorMsg = '';
//                try {
//                    _mut().startDispatching();
//                }catch(ex){
//                    errorMsg = ex.message;
//                }
//                errorMsg.should.equal("Invariant Violation: Dispatcher requires at least one handler");
//            })
//        });
//    });
//    describe('#StartDispatching', function() {
//        context('when calling StartDispatching', function() {
//            it('should handle event', async function() {
//                mut.startDispatching([testHandler]);
//                var eventData = {
//                    Event           : {EventType: 'event'},
//                    OriginalPosition: {},
//                    OriginalEvent   : {
//                        Metadata: new Buffer( JSON.stringify({
//                            eventName : 'someEventNotificationOn',
//                            streamType: 'command'
//                        })),
//                        Data    : new Buffer( JSON.stringify({'some': 'data'}))
//                    }
//                };
//                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {
//                });
//                testHandler.getHandledEvents().length.should.equal(1);
//            });
//
//            it('should emit the proper type', async function() {
//                mut             = _mut();
//                mut.startDispatching([testHandler]);
//                var eventData = {
//                    Event           : {EventType: 'event'},
//                    OriginalPosition: 'the originalPosition',
//                    OriginalEvent   : {
//                        Metadata: new Buffer( JSON.stringify({
//                            eventName : 'someEventNotificationOn',
//                            streamType: 'command'
//                        })),
//                        Data    : new Buffer( JSON.stringify({'some': 'data'}))
//                    }
//
//                };
//                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//                testHandler.eventsHandled[0].should.have.property('eventName');
//            });
//
//            it('should all the expected values on it', async function() {
//                mut             = _mut();
//                mut.startDispatching([testHandler]);
//                var continuationId = uuid.v4();
//                var eventData     = {
//                    Event           : {EventType: 'event'},
//                    OriginalPosition: 'the originalPosition',
//                    OriginalEvent   : {
//                        Metadata: new Buffer( JSON.stringify({
//                            eventName : 'someEventNotificationOn',
//                            streamType: 'command',
//                            continuationId: continuationId
//                        })),
//                        Data    : new Buffer( JSON.stringify({'some': 'data'}))
//                    }
//                };
//                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//                var eventsHandled = testHandler.eventsHandled[0];
//                eventsHandled.eventName.should.equal('someEventNotificationOn');
//                eventsHandled.originalPosition.should.equal('the originalPosition');
//                eventsHandled.continuationId.should.equal(continuationId);
//                eventsHandled.data.some.should.equal('data');
//            })
//        });
//
//        context('when calling StartDispatching with filter breaking vars', function() {
//
//            //it('should not post event to handler for system event', async function() {
//            //    var ef = eventModels.eventFunctions;
//            //    var fh = eventModels.functionalHelpers;
//            //    var isCommandTypeEvent =  _.compose(_.map(fh.matches('command')), _.chain(fh.safeProp('streamType')), ef.parseMetadata);
//            //    var vent = {
//            //        Event           : {EventType: 'testEvent'},
//            //        OriginalPosition: {},
//            //        OriginalEvent   : {
//            //            Metadata: new Buffer(JSON.stringify({
//            //                eventName : 'someEventNotificationOn',
//            //                streamType: 'command'
//            //            })),
//            //            Data    : {'some': 'data'}
//            //        }
//            //
//            //    };
//            //    var result = [vent].filter(x=>_.lift(_.and)( ef.isNonSystemEvent(x), isCommandTypeEvent(x)).isJust()).map(x=>x == x);
//            //    //result
//            //    //var result = filter(vent);
//            //    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
//            //    console.log(result)
//            //    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
//            //});
//
//
//            it('should not post event to handler for system event', async function() {
//                mut.startDispatching([testHandler]);
//                var eventData = {
//                    Event           : {EventType: '$testEvent'},
//                    OriginalPosition: {},
//                    OriginalEvent   : {
//                        Metadata: new Buffer( JSON.stringify({
//                            eventName : 'someEventNotificationOn',
//                            streamType: 'command'
//                        })),
//                        Data    : new Buffer( JSON.stringify({'some': 'data'}))
//                    }
//
//                };
//                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {
//                });
//                testHandler.eventsHandled.length.should.equal(0);
//            });
//            it('should not post event to handler for empty metadata', async function() {
//                mut.startDispatching([testHandler]);
//                var eventData = {
//                    Event           : {EventType: 'testEvent'},
//                    OriginalPosition: {},
//                    OriginalEvent   : {
//                        Metadata: {},
//                        Data    : new Buffer( JSON.stringify({'some': 'data'}))
//                    }
//
//                };
//                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//                testHandler.eventsHandled.length.should.equal(0);
//            });
//            it('should not post event to handler for empty data', async function() {
//                mut.startDispatching([testHandler]);
//                var eventData = {
//                    Event           : {EventType: 'testEvent'},
//                    OriginalPosition: {},
//                    OriginalEvent   : {
//                        Metadata: new Buffer( JSON.stringify({
//                            eventName : 'someEventNotificationOn',
//                            streamType: 'command'
//                        })),
//                        Data    : {}
//                    }
//
//                };
//                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//                testHandler.eventsHandled.length.should.equal(0);
//            });
//
//            it('should not break when empty metadata or data', async function() {
//                mut.startDispatching([testHandler]);
//                var eventData = {
//                    Event           : {Type: 'testEvent'},
//                    OriginalPosition: {},
//                    OriginalEvent   : {}
//                };
//                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//                testHandler.eventsHandled.length.should.equal(0);
//            });
//
//            it('should not break when empty metadata or data', async function() {
//                var eventData = {
//                    Event           : {Type: 'testEvent'},
//                    OriginalPosition: {},
//                    OriginalEvent   : {}
//                };
//                eventStore.subscribeToAllFrom().on('event', function(x){ console.log(x)})
//                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//            });
//
//        });
//    });
//});
//
//
