var path = require('path');
var commonOptions = require('./common_options');

module.exports = {
    mode: 'production',
    entry: commonOptions.entry.concat(path.join(__dirname, '../lib/umd.js')),
    devtool: 'source-map',
    output: Object.assign({}, commonOptions.output, {
        filename: 'pbl_calculator_engine_umd.js',
        library: 'PBLCalculatorEngine',
        libraryTarget: 'umd',
    }),
    resolve: commonOptions.resolve,
    module: {
        rules: commonOptions.loaders,
    },
};
