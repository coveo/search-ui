const gulp = require('gulp');
const TestServer = require('karma').Server;
const express = require('express');
const path = require('path');
const rename = require('gulp-rename');
const combineCoverage = require('istanbul-combine');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const event_stream = require('event-stream');
const shell = require('gulp-shell');
const replace = require('gulp-replace');
const coveralls = require('coveralls');

const COVERAGE_DIR = path.resolve('bin/coverage');

gulp.task('setupTests', function() {
  return event_stream
    .merge(
      gulp.src('./test/lib/**/*').pipe(gulp.dest('./bin/tests/lib')),
      gulp
        .src('./test/SpecRunner.html')
        .pipe(replace(/\.\.\/bin\/tests\/tests\.js/, 'tests.js'))
        .pipe(gulp.dest('./bin/tests/'))
    )
    .pipe(event_stream.wait());
});

gulp.task('coverage', ['lcovCoverage']);

gulp.task('test', ['setupTests', 'buildTest'], function(done) {
  new TestServer(
    {
      configFile: path.resolve('./karma.conf.js')
    },
    exitCode => {
      if (exitCode) {
        // Fail CI builds if any test fails (since karma will exit 1 on any error)
        throw new Error(exitCode);
      } else {
        done();
      }
    }
  ).start();
});

gulp.task('buildTest', shell.task(['node node_modules/webpack/bin/webpack.js --config webpack.test.config.js']));

gulp.task('uploadCoverage', ['lcovCoverage'], shell.task(['cat bin/coverage/lcov.info | ./node_modules/.bin/coveralls']));

gulp.task('remapCoverage', function(done) {
  return gulp
    .src(`${COVERAGE_DIR}/coverage-es5.json`)
    .pipe(
      remapIstanbul({
        basePath: '.',
        exclude: filesToExclude
      })
    )
    .pipe(rename('coverage.json'))
    .pipe(gulp.dest(COVERAGE_DIR));
});

gulp.task('lcovCoverage', ['remapCoverage'], function(done) {
  // Convert JSON coverage from remap-istanbul to lcov format (needed for Sonar).
  combineCoverage({
    dir: COVERAGE_DIR,
    pattern: `${COVERAGE_DIR}/coverage.json`,
    reporters: {
      lcov: {}
    },
    print: 'summary'
  }).then(() => done());
});

function filesToExclude(fileName) {
  const entryFile = /search-ui[\/\\]bin[\/\\]tests[\/\\]tests.js/;
  const whiteList = /search-ui[\/\\](src.+\.ts)/;

  return !entryFile.test(fileName) && !whiteList.test(fileName);
}
