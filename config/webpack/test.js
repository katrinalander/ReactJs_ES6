'use strict';

const Webpack = require('webpack');

const configBase = require('../base');

const configObj = {
    entry: {
        application: [
            'mocha-loader!./tests/index'
        ]
    },
    externals: {
        'react/addons': true,
        'react/lib/ReactContext': true,
        'react/lib/ExecutionEnvironment': true,
        'mocha': true
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        proxy: {},
        port: 3002,
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
    target: configBase.environments.mock,
    secure: false,
    changeOrigin: true
};

module.exports = configObj;