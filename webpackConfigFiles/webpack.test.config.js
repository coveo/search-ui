'use strict';
const _ = require('underscore');

let conf = require('./webpack.common.config.js');
conf = _.extend(conf, {
  entry: {
    'tests': ['./test/Test.ts'],
  },
  output: {
    path: require('path').resolve('./bin/tests'),
    filename: '[name].js',
    libraryTarget: 'var',
    library: 'Coveo',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
  ts: {
    configFile: 'test.tsconfig.json'
  }
})

module.exports = conf;
