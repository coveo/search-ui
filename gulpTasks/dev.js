'use strict';
const gulp = require('gulp');
const colors = require('colors');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const buildUtilities = require('../gulpTasks/buildUtilities.js');
const _ = require('underscore');

let webpackConfig = require('../webpack.config.js');
webpackConfig.entry['CoveoJsSearch'].unshift('webpack-dev-server/client?http://localhost:8080/');
const compiler = webpack(webpackConfig);

let webpackConfigTest = require('../webpackConfigFiles/webpack.test.config');
webpackConfigTest.entry['tests'].unshift('webpack-dev-server/client?http://localhost:8081/');
const compilerTest = webpack(webpackConfigTest);

let webpackConfigPlayground = require('../webpackConfigFiles/webpack.playground.config');
webpackConfigPlayground.entry['playground'].unshift('webpack-dev-server/client?http://localhost:8082/');
const compilerPlayground = webpack(webpackConfigPlayground);

let debouncedLinkToExternal = _.debounce(()=> {
  console.log('... Compiler done ... Linking external projects'.black.bgGreen);
  buildUtilities.exec('node', ['./environments/link.externally.js'], undefined, function () {
  })
}, 1000);

let debouncedGenerateDoc = _.debounce(()=> {
  buildUtilities.exec('gulp', ['doc'], undefined, function () {
  })
}, 1000);

compiler.plugin('done', ()=> {
  debouncedLinkToExternal();
})

compilerPlayground.plugin('done', ()=> {
  debouncedGenerateDoc();
})

gulp.task('dev', ['setup', 'prepareSass'], (done)=> {
  let server = new WebpackDevServer(compiler, {
    contentBase: 'bin/',
    publicPath: '/js/',
    compress: true,
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-inline'"
    }
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

gulp.task('devPlayground', function (done) {
  var serverPlayground = new WebpackDevServer(compilerPlayground, {
    contentBase: 'docgen/',
    publicPath: '/assets/gen/js/',
    compress: true
  })
  serverPlayground.listen(8082, 'localhost', ()=> {
  })
  done();
})
