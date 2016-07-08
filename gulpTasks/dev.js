const gulp = require('gulp');
const shell = require('gulp-shell');
const colors = require('colors');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const buildUtilities = require('../gulpTasks/buildUtilities.js');

var webpackConfig = require('../webpack.config.js');
webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080/');
const compiler = webpack(webpackConfig);

compiler.plugin('done', function () {
  setTimeout(function () {
    console.log('... Compiler done ... Linking external projects'.black.bgGreen);
    buildUtilities.exec('node', ['./environments/link.externally.js'], undefined, function () {
    })
  }, 1000)
})

gulp.task('dev', ['setup', 'prepareSass'], function (done) {
  var server = new WebpackDevServer(compiler, {
    contentBase: 'bin/',
    publicPath: '/js/',
    compress: true
  });
  server.listen(8080, 'localhost', function () {
  });
  done();
})
