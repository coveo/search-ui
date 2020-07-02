const gulp = require('gulp');

function setup() {
  return gulp.src('pages/*.html').pipe(gulp.dest('./bin'));
}

module.exports = { setup };
