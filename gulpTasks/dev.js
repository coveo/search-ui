'use strict';
const gulp = require('gulp');
const colors = require('colors');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const buildUtilities = require('../gulpTasks/buildUtilities.js');
const _ = require('underscore');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

const webpackConfig = require('../webpack.config.js');
webpackConfig.entry['CoveoJsSearch.Lazy'].unshift('webpack-dev-server/client?http://localhost:8080/');
const compiler = webpack(webpackConfig);

const webpackConfigTest = require('../webpack.test.config.js');
webpackConfigTest.entry['tests'].unshift('webpack-dev-server/client?http://localhost:8081/');
const compilerTest = webpack(webpackConfigTest);

let server;

const debouncedLinkToExternal = _.debounce(() => {
  console.log('... Compiler done ... Linking external projects'.black.bgGreen);
  buildUtilities.exec('node', ['./environments/link.externally.js'], undefined, function() {});
}, 1000);

const watchHtmlPagesOnce = _.once(() => {
  glob('bin/*.html', (err, files) => {
    files.forEach(file => {
      fs.watch(file, () => {
        server.sockets.forEach(socket => {
          // Sending an "ok" message triggers a simple page reload in the client
          socket.write(JSON.stringify({ type: 'ok' }));
        });
      });
    });
  });
});


compiler.plugin('done', () => {
  debouncedLinkToExternal();
  watchHtmlPagesOnce();
});

gulp.task('dev', ['setup', 'deleteCssFile'], done => {
  server = new WebpackDevServer(compiler, {
    compress: true,
    contentBase: 'bin/',
    publicPath: 'http://localhost:8080/js/',
    disableHostCheck: true,
    stats: {
      colors: true,
      publicPath: true
    }
  });
  server.listen(8080, 'localhost', () => {});
  done();
});

gulp.task('deleteCssFile', done => {
  // Rely on dynamically loaded style.
  // fs.unlink('./bin/css/CoveoFullSearchNewDesign.css', () => {
  done();
  // });
});

gulp.task('devTest', ['setupTests'], function(done) {
  var serverTests = new WebpackDevServer(compilerTest, {
    contentBase: 'bin/',
    publicPath: '/tests/',
    compress: true
  });
  serverTests.listen(8081, 'localhost', () => {});
  done();
});
