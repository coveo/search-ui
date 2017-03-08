'use strict';
const _ = require('underscore');
const minimize = process.argv.indexOf('minimize') !== -1;
const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


let conf = require('./webpackConfigFiles/webpack.common.config');
conf = _.extend(conf, {
  entry: {
    'CoveoJsSearch.Lazy': ['./src/Lazy.ts'],
    'CoveoJsSearch': ['./src/Eager.ts']
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
    }),
    //new webpack.optimize.DedupePlugin(),
    /*new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      // Host that will be used in `server` mode to start HTTP server.
      analyzerHost: '127.0.0.1',
      // Port that will be used in `server` mode to start HTTP server.
      analyzerPort: 8888,
     })*/
  ])

module.exports = conf;
