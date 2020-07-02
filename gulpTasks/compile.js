'use strict';
const gulp = require('gulp');
const shell = require('gulp-shell');
const eol = require('gulp-eol');
const rename = require('gulp-rename');
const event_stream = require('event-stream');
const runsequence = require('run-sequence');
const { fileTypes } = require('./filetypes');
const { setNodeProdEnv } = require('./nodeEnv');

const prepareSass = gulp.series(fileTypes, pipeModalBoxFiles);

const executeWebpack = gulp.series(
  gulp.parallel(addEolDependencies, deprecatedDependencies, prepareSass),
  shell.task(['node node_modules/webpack/bin/webpack.js'])
);

const compile = gulp.series(executeWebpack, gulp.parallel(duplicateCssFile, duplicateCssMapFile));

const compileTSOnly = shell.task(['node node_modules/webpack/bin/webpack.js --config ./webpack.tsonly.config.js']);

const minimize = gulp.series(
  gulp.parallel(addEolDependencies, setNodeProdEnv),
  shell.task(['node --max_old_space_size=8192 node_modules/webpack/bin/webpack.js --env minimize'])
);

const analyze = gulp.series(
  gulp.parallel(addEolDependencies, setNodeProdEnv),
  shell.task(['node --max_old_space_size=8192 node_modules/webpack/bin/webpack.js --env minimize --env analyze'])
);

function pipeModalBoxFiles() {
  return event_stream
    .merge(
      gulp
        .src('./node_modules/modal-box/bin/modalBox.css')
        .pipe(rename('_ModalBox.scss'))
        .pipe(gulp.dest('./bin/sass/'))
    )
    .pipe(event_stream.wait());
}

function deprecatedDependencies() {
  return gulp
    .src('./src/Dependencies.js')
    .pipe(rename('CoveoJsSearch.Dependencies.js'))
    .pipe(gulp.dest('./bin/js/'));
}

// We duplicate css file to help on upgrade (deployments using the "NewDesign" file)
// This should help mitigate 404 on those files, and hopefully possible maintenance case(s).
function duplicateCssFile() {
  return gulp
    .src('./bin/css/CoveoFullSearch.css')
    .pipe(rename('CoveoFullSearchNewDesign.css'))
    .pipe(gulp.dest('./bin/css'));
}

function duplicateCssMapFile() {
  return gulp
    .src('./bin/css/CoveoFullSearch.css.map')
    .pipe(rename('CoveulFullSearchNewDesign.css.map'))
    .pipe(gulp.dest('./bin/css'));
}

// This cause an issue when dep are bundled together : the lack of EOL makes it so
// that part of the bundled code can be commented out or not valid
function addEolDependencies() {
  return gulp
    .src('./node_modules/underscore/underscore-min.js')
    .pipe(eol())
    .pipe(gulp.dest('./node_modules/underscore/'));
}

module.exports = { compile, compileTSOnly, minimize, analyze };
