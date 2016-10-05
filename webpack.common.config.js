'use strict';
const webpack = require('webpack');
const minimize = process.argv.indexOf('--minimize') !== -1;
const colors = require('colors');
const failPlugin = require('webpack-fail-plugin');

// Fail plugin will allow the webpack ts-loader to fail correctly when the TS compilation fails
// Provide plugin allows us to use underscore in every module, without having to require underscore everywhere.
let plugins = [failPlugin];

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  resolve: {
    extensions: ['', '.ts', '.js'],
    alias: {
      'l10n': __dirname + '/lib/l10n/l10n.min.js',
      'globalize': __dirname + '/lib/globalize/globalize.min.js',
      'modal-box': __dirname + '/node_modules/modal-box/bin/ModalBox.min.js',
      'magic-box': __dirname + '/node_modules/coveomagicbox/bin/MagicBox.min.js',
      'default-language': __dirname + '/src/strings/DefaultLanguage.js',
      'underscore': __dirname + '/node_modules/underscore/underscore-min.js',
      'jQuery': __dirname + '/test/lib/jquery.js'
    }
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'awesome-typescript-loader'},
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
      {
        test: /promise|es6-promise/,
        loader: 'string-replace-loader',
        query: {
          // Prevent es6 promise from loading adjacent sourcemap (not needed anyways)
          search: '//# sourceMappingURL=es6-promise.map',
          replace: ''
        }
      }
    ]
  },
  plugins: plugins,
  bail: true
}
