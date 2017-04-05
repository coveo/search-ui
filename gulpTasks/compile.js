'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');
const eol = require('gulp-eol');
const rename = require('gulp-rename');
const event_stream = require('event-stream');

gulp.task('prepareSass', ['fileTypes'], function () {
  return event_stream.merge(
      gulp.src('./node_modules/modal-box/bin/modalBox.css')
          .pipe(rename('_ModalBox.scss'))
          .pipe(gulp.dest('./bin/sass/')),

      gulp.src('./node_modules/coveomagicbox/sass/**/*.scss')
          .pipe(gulp.dest('./bin/sass/MagicBox'))
  ).pipe(event_stream.wait())
});

gulp.task('compile', ['addEolDependencies', 'deprecatedDependencies', 'prepareSass'], shell.task([
  'node node_modules/webpack/bin/webpack.js'
]));

gulp.task('compileTSOnly', shell.task([
  'node node_modules/webpack/bin/webpack.js --config ./webpackConfigFiles/webpack.TSonly.config.js'
]))

gulp.task('minimize', ['addEolDependencies'], shell.task([
  'node node_modules/webpack/bin/webpack.js --optimize-minimize'
]));

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
