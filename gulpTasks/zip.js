'use strict';

const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('zip', ()=> {
  return gulp.src('bin/**/*')
      .pipe(zip('search-ui.zip'))
      .pipe(gulp.dest('./'))
})
