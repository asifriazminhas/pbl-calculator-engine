var path = require('path');
var commonOptions = require('./common_options');

module.exports = {
    entry: commonOptions.entry,
    output: Object.assign({}, commonOptions.output, {
        filename: 'pbl_calculator_engine_umd.js',
        library: 'PBLCalculatorEngine',
        libraryTarget: 'umd'
    }),
    resolve: commonOptions.resolve,
    module: {
        loaders: commonOptions.loaders
    }
};