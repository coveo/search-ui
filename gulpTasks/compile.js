'use strict';
const gulp = require('gulp');
const exec = require('gulp-exec');
const eol = require('gulp-eol');
const os = require('os');
const isWindows = os.platform() === 'win32';
const rename = require('gulp-rename');

gulp.task('compile', ['addEolDependencies', 'deprecatedDependencies'], function() {

  // NODE_ENV=production sets an environement variable that will allow other tasks to know when we are building for production.
  let setEnv = '';
  if (isWindows) {
    setEnv += 'set '
  } 
  exec(setEnv + 'NODE_ENV=production')
  exec('node node_modules/webpack/bin/webpack.js')
})

gulp.task('minimize', ['addEolDependencies'], function() {
  exec(
  'node node_modules/webpack/bin/webpack.js --minimize'
)})

gulp.task('deprecatedDependencies', function () {
  gulp.src('./src/Dependencies.js')
      .pipe(rename('CoveoJsSearch.Dependencies.js'))
      .pipe(gulp.dest('./bin/js/'))
})

// This cause an issue when dep are bundled together : the lack of EOL makes it so
// that part of the bundled code can be commented out or not valid
gulp.task('addEolDependencies', function () {
  return gulp.src('./node_modules/underscore/underscore-min.js')
      .pipe(eol())
      .pipe(gulp.dest('./node_modules/underscore/'))
})
