'use strict';
const webpack = require('webpack');
const minimize = process.argv.indexOf('minimize') !== -1;
const colors = require('colors');
const path = require('path');
const globalizePath = __dirname + '/../lib/globalize/globalize.min.js';
let plugins = [];

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
    alias: {
      'l10n': __dirname + '/../lib/l10n/l10n.min.js',
      'globalize': globalizePath,
      'modal-box': __dirname + '/../node_modules/modal-box/bin/ModalBox.min.js',
      'magic-box': __dirname + '/../node_modules/coveomagicbox/bin/MagicBox.min.js',
      'default-language': __dirname + '/../src/strings/DefaultLanguage.js',
      'jQuery': __dirname + '/../test/lib/jquery.js',
      'styling': __dirname + '/../sass'
    },
    modules: ['node_modules', path.resolve(__dirname, '../bin/image/css')]
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            project: 'tsconfig.json'
          }
        }]
      }, {
        test: /underscore-min.js/,
        use: [{
          loader: 'string-replace-loader',
          options: {
            search: '//# sourceMappingURL=underscore-min.map',
            replace: ''
          }
        }]
      }, {
        test: require.resolve(globalizePath),
        use: [{
          loader: 'expose-loader?Globalize'
        }]
      }, {
        test: /jquery.js/,
        use: [{
          loader: 'string-replace-loader',
          options: {
            search: '//@ sourceMappingURL=jquery.min.map',
            replace: ''
          }
        }]
      }, {
        test: /promise|es6-promise/,
        use: [{
          loader: 'string-replace-loader',
          options: {
            search: '//# sourceMappingURL=es6-promise.map',
            replace: ''
          }
        }]
      }, {
        test: /coveo\.analytics\/dist\/.*\.js/,
        use: [{
          loader: 'string-replace-loader',
          options: {
            search: '(?!\n).*\.map',
            flags: 'g',
            replace: ''
          }
        }]
      }
    ]
  },
  plugins: plugins
};
