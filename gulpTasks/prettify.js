const gulp = require('gulp');
const prettyTypescript = require('pretty-typescript');
const path = require('path');

const sourceFiles = ['src/**/*.ts', '!src/**/*.d.ts', '!src/strings/**/*.ts'];

gulp.task('prettify', function () {
  gulp.src(sourceFiles)
    .pipe(prettyTypescript())
    .pipe(gulp.dest('src'));
});
