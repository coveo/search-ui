'use strict';
const _ = require('underscore');
const webpack = require('webpack');

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
  plugins: conf.plugins.concat([
    new webpack.LoaderOptionsPlugin({
      options: {
        ts: {
          project: 'docs.tsconfig.json'
        }
      }
    })
  ])
})

module.exports = conf;
