'use strict';
const webpack = require('webpack');
const minimize = process.argv.indexOf('--minimize') !== -1;
const colors = require('colors');
const failPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const live = process.env.NODE_ENV === 'production';

// Fail plugin will allow the webpack ts-loader to fail correctly when the TS compilation fails
// Provide plugin allows us to use underscore in every module, without having to require underscore everywhere.
let plugins = [failPlugin, new webpack.ProvidePlugin({_: 'underscore'}), new ExtractTextPlugin('../css/CoveoFullSearchNewDesign.css')];

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

let sassLoader = { test: /\.scss/ };
if (live) {
  sassLoader['loader'] = ExtractTextPlugin.extract('style-loader', '!css!resolve-url!sass-loader');
} else {
  sassLoader['loaders'] = ['style?insertAt=bottom', 'css?sourceMap', 'resolve-url', 'sass?sourceMap'];
}

module.exports = {
  resolve: {
    extensions: ['', '.ts', '.js'],
    alias: {
      'l10n': __dirname + '/lib/l10n.min.js',
      'globalize': __dirname + '/lib/globalize.min.js',
      'modal-box': __dirname + '/node_modules/modal-box/bin/ModalBox.min.js',
      'fastclick': __dirname + '/lib/fastclick.min.js',
      'jstz': __dirname + '/lib/jstz.min.js',
      'magic-box': __dirname + '/node_modules/coveomagicbox/bin/MagicBox.min.js',
      'default-language': __dirname + '/src/strings/DefaultLanguage.js',
      'underscore': __dirname + '/node_modules/underscore/underscore-min.js',
      'jQuery': __dirname + '/test/lib/jquery.js'
    }
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts-loader'},
      {
        test: /underscore-min.js/,
        loader: 'string-replace-loader',
        query: {
          // Prevent Underscore from loading adjacent sourcemap (not needed anyways)
          search: '//# sourceMappingURL=underscore-min.map',
          replace: ''
        }
      },
      {
        test: /jquery.js/,
        loader: 'string-replace-loader',
        query: {
          // Prevent jQuery from loading adjacent sourcemap (not needed anyways)
          search: '//@ sourceMappingURL=jquery.min.map',
          replace: ''
        }
      },
      sassLoader,
      {
        test: /\.(gif|svg|png|jpe?g|ttf|woff2?|eot)$/, loader: 'url?limit=8182'
      }
    ]
  },
  plugins: plugins,
  bail: true
}
