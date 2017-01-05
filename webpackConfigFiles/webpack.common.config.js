'use strict';
const webpack = require('webpack');
const minimize = process.argv.indexOf('--minimize') !== -1;
const colors = require('colors');
const failPlugin = require('webpack-fail-plugin');

// Fail plugin will allow the webpack ts-loader to fail correctly when the TS compilation fails
// Provide plugin allows us to use underscore in every module, without having to require underscore everywhere.
let plugins = [failPlugin, new webpack.ProvidePlugin({_: 'underscore'})];

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

let globalizePath = __dirname + '/../lib/globalize.min.js';

module.exports = {
  resolve: {
    extensions: ['', '.ts', '.js'],
    alias: {
      'l10n': __dirname + '/../lib/l10n.min.js',
      'globalize': globalizePath,
      'modal-box': __dirname + '/../node_modules/modal-box/bin/ModalBox.min.js',
      'fastclick': __dirname + '/../lib/fastclick.min.js',
      'jstz': __dirname + '/../lib/jstz.min.js',
      'magic-box': __dirname + '/../node_modules/coveomagicbox/bin/MagicBox.min.js',
      'default-language': __dirname + '/../src/strings/DefaultLanguage.js',
      'underscore': __dirname + '/../node_modules/underscore/underscore-min.js',
      'jQuery': __dirname + '/../test/lib/jquery.js'
    }
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: require.resolve(globalizePath), loader: 'expose-loader?Globalize' },
      {
        test: /underscore-min.js/,
        loader: 'string-replace-loader',
        query: {
          search: '//# sourceMappingURL=underscore-min.map',
          replace: ''
        }
      },
      {
        test: /jquery.js/,
        loader: 'string-replace-loader',
        query: {
          search: '//@ sourceMappingURL=jquery.min.map',
          replace: ''
        }
      },
      {
        test: /promise|es6-promise/,
        loader: 'string-replace-loader',
        query: {
          search: '//# sourceMappingURL=es6-promise.map',
          replace: ''
        }
      },
      {
        test: /coveo\.analytics\/dist\/.*\.js/,
        loader: 'string-replace-loader',
        query: {
          search: '(?!\n).*\.map',
          flags: 'g',
          replace: ''
        }
      }
    ]
  },
  plugins: plugins,
  bail: true
}
