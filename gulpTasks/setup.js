const gulp = require('gulp');
const replace = require('gulp-replace');

gulp.task('setup', ['setupMagicBox']);

gulp.task('setupMagicBox', function () {
  return gulp.src('./node_modules/coveomagicbox/bin/MagicBox.d.ts')
      .pipe(replace(/\/\/\/.*reference.*$/gm, ''))
      .pipe(gulp.dest('./lib'))
})