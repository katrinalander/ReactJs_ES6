'use strict';

// Require all the necessary styles
require('./index.scss');
// require('intl/locale-data/jsonp/en.js');

// Require all tests
const context = require.context('.', true, /\.js?$/);
context.keys().forEach(context);

module.exports = context;