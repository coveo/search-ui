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

function setupTests() {
  return event_stream
    .merge(
      gulp.src('./testsFramework/lib/**/*').pipe(gulp.dest('./bin/tests/lib')),
      gulp.src('./node_modules/axe-core/axe.js').pipe(gulp.dest('./bin/tests/lib')),
      gulp
        .src('./unitTests/SpecRunner.html')
        .pipe(replace(/\.\.\/bin\/tests\/unitTests\.js/, 'unitTests.js'))
        .pipe(gulp.dest('./bin/tests/')),
      gulp.src('./accessibilityTest/Accessibility.html').pipe(gulp.dest('./bin/tests/'))
    )
    .pipe(event_stream.wait());
}

gulp.task('unitTests', ['setupTests', 'buildUnitTests'], function(done) {
  new TestServer(
    {
      configFile: path.resolve('./karma.unit.test.conf.js')
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

gulp.task('accessibilityTests', ['setupTests', 'buildAccessibilityTests'], done => {
  new TestServer(
    {
      configFile: path.resolve('./karma.accessibility.test.conf.js')
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

gulp.task('buildUnitTests', shell.task(['node node_modules/webpack/bin/webpack.js --config webpack.unit.test.config.js']));

gulp.task(
  'buildAccessibilityTests',
  shell.task(['node node_modules/webpack/bin/webpack.js --config webpack.accessibility.test.config.js'])
);

const coverage = gulp.series(remapCoverage, convertCoverageToLcovFormat);

const uploadCoverage = gulp.series(coverage, shell.task(['cat bin/coverage/lcov.info | ./node_modules/.bin/coveralls']));

function remapCoverage() {
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
}

function convertCoverageToLcovFormat(cb) {
  // Convert JSON coverage from remap-istanbul to lcov format (needed for Sonar).
  combineCoverage({
    dir: COVERAGE_DIR,
    pattern: `${COVERAGE_DIR}/coverage.json`,
    reporters: {
      lcov: {}
    },
    print: 'summary'
  }).then(cb);
}

function filesToExclude(fileName) {
  const entryFile = /search-ui[\/\\]bin[\/\\]tests[\/\\]unitTests.js/;
  const whiteList = /search-ui[\/\\](src.+\.ts)/;

  return !entryFile.test(fileName) && !whiteList.test(fileName);
}

module.exports = { setupTests, coverage, uploadCoverage };
