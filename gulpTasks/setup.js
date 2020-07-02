const gulp = require('gulp');
const replace = require('gulp-replace');

function setup() {
  return gulp.src('pages/*.html').pipe(gulp.dest('./bin'));
}

module.exports = { setup };
