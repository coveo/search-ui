'use strict';
const _ = require('underscore');
const minimize = process.argv.indexOf('minimize') !== -1;
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const spritesmithConfig = require('./spritesmithConfig/spritesmith.config.js');
const salesforceSpritesmithConfig = require('./spritesmithConfig/salesforce.spritesmith.config');
const production = process.env.NODE_ENV === 'production';
let conf = require('../webpackConfigFiles/webpack.common.config');
let bail;

// SpritesmithPlugin takes care of outputting the stylesheets.
conf.plugins.push(spritesmithConfig);
conf.plugins.push(salesforceSpritesmithConfig);

if (production) {
  // ExtractTextPlugin allows to output a css bundle instead of dynamically adding style tags
  const extractSass = new ExtractTextPlugin({
    filename: '../css/CoveoFullSearchNewDesign.css'
  });
  conf.module.rules.push({
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
  });
  conf.plugins.push(extractSass);
  bail = true;

} else {
  conf.module.rules.push({
    test: /\.scss/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader',
      options: {
        sourceMap: 'true'
      }
    }, {
      loader: 'resolve-url-loader'
    }, {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }]
  });
  bail = false;
}

conf.module.rules.push({
  test: /\.(gif|svg|png|jpe?g|ttf|woff2?|eot)$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: production ? '../image/[name].[ext]' : 'http://localhost:8080/image/[name].[ext]',
      emitFile: false
    }
  }]
});

conf.module.rules.push({
  test: /\.ts$/,
  use: [{
    loader: 'ts-loader',
    options: {
      project: path.resolve('test.tsconfig.json')
    }
  }]
});


conf.entry = {
  'tests': ['./test/Test.ts'],
};

conf.output = {
  path: require('path').resolve('./bin/tests'),
  filename: '[name].js',
  libraryTarget: 'var',
  library: 'Coveo',
  devtoolModuleFilenameTemplate: '[resource-path]'
};

module.exports = conf;

