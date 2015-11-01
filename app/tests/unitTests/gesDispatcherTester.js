/**
 * Created by rharik on 6/19/15.
 */

var should = require('chai').should();
var expect = require('chai').expect;
var eventStore;
var eventModels;
var _mut;
var mut;
var testHandler;
var options = {
    dagon:{
        logger: {
            moduleName: 'EventDispatcher'
        }
    },
    logger: {
        moduleName: 'EventDispatcher',
        level:'error'
    }
};




//
//
// issue is with the eventstore mock.  it holds on to it's published events needs to be resest before each
//
//





describe('gesDispatcher', function() {

    var container = require('../../registry_test')(options);
    before(function() {
        var TestHandler = container.getInstanceOf('TestEventHandler');
        eventModels     = container.getInstanceOf('eventmodels');
        _mut            = container.getInstanceOf('eventDispatcher');
        testHandler     = new TestHandler();
        mut             = _mut();
    });

    beforeEach(function() {
        var _eventStore      = container.getInstanceOf('eventstore');
        eventStore = new _eventStore();
        testHandler.clearEventsHandled();
    });

    describe('#Instanciate Dispatcher', function() {
        context('when instanciating dispatcher with no handlers', function() {
            it('should throw proper error', function() {
                var errorMsg;
                try {
                    _mut()
                }catch(ex){
                    errorMsg = ex.message;
                }
                errorMsg.should.equal("Invariant Violation: Dispatcher requires at least one handler");
            })
        });
    });
    describe('#StartDispatching', function() {
        context('when calling StartDispatching', function() {
            it('should handle event', async function() {
                mut.startDispatching([testHandler]);
                var eventData = {
                    Event           : {EventType: 'event'},
                    OriginalPosition: {},
                    OriginalEvent   : {
                        Metadata: new Buffer( JSON.stringify({
                            eventName : 'someEventNotificationOn',
                            streamType: 'command'
                        })),
                        Data    : {'some': 'data'}
                    }
                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {
                });
                console.log('testHandler.getHandledEvents()')
                console.log(testHandler.getHandledEvents())
                testHandler.getHandledEvents().length.should.equal(1);
            });

            it('should emit the proper type', async function() {
                mut.startDispatching([testHandler]);
                var eventData = {
                    Event           : {EventType: 'event'},
                    OriginalPosition: 'the originalPosition',
                    OriginalEvent   : {
                        Metadata: new Buffer( JSON.stringify({
                            eventName : 'someEventNotificationOn',
                            streamType: 'command'
                        })),
                        Data    : {'some': 'data'}
                    }

                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
                testHandler.eventsHandled[0].should.have.property('eventName');
            });

            it('should all the expected values on it', async function() {
                mut.startDispatching([testHandler]);
                var eventData     = {
                    Event           : {EventType: 'event'},
                    OriginalPosition: 'the originalPosition',
                    OriginalEvent   : {
                        Metadata: new Buffer( JSON.stringify({
                            eventName : 'someEventNotificationOn',
                            streamType: 'command'
                        })),
                        Data    : {'some': 'data'}
                    }
                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
                var eventsHandled = testHandler.eventsHandled[0];
                eventsHandled.eventName.should.equal('someEventNotificationOn');
                eventsHandled.originalPosition.should.equal('the originalPosition');
                eventsHandled.metadata.eventName.should.equal('someEventNotificationOn');
                eventsHandled.data.some.should.equal('data');
            })
        });

        context('when calling StartDispatching with filter breaking vars', function() {
            it('should not post event to handler for system event', async function() {
                mut.startDispatching([testHandler]);
                var eventData = {
                    Event           : {EventType: '$testEvent'},
                    OriginalPosition: {},
                    OriginalEvent   : {
                        Metadata: new Buffer( JSON.stringify({
                            eventName : 'someEventNotificationOn',
                            streamType: 'command'
                        })),
                        Data    : {'some': 'data'}
                    }

                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {
                });
                testHandler.eventsHandled.length.should.equal(0);
            });
            it('should not post event to handler for empty metadata', async function() {
                mut.startDispatching([testHandler]);
                var eventData = {
                    Event           : {EventType: 'testEvent'},
                    OriginalPosition: {},
                    OriginalEvent   : {
                        Metadata: {},
                        Data    : {'some': 'data'}
                    }

                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
                testHandler.eventsHandled.length.should.equal(0);
            });
            it('should not post event to handler for empty data', async function() {
                mut.startDispatching([testHandler]);
                var eventData = {
                    Event           : {EventType: 'testEvent'},
                    OriginalPosition: {},
                    OriginalEvent   : {
                        Metadata: new Buffer( JSON.stringify({
                            eventName : 'someEventNotificationOn',
                            streamType: 'command'
                        })),
                        Data    : {}
                    }

                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
                testHandler.eventsHandled.length.should.equal(0);
            });

            it('should not break when empty metadata or data', async function() {
                mut.startDispatching([testHandler]);
                var eventData = {
                    Event           : {Type: 'testEvent'},
                    OriginalPosition: {},
                    OriginalEvent   : {}
                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
                testHandler.eventsHandled.length.should.equal(0);
            });

        });
    });
});


