'use strict';
const _ = require('underscore');
const minimize = process.argv.indexOf('--minimize') !== -1;
const webpack = require('webpack');
const path = require('path');


let conf = require('./webpackConfigFiles/webpack.common.config');
conf = _.extend(conf, {
  entry: {
    'CoveoJsSearch.Lazy': ['./src/Lazy.ts']
  },
  output: {
    path: path.resolve('./bin/js'),
    filename: minimize ? '[name].min.js' : '[name].js',
    chunkFilename: minimize ? '[name].min.js' : '[name].js',
    libraryTarget: 'umd',
    // See Index.ts as for why this need to be a temporary variable
    library: 'Coveo__temporary',
    publicPath: 'js/',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
  plugins: conf.plugins.concat([
    new webpack.LoaderOptionsPlugin({
      options: {
        ts: {
          project: 'tsconfig.json'
        }
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true
    })
  ])
})

module.exports = conf;
