'use strict';
const _ = require('underscore');
const minimize = process.argv.indexOf('minimize') !== -1;
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const production = process.env.NODE_ENV === 'production';
const globalizePath = __dirname + '/lib/globalize/globalize.min.js';
const svg4everybodyPath = __dirname + '/node_modules/svg4everybody/dist/svg4everybody';

let bail;
let plugins = [];
let additionalRules = [];

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

plugins.push(new webpack.DefinePlugin({
  DISABLE_LOGGER: minimize
}));

plugins.push(new webpack.ProvidePlugin({
  'Promise' : 'es6-promise/dist/es6-promise.auto'
}));

// SpritesmithPlugin takes care of outputting the stylesheets.

if (production) {
  const extractSass = new ExtractTextPlugin({
    filename: '../css/CoveoFullSearchNewDesign.css'
  });
  additionalRules.push({
    test: /\.scss/,
    use: extractSass.extract({
      use: [{
        loader: 'css-loader',
        options: {
          sourceMap: false
        }
      }, {
        loader: 'resolve-url-loader',
        options: {
          keepQuery: true
        }
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
  });
  plugins.push(extractSass);
  bail = true;
} else {
  additionalRules.push({
    test: /\.scss/,
    use: [{
      loader: 'style-loader',
      options: {
        publicPath: ''
      }
    }, {
      loader: 'css-loader',
      options: {
        sourceMap: true
      }
    }, {
      loader: 'resolve-url-loader',
      options: {
        keepQuery: true
      }
    }, {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }]
  });
  bail = false;
}

module.exports = {
  entry: {
    'CoveoJsSearch.Lazy': ['./src/Lazy.ts'],
    'CoveoJsSearch': ['./src/Eager.ts']
  },
  output: {
    path: path.resolve('./bin/js'),
    filename: minimize ? '[name].min.js' : '[name].js',
    chunkFilename: minimize ? '[name].min.js' : '[name].js',
    libraryTarget: 'umd',
    // See SwapVar.ts as for why this need to be a temporary variable
    library: 'Coveo__temporary',
    publicPath: 'js/',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.svg'],
    alias: {
      'l10n': __dirname + '/lib/l10n/l10n.min.js',
      'globalize': globalizePath,
      'modal-box': __dirname + '/node_modules/modal-box/bin/ModalBox.min.js',
      'magic-box': __dirname + '/node_modules/coveomagicbox/bin/MagicBox.min.js',
      'svg4everybody': svg4everybodyPath,
      'default-language': __dirname + '/src/strings/DefaultLanguage.js',
      'jQuery': __dirname + '/test/lib/jquery.js',
      'styling': __dirname + '/sass',
      'svg': __dirname + '/image/svg'
    },
    modules: ['node_modules', path.resolve(__dirname, '../bin/image/css')]
  },
  devtool: 'source-map',
  module: {
    rules: additionalRules.concat([{
      test: /underscore-min.js/,
      use: [{
        loader: 'string-replace-loader',
        options: {
          search: '//# sourceMappingURL=underscore-min.map',
          replace: ''
        }
      }]
    },
    {
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
      test: /\.(gif|png|jpe?g|ttf|woff2?|eot)$/,
      use: [{
        loader: 'file-loader',
        options: {
          // name: production ? '../image/[name].[ext]' : 'http://localhost:8080/image/[name].[ext]',
          name: '../image/[name].[ext]',
          emitFile: false,
          publicPath: ' ',
        }
      }]
    }, {
      test: /\.svg$/,
      use: [{
        loader: 'svg-inline-loader'
      }]
    },
    {
      test: /\.ts$/,
      use: [{
        loader: 'ts-loader'
      }]
    }])
  },
  plugins: plugins,
  bail: bail
};
