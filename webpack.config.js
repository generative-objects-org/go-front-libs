var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'go-front-libs.js',
        library: 'goFrontLibs',
        libraryTarget: 'umd'
    }
};
