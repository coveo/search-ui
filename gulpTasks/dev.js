'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');
const colors = require('colors');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const buildUtilities = require('../gulpTasks/buildUtilities.js');

let webpackConfigSrc = require('../webpack.config.js');
webpackConfigSrc.entry['CoveoJsSearch'].unshift('webpack-dev-server/client?http://localhost:8080/');
const compilerSrc = webpack(webpackConfigSrc);

let webpackConfigTest = require('../webpack.test.config');
webpackConfigSrc.entry['tests'].unshift('webpack-dev-server/client?http://localhost:8081/');
const compilerTest = webpack(webpackConfigTest);

compilerSrc.plugin('done', function () {
  setTimeout(function () {
    console.log('... Compiler done ... Linking external projects'.black.bgGreen);
    buildUtilities.exec('node', ['./environments/link.externally.js'], undefined, function () {
    })
  }, 1000)
})

gulp.task('dev', ['setup', 'prepareSass', 'setupTests'], function (done) {
  var serverSrc = new WebpackDevServer(compilerSrc, {
    contentBase: 'bin/',
    publicPath: '/js/',
    compress: true
  });
  serverSrc.listen(8080, 'localhost', ()=> {
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
