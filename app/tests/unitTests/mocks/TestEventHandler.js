/**
 * Created by rharik on 6/19/15.
 */
"use strict";
module.exports = function(eventhandlerbase,
                          logger,
                          appdomain) {
    return {
        handlesEvents: ['bootstrapApplication','someEventNotificationOn'],
        handleEvent  : function(event) {
            console.log('==========event=========');
            console.log(event);
            console.log('==========ENDevent=========');
            var handler = eventhandlerbase(event, 'BootstrapApplicationWorkflow', this.handlers[event.eventName]);
            return handler.application(event);
        },
        handlers     : {
            bootstrapApplication(vnt) {
                console.log('==========bootstrappHandler=========');
                console.log(vnt);
                console.log('==========ENDbootstrappHandler=========');
                return 'success'
            },
            someEventNotificationOn(event){
                console.log('==========someEventNotificationOn=========');
                console.log(event);
                console.log('==========ENDsomeEventNotificationOn=========');
                return success;
            }
        }
    }
};