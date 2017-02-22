'use strict';
const _ = require('underscore');

let conf = require('./webpack.common.config');
conf = _.extend(conf, {
  entry: {
    'playground': ['./docs/playground/src/Index.ts'],
  },
  output: {
    path: require('path').resolve('./docs/theme/assets/gen/js'),
    filename: '[name].js',
    libraryTarget: 'var',
    library: 'playground',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
  ts: {
    configFileName: 'docs.tsconfig.json'
  }
})

module.exports = conf;
