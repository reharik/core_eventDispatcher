/**
 * Created by rharik on 6/19/15.
 */

'use strict';

var should = require('chai').should();
var expect = require('chai').expect;
var eventStore;
var eventModels;
var _mut;
var mut;
var testHandler;
var options = {
    dagon: {
        logger: {
            moduleName: 'EventDispatcher'
        }
    },
    logger: {
        moduleName: 'EventDispatcher',
        level: 'error'
    }
};

describe('gesDispatcher', function () {

    var container = require('../../registry_test')(options);
    before(function () {
        var TestHandler = container.getInstanceOf('TestEventHandler');
        eventStore = container.getInstanceOf('eventstore');
        eventModels = container.getInstanceOf('eventmodels');
        _mut = container.getInstanceOf('eventDispatcher');
        testHandler = new TestHandler();
        mut = _mut([testHandler]);
    });

    beforeEach(function () {
        testHandler.clearEventsHandled();
    });

    describe('#Instanciate Dispatcher', function () {
        context('when instanciating dispatcher with no handlers', function () {
            it('should throw proper error', function () {
                var errorMsg;
                try {
                    _mut();
                } catch (ex) {
                    errorMsg = ex.message;
                }
                errorMsg.should.equal("Invariant Violation: Dispatcher requires at least one handler");
            });
        });
    });
    describe('#StartDispatching', function () {
        context('when calling StartDispatching', function () {
            it('should handle event', function callee$3$0() {
                var eventData;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            mut.startDispatching();
                            eventData = {
                                Event: { EventType: 'event' },
                                OriginalPosition: {},
                                OriginalEvent: {
                                    Metadata: {
                                        eventName: 'someEventNotificationOn',
                                        streamType: 'event'
                                    },
                                    Data: { 'some': 'data' }
                                }
                            };
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(eventStore.appendToStreamPromise('someEventNotificationOn', eventData, function () {}));

                        case 4:
                            testHandler.getHandledEvents().length.should.equal(1);

                        case 5:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });

            it('should emit the proper type', function callee$3$0() {
                var eventData;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            mut.startDispatching();
                            eventData = {
                                Event: { EventType: 'event' },
                                OriginalPosition: 'the originalPosition',
                                OriginalEvent: {
                                    Metadata: {
                                        eventName: 'someEventNotificationOn',
                                        streamType: 'event'
                                    },
                                    Data: { 'some': 'data' }
                                }

                            };
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(eventStore.appendToStreamPromise('someEventNotificationOn', eventData, function () {}));

                        case 4:
                            testHandler.eventsHandled[0].should.have.property('eventName');

                        case 5:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });

            it('should all the expected values on it', function callee$3$0() {
                var eventData, eventsHandled;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            mut.startDispatching();
                            eventData = {
                                Event: { EventType: 'event' },
                                OriginalPosition: 'the originalPosition',
                                OriginalEvent: {
                                    Metadata: {
                                        eventName: 'someEventNotificationOn',
                                        streamType: 'event'
                                    },
                                    Data: { 'some': 'data' }
                                }
                            };
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(eventStore.appendToStreamPromise('someEventNotificationOn', eventData, function () {}));

                        case 4:
                            eventsHandled = testHandler.eventsHandled[0];

                            eventsHandled.eventName.should.equal('someEventNotificationOn');
                            eventsHandled.originalPosition.should.equal('the originalPosition');
                            eventsHandled.metadata.eventName.should.equal('someEventNotificationOn');
                            eventsHandled.data.some.should.equal('data');

                        case 9:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });

        context('when calling StartDispatching with filter breaking vars', function () {
            it('should not post event to handler for system event', function callee$3$0() {
                var eventData;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            mut.startDispatching();
                            eventData = {
                                Event: { EventType: '$testEvent' },
                                OriginalPosition: {},
                                OriginalEvent: {
                                    Metadata: {
                                        eventName: 'someEventNotificationOn',
                                        streamType: 'event'
                                    },
                                    Data: { 'some': 'data' }
                                }

                            };
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(eventStore.appendToStreamPromise('someEventNotificationOn', eventData, function () {}));

                        case 4:
                            testHandler.eventsHandled.length.should.equal(0);

                        case 5:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
            it('should not post event to handler for empty metadata', function callee$3$0() {
                var eventData;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            mut.startDispatching();
                            eventData = {
                                Event: { EventType: 'testEvent' },
                                OriginalPosition: {},
                                OriginalEvent: {
                                    Metadata: {},
                                    Data: { 'some': 'data' }
                                }

                            };
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(eventStore.appendToStreamPromise('someEventNotificationOn', eventData, function () {}));

                        case 4:
                            testHandler.eventsHandled.length.should.equal(0);

                        case 5:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
            it('should not post event to handler for empty data', function callee$3$0() {
                var eventData;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            mut.startDispatching();
                            eventData = {
                                Event: { EventType: 'testEvent' },
                                OriginalPosition: {},
                                OriginalEvent: {
                                    Metadata: {
                                        eventName: 'someEventNotificationOn',
                                        streamType: 'event'
                                    },
                                    Data: {}
                                }

                            };
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(eventStore.appendToStreamPromise('someEventNotificationOn', eventData, function () {}));

                        case 4:
                            testHandler.eventsHandled.length.should.equal(0);

                        case 5:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });

            it('should not break when empty metadata or data', function callee$3$0() {
                var eventData;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            mut.startDispatching();
                            eventData = {
                                Event: { Type: 'testEvent' },
                                OriginalPosition: {},
                                OriginalEvent: {}
                            };
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(eventStore.appendToStreamPromise('someEventNotificationOn', eventData, function () {}));

                        case 4:
                            testHandler.eventsHandled.length.should.equal(0);

                        case 5:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });
    });
});