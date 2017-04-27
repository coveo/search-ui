const gulp = require('gulp');
const replace = require('gulp-replace');

gulp.task('setup', ['setupMagicBox', 'copy']);

gulp.task('setupMagicBox', function () {
  return gulp.src('./node_modules/coveomagicbox/bin/MagicBox.d.ts')
      .pipe(replace(/\/\/\/.*reference.*$/gm, ''))
      .pipe(gulp.dest('./lib'))
})

gulp.task('copy', function () {
  gulp.src('pages/*.html')
      .pipe(gulp.dest('./bin'))
})