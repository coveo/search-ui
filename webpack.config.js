'use strict';
const _ = require('underscore');
const minimize = process.argv.indexOf('--minimize') !== -1;


let conf = require('./webpackConfigFiles/webpack.common.config');
conf = _.extend(conf, {
  entry: {
    'CoveoJsSearch': ['./src/Index.ts'],
    'CoveoJsSearch.Searchbox': './src/SearchboxIndex.ts'
  },
  output: {
    path: require('path').resolve('./bin/js'),
    filename: minimize ? '[name].min.js' : '[name].js',
    libraryTarget: 'umd',
    // See Index.ts as for why this need to be a temporary variable
    library: 'Coveo__temporary',
    publicPath : '/js/',
    devtoolModuleFilenameTemplate: '[resource-path]'
  }
})

module.exports = conf;
