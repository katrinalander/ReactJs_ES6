// Karma configuration

const webpack = require('../../webpack.config.js');
const configBase = require('../base.js');
// const configBase = require('../base.js');

webpack.entry = null;

webpack.plugins = [
    webpack.plugins[0], // ExtractTextPlugin from webpack.config.js
    webpack.plugins[5] // DefinePlugin from webpack.config.js
];

module.exports = function(config) {
  const configObj = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../..',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha','es6-shim','intl-shim'],


    // list of files / patterns to load in the browser
    files: [
        './src/tests/index.js',
        './node_modules/phantomjs-polyfill/bind-polyfill.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/**/*.js': ['webpack']
    },
    plugins: [
        'karma-es6-shim',
        'karma-intl-shim',
        'karma-mocha',
        'karma-phantomjs-launcher',
        'karma-webpack',
        'karma-junit-reporter',
        'karma-coverage'
    ],
    webpack: webpack,
    webpackMiddleware: {
      stats: { colors: true, modules: false, chunks: false, fimings: true}
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,
    proxies: {},

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  };

  configObj.proxies[configBase.api.namespace + '/'] = configBase.environments.mock + configBase.api.namespace + '/';

  config.set(configObj);
};
