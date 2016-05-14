module.exports = {
  entry: ['./src/dependencies.js', './src/Index.ts'],
  output: {
    path: './bin',
    filename: 'coveo.search.js',
    libraryTarget: 'assign',
    library: ['Coveo']
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    alias: {
      'l10n': __dirname + '/lib/l10n.min.js',
      'globalize': __dirname + '/lib/globalize.min.js',
      'modal-box': __dirname + '/node_modules/modal-box/bin/ModalBox.min.js',
      'fast-click': __dirname + '/lib/fastclick.min.js',
      'jstz': __dirname + '/lib/jstz.min.js',
      'magic-box': __dirname + '/node_modules/coveomagicbox/bin/MagicBox.min.js'
    }
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts-loader'}
    ]
  }
}