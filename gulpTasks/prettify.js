const gulp = require('gulp');
const prettyTypescript = require('pretty-typescript');
const path = require('path');

const sourceFiles = ['src/**/*.ts', '!src/strings/**/*.ts'];

gulp.task('prettify', function () {
  return gulp.src(sourceFiles)
    .pipe(prettyTypescript())
    .pipe(gulp.dest('src'));
});
