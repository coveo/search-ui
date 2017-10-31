'use strict';
const baseConfig = require('./webpack.config');
baseConfig.entry = {
  playground: ['./docs/playground/src/Index.ts']
};
baseConfig.output = {
  path: require('path').resolve('./docs/theme/assets/gen/js'),
  filename: '[name].js',
  libraryTarget: 'var',
  library: 'playground',
  devtoolModuleFilenameTemplate: '[resource-path]'
};

module.exports = baseConfig;
