/**
 * Created by rharik on 6/19/15.
 */

require('must');
var _eventStore = require('eventstore');
var _eventHandlerBase = require('eventhandlerbase');
var _readStoreRepository = require('readstorerepository')({unitTest: true});
var eventModels = require('eventmodels')();
var JSON = require('JSON');
var index = require('../../src/index');
var TestHandler = require('./mocks/TestEventHandler');

var eventStore;
var mod;
var mut;
var testHandler;
var eventHandlerBase;
var readStoreRepository;

describe('gesDispatcher', function() {

    before(function() {
        eventStore = _eventStore({unitTest: true});
        readStoreRepository = _readStoreRepository;
        eventHandlerBase = _eventHandlerBase(eventStore,readStoreRepository);
        var _testHandler = TestHandler(eventHandlerBase);
        testHandler = new _testHandler();
        mut = index([testHandler], eventStore);
    });

    beforeEach(function() {
        testHandler.clearEventsHandled();
    });

    describe('#Instanciate Dispatcher', function() {
        context('when instanciating dispatcher with no handlers', function () {
            it('should throw proper error',  function () {
                (function(){index()}).must.throw(Error,"Invariant Violation: Dispatcher requires at least one handler");
            })
        });
    });
    describe('#StartDispatching', function() {
        context('when calling StartDispatching', function () {
            it('should handle event',  function () {
                mut.startDispatching();
                var eventData = {
                    Event:{EventType:'event'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{eventName:'someEventNotificationOn', streamType: 'event'},
                        Data:{'some':'data'}
                    }
                };
                eventStore.gesConnection.appendToStream('someEventNotificationOn', eventData, ()=>{});
                setTimeout(function(){
                    testHandler.eventsHandled.length.must.equal(1);
                }, 200);

            });

            it('should should emit the proper type',  function () {
                mut.startDispatching();
                var eventData = {
                    Event:{EventType:'event'},
                    OriginalPosition:'the originalPosition',
                    OriginalEvent:{
                        Metadata:{eventName:'someEventNotificationOn', streamType:'event'},
                        Data:{'some':'data'}
                    }

                };
                eventStore.gesConnection.appendToStream('someEventNotificationOn', eventData, ()=>{});
                setTimeout(function(){
                    testHandler.eventsHandled[0].must.be.instanceof(eventModels.gesEvent);
                }, 200);
            });

            it('should all the expected values on it',  function () {
                mut.startDispatching();
                var eventData = {
                    Event:{EventType:'event'},
                    OriginalPosition:'the originalPosition',
                    OriginalEvent:{
                        Metadata:{eventName:'someEventNotificationOn', streamType: 'event'},
                        Data:{'some':'data'}
                    }
                };
                eventStore.gesConnection.appendToStream('someEventNotificationOn', eventData, ()=>{});
                setTimeout(function(){
                    var eventsHandled = testHandler.eventsHandled[0];
                    eventsHandled.eventTypeName.must.equal('someEventNotificationOn');
                    eventsHandled.originalPosition.must.equal('the originalPosition');
                    eventsHandled.metadata.eventTypeName.must.equal('someEventNotificationOn');
                    eventsHandled.data.some.must.equal('data');
                }, 200);

            })
        });

        context('when calling StartDispatching with filter breaking vars', function () {
            it('should not post event to handler for system event',  function () {
                mut.startDispatching();
                var eventData = {
                    Event:{EventType:'$testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{eventName:'someEventNotificationOn', streamType: 'event'},
                        Data:{'some':'data'}
                    }

                };
                eventStore.gesConnection.appendToStream('someEventNotificationOn', eventData, ()=>{});
                setTimeout(function(){
                    testHandler.eventsHandled.length.must.equal(0);
                }, 200);
            });
            it('should not post event to handler for empty metadata',  function () {
                mut.startDispatching();
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{},
                        Data:{'some':'data'}
                    }

                };
                eventStore.gesConnection.appendToStream('someEventNotificationOn', eventData, ()=>{});
                setTimeout(function(){
                    testHandler.eventsHandled.length.must.equal(0);
                }, 200);
            });
            it('should not post event to handler for empty data',  function () {
                mut.startDispatching();
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{eventName:'someEventNotificationOn', streamType: 'event'},
                        Data:{}
                    }

                };
                eventStore.gesConnection.appendToStream('someEventNotificationOn', eventData, ()=>{});
                setTimeout(function(){
                    testHandler.eventsHandled.length.must.equal(0);
                }, 200);
            });

            it('should not break when empty metadata or data',  function () {
                mut.startDispatching();
                var eventData = {
                    Event:{Type:'testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{}
                };
                eventStore.gesConnection.appendToStream('someEventNotificationOn', eventData, ()=>{});
                setTimeout(function(){
                    testHandler.eventsHandled.length.must.equal(0);
                }, 200);
            });
        });

    });


});
