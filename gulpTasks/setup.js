const gulp = require('gulp');
const replace = require('gulp-replace');

gulp.task('setup', ['copy']);

gulp.task('copy', function () {
  gulp.src('pages/*.html')
      .pipe(gulp.dest('./bin'))
})
