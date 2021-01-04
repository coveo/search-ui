const gulp = require('gulp');
const TestServer = require('karma').Server;
const path = require('path');
const rename = require('gulp-rename');
const combineCoverage = require('istanbul-combine');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const event_stream = require('event-stream');
const shell = require('gulp-shell');
const replace = require('gulp-replace');
const COVERAGE_DIR = path.resolve('bin/coverage');
require('coveralls');

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

const buildUnitTests = shell.task(['npx webpack --config webpack.unit.test.config.js']);
const startUnitTestServer = cb => configureTestServer('./karma.unit.test.conf.js', cb);

const unitTests = gulp.series(gulp.parallel(setupTests, buildUnitTests), startUnitTestServer);

const buildAccessibilityTests = shell.task(['npx webpack --config webpack.accessibility.test.config.js']);
const startAccessibilityTestServer = cb => configureTestServer('./karma.accessibility.test.conf.js', cb);

const accessibilityTests = gulp.series(gulp.parallel(setupTests, buildAccessibilityTests), startAccessibilityTestServer);

function configureTestServer(configPath, cb) {
  new TestServer(
    {
      configFile: path.resolve(configPath)
    },
    exitCode => {
      if (exitCode) {
        // Fail CI builds if any test fails (since karma will exit 1 on any error)
        throw new Error(exitCode);
      } else {
        cb();
      }
    }
  ).start();
}

const coverage = gulp.series(remapCoverage, convertCoverageToLcovFormat);

const uploadCoverage = gulp.series(coverage, shell.task(['npx coveralls < bin/coverage/lcov.info']));

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
  }).then(() => cb());
}

function filesToExclude(fileName) {
  const entryFile = /search-ui[\/\\]bin[\/\\]tests[\/\\]unitTests.js/;
  const whiteList = /search-ui[\/\\](src.+\.ts)/;

  return !entryFile.test(fileName) && !whiteList.test(fileName);
}

module.exports = { setupTests, coverage, uploadCoverage, unitTests, accessibilityTests };
