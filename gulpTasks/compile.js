'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');
const eol = require('gulp-eol');
const rename = require('gulp-rename');
const event_stream = require('event-stream');
const runsequence = require('run-sequence');

gulp.task('prepareSass', ['fileTypes'], () => {
  return event_stream
    .merge(
      gulp
        .src('./node_modules/modal-box/bin/modalBox.css')
        .pipe(rename('_ModalBox.scss'))
        .pipe(gulp.dest('./bin/sass/')),
      gulp.src('./node_modules/coveomagicbox/sass/**/*.scss').pipe(gulp.dest('./bin/sass/MagicBox'))
    )
    .pipe(event_stream.wait());
});

gulp.task('compile', done => {
  runsequence('executeWebpack', ['duplicateCssFile', 'duplicateCssMapFile'], done);
});

gulp.task(
  'executeWebpack',
  ['addEolDependencies', 'deprecatedDependencies', 'prepareSass'],
  shell.task(['node node_modules/webpack/bin/webpack.js'])
);

gulp.task('compileTSOnly', shell.task(['node node_modules/webpack/bin/webpack.js --config ./webpack.tsonly.config.js']));

gulp.task(
  'minimize',
  ['addEolDependencies', 'setNodeProdEnv'],
  shell.task(['node --max_old_space_size=8192 node_modules/webpack/bin/webpack.js --env minimize'])
);

gulp.task('deprecatedDependencies', () => {
  gulp
    .src('./src/Dependencies.js')
    .pipe(rename('CoveoJsSearch.Dependencies.js'))
    .pipe(gulp.dest('./bin/js/'));
});

// We duplicate css file to help on upgrade (deployments using the "NewDesign" file)
// This should help mitigate 404 on those files, and hopefully possible maintenance case(s).
gulp.task('duplicateCssFile', () => {
  gulp
    .src('./bin/css/CoveoFullSearch.css')
    .pipe(rename('CoveoFullSearchNewDesign.css'))
    .pipe(gulp.dest('./bin/css'));
});

gulp.task('duplicateCssMapFile', () => {
  gulp
    .src('./bin/css/CoveoFullSearch.css.map')
    .pipe(rename('CoveulFullSearchNewDesign.css.map'))
    .pipe(gulp.dest('./bin/css'));
});

// This cause an issue when dep are bundled together : the lack of EOL makes it so
// that part of the bundled code can be commented out or not valid
gulp.task('addEolDependencies', () => {
  return gulp
    .src('./node_modules/underscore/underscore-min.js')
    .pipe(eol())
    .pipe(gulp.dest('./node_modules/underscore/'));
});
