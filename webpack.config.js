'use strict';
const path = require('path');

const autoprefixer = require('autoprefixer');
const Webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackHtmlPlugin = require('html-webpack-plugin');
const WebpackCircularDependencyPlugin = require('circular-dependency-plugin');
const WebpackForceCaseSensitivity = require('force-case-sensitivity-webpack-plugin');
const WebpackCommonChunk = Webpack.optimize.CommonsChunkPlugin;
const WebpackWriteFilePlugin = require('write-file-webpack-plugin');
const WebpackCopyPlugin = require('copy-webpack-plugin');

const configBase = require('./config/base');
const configTest = require('./config/webpack/test');
const configDev = require('./config/webpack/dev');
const configMock = require('./config/webpack/mock');

const mode = {
    isTest: (process.env.MODE === 'test'),
    isDevelopment: (process.env.MODE === 'development'),
    isMocked: (process.env.MOCKED === 'true')
}

const configCommon = {
    context: configBase.paths.source,
    output: {
        path: configBase.paths.output,
        filename: 'js/[name]_[hash].js'
    },
    resolve: {
        modules: [
            configBase.paths.source,
            configBase.paths.nodeModules
        ]
    },
    module: {
      rules: [
          { test: /\.css$/,
            exclude: configBase.paths.assets,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                { loader: 'resolve-url-loader' }
            ]
          },
          { test: /\.css$/,
              exclude: configBase.paths.nodeModules,
              use: ExtractTextPlugin.extract({
                  fallback: [{
                      loader: 'style-loader'
                  }],
                  use: [{
                      loader: 'css-loader',
                      options: {
                          modules: true,
                          camelCase: 'dashes',
                          localIdentName: configBase.webpack.loader.css.localIdentName,
                          url: false
                      }
                  },
                  {loader: 'resolve-url-loader'}
                  ]
              })
          },
          { test: /\.scss$/,
              exclude: configBase.paths.nodeModules,
              use: [
                  { loader: 'style-loader' },
                  {
                      loader: 'css-loader',
                      options: {
                          modules: true,
                          camelCase: 'dashes',
                          localIdentName: configBase.webpack.loader.css.localIdentName
                      }
                  },
                  {
                      loader: 'postcss-loader',
                      options: {
                          plugins: () => [autoprefixer],
                          sourceMap: true
                      }
                  },
                  { loader: 'resolve-url-loader' },
                  {
                      loader: 'sass-loader',
                      options: {
                          sourceMap: true
                      }
                  }
              ]
          },
          {
              test:  /\.(png|jpg|jpeg|gif)$/,
              exclude: configBase.paths.nodeModules,
              loader: 'url-loader?name=img/[name].[ext]?[hash]'
          },
          {
              test: /\.woff(2)?(\?[a-z0-9]+)?$/,
              loader: "url-loader?limit=10000&mimetype=application/font-woff"
          }, {
              test: /\.(ttf|eot|svg)(\?[a-z0-9]+)?$/,
              loader: "file-loader"
          },
          {
              test:/\.js?$/,
              exclude: [configBase.paths.nodeModules],
              loader: 'babel-loader',
              query: {
                  cacheDirectory: true,
                  extends: path.resolve(__dirname, 'config/babel/.babelrc')
              }
          }
      ]
    },
    plugins: [
        new ExtractTextPlugin('css/style.css'),
        new WebpackHtmlPlugin({
            template: 'index.html',
            title: 'Tutorial with UnitTests',
            inject: true,
            chunksSortMode: 'dependency'
        }),
        new WebpackCircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            failOnError: true
        }),
        new Webpack.NoEmitOnErrorsPlugin(),
        new WebpackForceCaseSensitivity(),
        new WebpackCommonChunk({
            names: ['vendor','manifest']
        }),
        new Webpack.DefinePlugin({
            IS_DEVELOPMENT: mode.isDevelopment || mode.isTest,
            IS_MOCKED: mode.isMocked,
            API_NAMESPACE_CONFIG: JSON.stringify(configBase.api.namespace)
        }),
        new WebpackWriteFilePlugin(),
        new WebpackCopyPlugin([{
            from: 'error.html',
            to: 'error.html'
        }])
    ],
    devServer: {
        contentBase: configBase.paths.output + '/',
        port: 3000
    },
    stats: {
        errors: true,
        warnings: false
    }
};

const config = webpackMerge(configCommon, mode.isTest ? configTest : mode.isMocked ? configMock : configDev);

module.exports = config;