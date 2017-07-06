'use strict';
const gulp = require('gulp');
const colors = require('colors');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const buildUtilities = require('../gulpTasks/buildUtilities.js');
const _ = require('underscore');
const path = require('path');
const fs = require('fs');

let webpackConfig = require('../webpack.config.js');
webpackConfig.entry['CoveoJsSearch.Lazy'].unshift('webpack-dev-server/client?http://localhost:8080/');
const compiler = webpack(webpackConfig);

let webpackConfigTest = require('../webpack.test.config.js');
webpackConfigTest.entry['tests'].unshift('webpack-dev-server/client?http://localhost:8081/');
const compilerTest = webpack(webpackConfigTest);

let debouncedLinkToExternal = _.debounce(()=> {
  console.log('... Compiler done ... Linking external projects'.black.bgGreen);
  buildUtilities.exec('node', ['./environments/link.externally.js'], undefined, function () {
  })
}, 1000);

compiler.plugin('done', ()=> {
  debouncedLinkToExternal();
});

gulp.task('dev', ['setup', 'deleteCssFile'], (done)=> {
  let server = new WebpackDevServer(compiler, {
    compress: true,
    contentBase: 'bin/',
    publicPath: 'http://localhost:8080/js/',
    disableHostCheck: true,
    /*headers: {
      'Content-Security-Policy': "script-src 'self' code.jquery.com static.cloud.coveo.com 'unsafe-inline'"
    },*/
    stats: {
      colors: true,
      publicPath: true
    }
  });
  server.listen(8080, 'localhost', ()=> {
  });
  done();
});

gulp.task('deleteCssFile', (done) => {
  // Rely on dynamically loaded style.
  // fs.unlink('./bin/css/CoveoFullSearchNewDesign.css', () => {
      done();
  // });
})

gulp.task('devTest', ['setupTests'], function (done) {
  var serverTests = new WebpackDevServer(compilerTest, {
    contentBase: 'bin/',
    publicPath: '/tests/',
    compress: true
  });
  serverTests.listen(8081, 'localhost', ()=> {
  });
  done();
});
/*
gulp.task('devPlayground', function (done) {
  var serverPlayground = new WebpackDevServer(compilerPlayground, {
    contentBase: 'docgen/',
    publicPath: '/assets/gen/js/',
    compress: true
 });
  serverPlayground.listen(8082, 'localhost', ()=> {
 });
  done();
 });
 */
