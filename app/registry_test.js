/**
 * Created by parallels on 9/3/15.
 */
"use strict";

var dagon = require('dagon');
var path = require('path');

module.exports = function(_options) {
    var options = _options || {};
    var container = dagon(options.dagon).container;
    var result;
    try {
        result = container(x=>
        x.pathToRoot(path.join(__dirname,'..'))
            .requireDirectoryRecursively('./app/src')
            .requireDirectoryRecursively('./app/tests/unitTests/mocks')
            .requiredModuleRegistires(['eventstore','eventmodels','eventhandlerbase'])
            //.for('eventstore').require('./app/tests/unitTests/mocks/eventStoreMock')
            //.for('readstorerepository').require('./app/tests/unitTests/mocks/readStoreRepositoryMock')
            .for('corelogger').renameTo('logger')
            .for('ramda').renameTo('R')
            .for('ramdafantasy').renameTo('_fantasy')
            .for('bluebird').renameTo('Promise')
            .for('eventstore').replaceWith('eventStoreMock')
            .for('readstorerepository').replaceWith('readStoreRepositoryMock')
            .for('eventmodels').replaceWith('eventModelsPlugin')
            .for('eventhandlerbase').replaceWith('eventHandlerPlugin')
            .complete(),
            x=>x.instantiate('eventstore').asFunc().withParameters(options.children || {})
                //.instantiate('readstorerepository').asFunc().withParameters(options.children || {})
                .complete());
    } catch (ex) {
        console.log(ex);
        console.log(ex.stack);
    }
    return result;
};
