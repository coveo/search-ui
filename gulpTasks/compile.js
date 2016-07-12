const gulp = require('gulp');
const shell = require('gulp-shell');
const eol = require('gulp-eol');
const os = require("os");
const isWindows = os.platform() === 'win32';

gulp.task('compile', ['addEolDependencies'], shell.task([
  // NODE_ENV=production sets an environement variable that will allow other tasks to know when we are building for production.
  (isWindows ? 'set ' : '') + 'NODE_ENV=production', 'node node_modules/webpack/bin/webpack.js'
]))

gulp.task('minimize', ['addEolDependencies'], shell.task([
  // -p is a shortcut for --optimze-minimize --optimize-occurence-order
  'node node_modules/webpack/bin/webpack.js --p'
]))

// This cause an issue when dep are bundled together : the lack of EOL makes it so
// that part of the bundled code can be commented out or not valid
gulp.task('addEolDependencies', function () {
  return gulp.src('./node_modules/underscore/underscore-min.js')
      .pipe(eol())
      .pipe(gulp.dest('./node_modules/underscore/'))
})
