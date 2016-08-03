const webpack = require('webpack');
const minimize = process.argv.indexOf('--minimize') !== -1;
const colors = require('colors');
const failPlugin = require('webpack-fail-plugin');

// Fail plugin will allow the webpack ts-loader to fail correctly when the TS compilation fails
// Provide plugin allows us to use underscore in every module, without having to require underscore everywhere.
var plugins = [failPlugin, new webpack.ProvidePlugin({_: 'underscore'})];

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}


module.exports = {
  entry: {
    'CoveoJsSearch': ['./src/Index.ts'],
    'CoveoJsSearch.Searchbox': './src/SearchboxIndex.ts'
  },
  output: {
    path: require('path').resolve('./bin/js'),
    filename: minimize ? '[name].min.js' : '[name].js',
    libraryTarget: 'umd',
    // See Index.ts as for why this need to be a temporary variable
    library: 'Coveo__temporary',
    publicPath : '/js/',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
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
      'pikaday': __dirname + '/node_modules/pikaday/pikaday.js'
    }
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
      {
        test: /underscore-min.js/,
        loader: 'string-replace-loader',
        query: {
          // Prevent Underscore from loading adjacent sourcemap (not needed anyways)
          search: '//# sourceMappingURL=underscore-min.map',
          replace: ''
        }
      }
    ]
  },
  plugins: plugins,
  bail: true
}
