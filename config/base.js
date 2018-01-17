'use strict';

const path = require('path');

const base = {
    paths: {
        source: path.resolve(__dirname, '../src'),
        output: path.resolve(__dirname, '../build'),
        assets: path.resolve(__dirname, '../src/assets'),
        vendor: path.resolve(__dirname, '../vendor'),
        nodeModules: path.resolve(__dirname, '../node_modules')
    },
    api: {
        namespace: '/api/v1'
    },
    environments: {
      mock: 'http://localhost:3001'
    },
    webpack: {
        loader: {
            css: {
                localIdentName: '[name]---[local]---[hash:base64:5]'
            }
        }
    }
};

module.exports = base;