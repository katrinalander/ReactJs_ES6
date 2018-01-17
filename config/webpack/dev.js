'use strict';

const Webpack = require('webpack');
const configBase = require('../base');

const configObj = {
    entry: {
        application: [
            'babel-polyfill',
            'webpack-dev-server/client?http://localhost:3000',
            './index'
        ]
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        proxy: {},
        hot: true,
        inline: true,
        historyApiFallback: true,
        stats: {
            chunks: false,
            warnings: false
        }
    },
    devtool: 'source-map'
};

configObj.devServer.proxy[configBase.api.namespace + '/*'] = {
    target: configBase.environments.dev,
    secure: false,
    changeOrigin: true
};

module.exports = configObj;