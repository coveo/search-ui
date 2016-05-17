const gulp = require('gulp');
const tslint = require('gulp-tslint');
const tsfmt = require('gulp-tsfmt');
const path = require('path');

const sourceFiles = ['src/**/*.ts', '!src/**/*.d.ts'];

gulp.task('lint', function () {
  gulp.src(sourceFiles)
    .pipe(tslint())
    .pipe(tslint.report('prose', {
      emitError: false
    }));
})

gulp.task('format', function () {
  gulp.src(sourceFiles)
    .pipe(tsfmt())
    .pipe(gulp.dest(file => path.dirname(file.path)));
})
