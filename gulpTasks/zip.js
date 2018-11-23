'use strict';

const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('zipForGitReleases', () => {
  return gulp
    .src('bin/**/*')
    .pipe(zip('search-ui.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('zipForVeracode', () => {
  return gulp
    .src(['src/**/*', 'yarn.lock', 'package.json'])
    .pipe(zip('veracode.zip'))
    .pipe(gulp.dest('./'));
});
