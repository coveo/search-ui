'use strict';
const _ = require('underscore');

let conf = require('./webpack.common.config');
conf = _.extend(conf, {
  entry: {
    'tests': ['./test/Test.ts'],
  },
  output: {
    path: require('path').resolve('./bin/tests'),
    filename: '[name].js'
  }
})

module.exports = conf;
