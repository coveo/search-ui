'use strict';
const webpack = require('webpack');
const minimize = process.argv.indexOf('--minimize') !== -1;
const colors = require('colors');
const failPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const spritesmithPlugin = require('./spritesmithConfig/spritesmith.config.js');
const path = require('path');
const live = process.env.NODE_ENV === 'production';

// Fail plugin will allow the webpack ts-loader to fail correctly when the TS compilation fails
// Provide plugin allows us to use underscore in every module, without having to require underscore everywhere.
let plugins = [failPlugin, new ExtractTextPlugin('../css/[name].css'), spritesmithPlugin];
let sassLoader = { test: /\.scss/ };

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

let globalizePath = __dirname + '/../lib/globalize/globalize.min.js';
if (live) {
  sassLoader['loader'] = ExtractTextPlugin.extract('style-loader', 'css-loader!resolve-url-loader!sass-loader?sourceMap', {
    publicPath: ''
  });
} else {
  sassLoader['loaders'] = ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap'];
}

module.exports = {
  resolve: {
    extensions: ['', '.ts', '.js', '.scss'],
    alias: {
      'l10n': __dirname + '/../lib/l10n/l10n.min.js',
      'globalize': globalizePath,
      'modal-box': __dirname + '/../node_modules/modal-box/bin/ModalBox.min.js',
      'magic-box': __dirname + '/../node_modules/coveomagicbox/bin/MagicBox.min.js',
      'default-language': __dirname + '/../src/strings/DefaultLanguage.js',
      'jQuery': __dirname + '/../test/lib/jquery.js',
      'styling': __dirname + '/../sass'
    },
    moduleDirectories: [path.resolve(__dirname, '../bin/image/css')]
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts-loader'},
      {
        test: require.resolve(globalizePath),
        loader: 'expose-loader?Globalize'
      },
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
      },
      sassLoader,
      {
        test: /\.(gif|svg|png|jpe?g|ttf|woff2?|eot)$/, loader: 'file-loader', query: {name: '../image/[name].[ext]', emitFile: false}, 
      }
    ]
  },
  plugins: plugins,
  bail: true
}
