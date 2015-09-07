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
    logger: {
        moduleName: 'EventDispatcher',
        level:'error'
    }
};

describe('gesDispatcher', function() {

    var container = require('../../registry_test')(options);
    before(function() {
        var TestHandler = container.getInstanceOf('TestEventHandler');
        eventStore      = container.getInstanceOf('eventstore');
        eventModels     = container.getInstanceOf('eventmodels');
        _mut            = container.getInstanceOf('eventDispatcher');
        testHandler     = new TestHandler();
        mut             = _mut([testHandler]);
    });

    beforeEach(function() {
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
                mut.startDispatching();
                var eventData = {
                    Event           : {EventType: 'event'},
                    OriginalPosition: {},
                    OriginalEvent   : {
                        Metadata: {
                            eventName : 'someEventNotificationOn',
                            streamType: 'event'
                        },
                        Data    : {'some': 'data'}
                    }
                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {
                });
                testHandler.getHandledEvents().length.should.equal(1);
            });

            it('should emit the proper type', async function() {
                mut.startDispatching();
                var eventData = {
                    Event           : {EventType: 'event'},
                    OriginalPosition: 'the originalPosition',
                    OriginalEvent   : {
                        Metadata: {
                            eventName : 'someEventNotificationOn',
                            streamType: 'event'
                        },
                        Data    : {'some': 'data'}
                    }

                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
                testHandler.eventsHandled[0].should.have.property('eventName');
            });

            it('should all the expected values on it', async function() {
                mut.startDispatching();
                var eventData     = {
                    Event           : {EventType: 'event'},
                    OriginalPosition: 'the originalPosition',
                    OriginalEvent   : {
                        Metadata: {
                            eventName : 'someEventNotificationOn',
                            streamType: 'event'
                        },
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
                mut.startDispatching();
                var eventData = {
                    Event           : {EventType: '$testEvent'},
                    OriginalPosition: {},
                    OriginalEvent   : {
                        Metadata: {
                            eventName : 'someEventNotificationOn',
                            streamType: 'event'
                        },
                        Data    : {'some': 'data'}
                    }

                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {
                });
                testHandler.eventsHandled.length.should.equal(0);
            });
            it('should not post event to handler for empty metadata', async function() {
                mut.startDispatching();
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
                mut.startDispatching();
                var eventData = {
                    Event           : {EventType: 'testEvent'},
                    OriginalPosition: {},
                    OriginalEvent   : {
                        Metadata: {
                            eventName : 'someEventNotificationOn',
                            streamType: 'event'
                        },
                        Data    : {}
                    }

                };
                await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
                testHandler.eventsHandled.length.should.equal(0);
            });

            it('should not break when empty metadata or data', async function() {
                mut.startDispatching();
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


