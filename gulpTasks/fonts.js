const gulp = require('gulp');

function fonts() {
  return gulp.src('./image/fonts/*').pipe(gulp.dest('./bin/fonts'));
}

module.exports = { fonts };
