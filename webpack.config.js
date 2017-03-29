'use strict';
const _ = require('underscore');
const minimize = process.argv.indexOf('minimize') !== -1;
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const spritesmithConfig = require('./webpackConfigFiles/spritesmithConfig/spritesmith.config.js');
const salesforceSpritesmithConfig = require('./webpackConfigFiles/spritesmithConfig/salesforce.spritesmith.config');
const production = process.env.NODE_ENV === 'production';
let conf = require('./webpackConfigFiles/webpack.common.config');
let bail;

// SpritesmithPlugin takes care of outputting the stylesheets.
conf.plugins.push(spritesmithConfig);
conf.plugins.push(salesforceSpritesmithConfig);

if (production) {
  // ExtractTextPlugin allows to output a css bundle instead of dynamically adding style tags
  const extractSass = new ExtractTextPlugin({
    filename: '../css/[name].css',
  });
  conf.module.rules.push({
    test: /\.scss/,
    use: extractSass.extract({
      use: [{
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'resolve-url-loader'
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }],
      fallback: 'style-loader'
    })
  });
  conf.plugins.push(extractSass);
  bail = true;

} else {
  conf.module.rules.push({
    test: /\.scss/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader',
      options: {
        sourceMap: 'true'
      }
    }, {
      loader: 'resolve-url-loader'
    }, {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }]
  });
  bail = false;
}

conf.module.rules.push({
  test: /\.(gif|svg|png|jpe?g|ttf|woff2?|eot)$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: '../image/[name].[ext]',
      emitFile: false
    }
  }]
});

conf.entry = {
  'CoveoJsSearch.Lazy': ['./src/Lazy.ts'],
  'CoveoJsSearch': ['./src/Eager.ts']
};

conf.output = {
  path: path.resolve('./bin/js'),
  filename: minimize ? '[name].min.js' : '[name].js',
  chunkFilename: minimize ? '[name].min.js' : '[name].js',
  libraryTarget: 'umd',
  // See SwapVar.ts as for why this need to be a temporary variable
  library: 'Coveo__temporary',
  publicPath: 'js/',
  devtoolModuleFilenameTemplate: '[resource-path]'
};

module.exports = conf;
