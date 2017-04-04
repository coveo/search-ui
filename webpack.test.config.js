'use strict';
const _ = require('underscore');
const minimize = process.argv.indexOf('minimize') !== -1;
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const spritesmithConfig = require('./webpackConfigFiles/spritesmithConfig/spritesmith.config.js');
const salesforceSpritesmithConfig = require('./webpackConfigFiles/spritesmithConfig/salesforce.spritesmith.config');
const production = process.env.NODE_ENV === 'production';
const globalizePath = __dirname + '/lib/globalize/globalize.min.js';

let plugins = [];

// SpritesmithPlugin takes care of outputting the stylesheets.
plugins.push(spritesmithConfig);
plugins.push(salesforceSpritesmithConfig);

const extractSass = new ExtractTextPlugin({
  filename: '../css/CoveoFullSearchNewDesign.css'
});

plugins.push(extractSass)


module.exports = {
  entry: {
    'tests': ['./test/Test.ts']
  },
  output: {
    path: require('path').resolve('./bin/tests'),
    filename: '[name].js',
    libraryTarget: 'var',
    library: 'Coveo',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
    alias: {
      'l10n': __dirname + '/lib/l10n/l10n.min.js',
      'globalize': globalizePath,
      'modal-box': __dirname + '/node_modules/modal-box/bin/ModalBox.min.js',
      'magic-box': __dirname + '/node_modules/coveomagicbox/bin/MagicBox.min.js',
      'default-language': __dirname + '/src/strings/DefaultLanguage.js',
      'jQuery': __dirname + '/test/lib/jquery.js',
      'styling': __dirname + '/sass'
    },
    modules: ['node_modules', path.resolve(__dirname, '../bin/image/css')]
  },
  devtool: 'source-map',
  module: {
    rules: [{
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
    }, {
      test: /\.(gif|svg|png|jpe?g|ttf|woff2?|eot)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: production ? '../image/[name].[ext]' : 'http://localhost:8080/image/[name].[ext]',
          emitFile: false
        }
      }]
    }, {
      test: /\.ts$/,
      use: [{
        loader: 'ts-loader'
      }]
    }, {
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
        fallback: 'style-loader',
        // This is important to set the correct relative path inside the generated css correctly
        publicPath: ''
      })
    }]
  },
  plugins: plugins
};
