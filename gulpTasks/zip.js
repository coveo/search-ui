'use strict';

const gulp = require('gulp');
const zip = require('gulp-zip');

function zipForGitReleases() {
  return gulp.src('bin/**/*').pipe(zip('search-ui.zip')).pipe(gulp.dest('./'));
}

module.exports = { zipForGitReleases };
