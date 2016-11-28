var path = require('path');

module.exports = [
    {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
            useBabel: true,
            babelOptions: {
                extends: path.join(__dirname, '../../.babelrc')
            },
            configFileName: path.join(__dirname, '../../tsconfig.json')
        }
    }
];