'use strict';
const webpack = require('webpack');
const minimize = process.argv.indexOf('--minimize') !== -1;
const colors = require('colors');
const failPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const path = require('path');
const live = process.env.NODE_ENV === 'production';

// Fail plugin will allow the webpack ts-loader to fail correctly when the TS compilation fails
// Provide plugin allows us to use underscore in every module, without having to require underscore everywhere.
let plugins = [failPlugin, new webpack.ProvidePlugin({_: 'underscore'}), new ExtractTextPlugin('../css/[name].css'),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, '../image'),
        glob: '{retina,sprites}/*.png'
      },
      target: {
        image: path.resolve(__dirname, '../bin/image/spritesNew.png'),
        css: [path.resolve(__dirname, '../bin/css/sprites.styl'),
              [path.resolve(__dirname, '../bin/css/allSprites.css'), {
                formatOpts: {
                  cssSelector: function(spriteGroup) {
                  return '.coveo-sprites-' + spriteGroup.name;
                  }
                },
              }]]
      },
      apiOptions: {
        cssImageRef: '../image/spritesNew.png',
      },
      retina: {
        classifier: function(spritePath) {
          var normalName;
          var retinaName;
          var isRetina = spritePath.indexOf('retina') != -1;
          if (isRetina) {
            normalName = spritePath.replace('retina', 'sprites');
            retinaName = spritePath;
          } else {
            normalName = spritePath;
            retinaName = spritePath.replace('sprites', 'retina');
          }

          var spriteDescription = {
            type: isRetina ? 'retina' : 'normal',
            normalName: normalName,
            retinaName: retinaName
          }

          return spriteDescription;
        },
        targetImage: path.resolve(__dirname, '../bin/image/retinaNew.png'),
        cssImageRef: '../image/retinaNew.png'
      }
    })];

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

let globalizePath = __dirname + '/../lib/globalize.min.js';

let sassLoader = { test: /\.scss/ };
if (live) {
  sassLoader['loader'] = ExtractTextPlugin.extract('style-loader', '!css!resolve-url!sass-loader?sourceMap');
} else {
  sassLoader['loaders'] = ['style?insertAt=bottom', 'css?sourceMap', 'resolve-url', 'sass?sourceMap'];
}

module.exports = {
  sassLoader: {
    globals: [__dirname + '/../bin/sass/_GeneratedIconsNew.scss']
  },
  resolve: {
    extensions: ['', '.ts', '.js', '.scss'],
    alias: {
      'l10n': __dirname + '/../lib/l10n.min.js',
      'globalize': globalizePath,
      'modal-box': __dirname + '/../node_modules/modal-box/bin/ModalBox.min.js',
      'fastclick': __dirname + '/../lib/fastclick.min.js',
      'jstz': __dirname + '/../lib/jstz.min.js',
      'magic-box': __dirname + '/../node_modules/coveomagicbox/bin/MagicBox.min.js',
      'default-language': __dirname + '/../src/strings/DefaultLanguage.js',
      'underscore': __dirname + '/../node_modules/underscore/underscore-min.js',
      'jQuery': __dirname + '/../test/lib/jquery.js',
      'styling': __dirname + '/../sass'
    },
    moduleDirectories: ['web_modules', 'node_modules', 'spritesmith-generated']
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
      },
      sassLoader,
      {
        test: /\.(gif|svg|png|jpe?g|ttf|woff2?|eot)$/, loader: 'url-loader', query: {limit: '1', name: '[path][name].[ext]'}
      },
      {
        test: /\.styl$/,
        loaders: ['style', 'css', 'stylus']
      },
      {
        test: /\.png$/,
        loaders: ['file?name=i/[hash].[ext]']
      }
    ]
  },
  plugins: plugins,
  bail: true
}
