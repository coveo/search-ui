const webpack = require('webpack');
module.exports = {
  entry: ['./src/Dependencies.js', './src/Index.ts'],
  output: {
    path: './bin/js',
    filename: 'CoveoJsSearch.js',
    libraryTarget: 'var',
    library: ['Coveo'],
    publicPath : '/devserver/'
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    alias: {
      'l10n': __dirname + '/lib/l10n.min.js',
      'globalize': __dirname + '/lib/globalize.min.js',
      'modal-box': __dirname + '/node_modules/modal-box/bin/ModalBox.min.js',
      'fast-click': __dirname + '/lib/fastclick.min.js',
      'jstz': __dirname + '/lib/jstz.min.js',
      'magic-box': __dirname + '/node_modules/coveomagicbox/bin/MagicBox.js',
      'default-language': __dirname + '/src/strings/DefaultLanguage.js',
      'finally': __dirname + '/lib/finally.js'
    }
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts-loader'}
    ]
  },
  bail: true
}