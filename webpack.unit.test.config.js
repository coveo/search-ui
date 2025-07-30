'use strict';
const _ = require('underscore');
const webpack = require('webpack');
const path = require('path');
const globalizePath = __dirname + '/lib/globalize/globalize.min.js';

module.exports = {
  entry: {
    unitTests: ['./unitTests/Test.ts']
  },
  output: {
    path: require('path').resolve('./bin/tests'),
    filename: '[name].js',
    libraryTarget: 'var',
    library: 'coveotest',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.svg'],
    alias: {
      l10n: __dirname + '/lib/l10n/l10n.min.js',
      globalize: globalizePath,
      'modal-box': __dirname + '/lib/modal-box/ModalBox.min.js',
      'magic-box': __dirname + '/node_modules/coveomagicbox/bin/MagicBox.min.js',
      'default-language': __dirname + '/src/strings/DefaultLanguage.js',
      jQuery: __dirname + '/test/lib/jquery.js',
      styling: __dirname + '/sass',
      svg: __dirname + '/image/svg'
    },
    modules: ['node_modules', path.resolve(__dirname, '../bin/image/css')]
  },
  plugins: [
    new webpack.DefinePlugin({
      DISABLE_LOGGER: false
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /underscore-min.js/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: '//# sourceMappingURL=underscore-min.map',
              replace: ''
            }
          }
        ]
      },
      {
        test: require.resolve(globalizePath),
        use: [
          {
            loader: 'expose-loader?Globalize'
          }
        ]
      },
      {
        test: /jquery.js/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: '//@ sourceMappingURL=jquery.min.map',
              replace: ''
            }
          }
        ]
      },
      {
        test: /promise|es6-promise/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: '//# sourceMappingURL=es6-promise.map',
              replace: ''
            }
          }
        ]
      },
      {
        test: /coveo\.analytics\/dist\/.*\.js/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: '(?!\n).*.map',
              flags: 'g',
              replace: ''
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-inline-loader'
          }
        ]
      },
      {
        test: /\.(scss)$/,
        use: [{ loader: 'null-loader' }]
      }
    ]
  }
};
