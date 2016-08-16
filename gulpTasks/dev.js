'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');
const colors = require('colors');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const buildUtilities = require('../gulpTasks/buildUtilities.js');
const _ = require('underscore');

let webpackConfig = require('../webpack.config.js');
webpackConfig.entry['CoveoJsSearch'].unshift('webpack-dev-server/client?http://localhost:8080/');
const compiler = webpack(webpackConfig);

let webpackConfigTest = require('../webpack.test.config');
webpackConfigTest.entry['tests'].unshift('webpack-dev-server/client?http://localhost:8081/');
const compilerTest = webpack(webpackConfigTest);

let debounced = _.debounce(()=> {
  console.log('... Compiler done ... Linking external projects'.black.bgGreen);
  buildUtilities.exec('node', ['./environments/link.externally.js'], undefined, function () {
  })
}, 1000)

compiler.plugin('done', ()=> {
  debounced();
})

gulp.task('dev', ['setup', 'prepareSass'], (done)=> {
  let server = new WebpackDevServer(compiler, {
    contentBase: 'bin/',
    publicPath: '/js/',
    compress: true
  });
  server.listen(8080, 'localhost', ()=> {
  });
  done();
})

gulp.task('devTest', ['setupTests'], function (done) {
  var serverTests = new WebpackDevServer(compilerTest, {
    contentBase: 'bin/',
    publicPath: '/tests/',
    compress: true
  });
  serverTests.listen(8081, 'localhost', ()=> {
  })
  done();
})
