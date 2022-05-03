const path = require('path')
const base = require('./webpack.config')

module.exports = {
    ...base,
    entry: './demo/index.ts',
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'demo'),
        },
        compress: true,
        port: 9000,
        hot: true,
        watchFiles: [ 'demo/**/*', './node_modules/eplengine/**/*' ],
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        }
    },
    output: {
        path: path.resolve(__dirname, 'demo'),
        filename: 'bundle.js'
    }
}