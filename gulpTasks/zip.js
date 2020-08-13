'use strict';

const gulp = require('gulp');
const zip = require('gulp-zip');

function zipForGitReleases() {
  return gulp
    .src('bin/**/*')
    .pipe(zip('search-ui.zip'))
    .pipe(gulp.dest('./'));
}

function zipForVeracode() {
  return gulp
    .src(['src/**/*', 'yarn.lock', 'package.json'])
    .pipe(zip('veracode.zip'))
    .pipe(gulp.dest('./'));
}

module.exports = { zipForGitReleases, zipForVeracode };
