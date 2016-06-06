const gulp = require('gulp');
const prettyTypescript = require('pretty-typescript');
const path = require('path');

gulp.task('prettify', function () {
  gulp.src(['src/**/*.ts', '!src/strings/**/*.ts'])
    .pipe(prettyTypescript())
    .pipe(gulp.dest('src'));
  gulp.src(['test/**/*.ts', '!test/lib/**/*.ts'])
    .pipe(prettyTypescript())
    .pipe(gulp.dest('test'));
});
