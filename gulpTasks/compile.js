const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('compile', shell.task([
  'NODE_ENV=production node node_modules/webpack/bin/webpack.js -p'
]))