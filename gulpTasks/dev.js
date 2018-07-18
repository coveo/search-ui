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
const args = require('yargs').argv;

const port = args.port || 8080;
const unitTestsPort = args.port || 8081;
const accessibilityTestsPort = args.port || 8082;

const webpackConfig = require('../webpack.config.js');
webpackConfig.entry['CoveoJsSearch.Lazy'].unshift(`webpack-dev-server/client?http://localhost:${port}/`);
const compiler = webpack(webpackConfig);

const webpackConfigUnitTest = require('../webpack.unit.test.config.js');
webpackConfigUnitTest.entry['unitTests'].unshift(`webpack-dev-server/client?http://localhost:${unitTestsPort}/`);
const compilerUnitTest = webpack(webpackConfigUnitTest);

const webpackConfigAccessibilityTest = require('../webpack.accessibility.test.config.js');
webpackConfigAccessibilityTest.entry['accessibilityTests'].unshift(`webpack-dev-server/client?http://localhost:${accessibilityTestsPort}/`);
const compilerAccessibilityTest = webpack(webpackConfigAccessibilityTest);

let server;

const debouncedLinkToExternal = _.debounce(() => {
  console.log('... Compiler done ... Linking external projects'.black.bgGreen);
  buildUtilities.exec('node', ['./environments/link.externally.js'], undefined, function() {});
}, 1000);

const watchHtmlPagesOnce = _.once(() => {
  glob('bin/*.html', (err, files) => {
    files.forEach(file => {
      fs.watch(file, () => {
        if (server.sockets && server.sockets[0]) {
          server.sockets[0].write(JSON.stringify({ type: 'ok' }));
        }
      });
    });
  });
});

compiler.plugin('done', () => {
  debouncedLinkToExternal();
  watchHtmlPagesOnce();
});

gulp.task('dev', ['setup'], done => {
  server = new WebpackDevServer(compiler, {
    compress: true,
    contentBase: 'bin/',
    publicPath: `http://localhost:${port}/js/`,
    disableHostCheck: true,
    compress: true,
    stats: {
      colors: true,
      publicPath: true
    }
  });
  server.listen(port, 'localhost', () => {});
  done();
});

gulp.task('devTest', ['setupTests'], function(done) {
  var serverTests = new WebpackDevServer(compilerUnitTest, {
    contentBase: 'bin/',
    publicPath: '/tests/',
    compress: true
  });
  serverTests.listen(unitTestsPort, 'localhost', () => {});
  done();
});

gulp.task('devAccessibilityTest', ['setupTests'], done => {
  var serverTests = new WebpackDevServer(compilerAccessibilityTest, {
    contentBase: 'bin/',
    publicPath: '/tests/',
    compress: true
  });
  serverTests.listen(accessibilityTestsPort, 'localhost', () => {});
  done();
});
