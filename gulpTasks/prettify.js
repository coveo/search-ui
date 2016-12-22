const gulp = require('gulp');
const prettyTypescript = require('pretty-typescript');
const merge = require('merge-stream');
const path = require('path');

gulp.task('prettify', function () {
  var src = gulp.src(['src/**/*.ts', '!src/strings/**/*.ts'])
      .pipe(prettyTypescript({emitError: true}))
      .pipe(gulp.dest('src'));
  var test = gulp.src(['test/**/*.ts', '!test/lib/**/*.ts', '!test/CustomMatchers.ts'])
      .pipe(prettyTypescript({emitError: true}))
      .pipe(gulp.dest('test'));
  return merge(src, test);
});
