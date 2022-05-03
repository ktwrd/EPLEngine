const base = require('./webpack.config')

module.exports = {
    ...base,
    mode: 'production',
    target: 'node',
    devServer: {},
    output: {
        path: path.resolve(__dirname),
        filename: 'library.js'
    }
}