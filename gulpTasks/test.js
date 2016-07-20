const gulp = require('gulp');
const tsc = require('gulp-tsc');
const TestServer = require('karma').Server;
const express = require('express');
const rename = require('gulp-rename');
const combineCoverage = require('istanbul-combine');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

const COVERAGE_DIR = 'bin/coverage';

gulp.task('coverage', ['lcovCoverage']);

gulp.task('test', ['buildTest'], function (done) {
  new TestServer({
    configFile: __dirname + '/../karma.conf.js',
  }, () => done()).start();
});

gulp.task('testDev', ['watchTest'], function (done) {
  new TestServer({
    configFile: __dirname + '/../karma.dev.conf.js',
  }, done).start();
})

gulp.task('remapCoverage', function (done) {
  return gulp.src(`${COVERAGE_DIR}/coverage-es5.json`)
    .pipe(remapIstanbul({
      exclude: /(webpack|~\/d3\/|~\/es6-promise\/dist\/|~\/process\/|~\/underscore\/|vertx)/
    }))
    .pipe(rename('coverage.json'))
    .pipe(gulp.dest(COVERAGE_DIR));
})

gulp.task('lcovCoverage', ['remapCoverage'], function (done) {
  // Convert JSON coverage from remap-istanbul to lcov format (needed for Sonar).
  combineCoverage({
    dir: COVERAGE_DIR,
    pattern: `${COVERAGE_DIR}/coverage.json`,
    reporters: {
      lcov: {}
    }
  }).then(() => done());
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
