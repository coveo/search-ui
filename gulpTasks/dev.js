const gulp = require('gulp');
const shell = require('gulp-shell');

var isWin = (process.platform === 'win32');

gulp.task('dev', ['setup', 'prepareSass'], shell.task([
  ((isWin) ? '' : 'sudo ') + 'node node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --content-base bin/'
]))
