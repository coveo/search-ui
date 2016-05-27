const gulp = require('gulp');
const tsc = require('gulp-tsc');
const TestServer = require('karma').Server;
const express = require('express');

gulp.task('test', ['buildTest'], function (done) {
  new TestServer({
    configFile: __dirname + '/../karma.conf.js',
  }, function(){done();}).start();
});

gulp.task('testDev', ['watchTest'], function (done) {
  new TestServer({
    configFile: __dirname + '/../karma.dev.conf.js',
  }, done).start();
})

gulp.task('serverTest', function (done) {
  var app = express();
  app.use('/', express.static(__dirname + '/../test'));
  app.use('/bin', express.static(__dirname + '/../bin'));
  app.use('/node_modules', express.static(__dirname + '/../node_modules'));
  app.listen(8081, function() {
    console.log('Server started : Available at localhost:8081/SpecRunner.html');
  });
})

gulp.task('buildTest', function () {
  return gulp.src('./test/Test.ts')
      .pipe(tsc({
        target: 'ES5',
        out: 'tests.js',
        module: 'amd',
        inlineSourceMap: true
      }))
      .pipe(gulp.dest('./bin/tests'))
})

gulp.task('watchTest', ['buildTest', 'src'], function () {
  gulp.watch(['./src/**/*.ts'], ['src']);
  gulp.watch(['./test/**/*.ts'], ['buildTest']);
})