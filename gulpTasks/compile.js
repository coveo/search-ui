const gulp = require('gulp');
const shell = require('gulp-shell');
const eol = require('gulp-eol');


gulp.task('compile', ['addEolDependencies'], shell.task([
  'node node_modules/webpack/bin/webpack.js'
]))

gulp.task('minimize', ['addEolDependencies'], shell.task([
  'node node_modules/webpack/bin/webpack.js --minimize'
]))

// This cause an issue when dep are bundled together : the lack of EOL makes it so
// that part of the bundled code can be commented out or not valid
gulp.task('addEolDependencies', function () {
  return gulp.src('./node_modules/underscore/underscore-min.js')
      .pipe(eol())
      .pipe(gulp.dest('./node_modules/underscore/'))
})