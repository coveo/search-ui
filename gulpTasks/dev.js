const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('dev', ['setup'], shell.task([
  'sudo node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --content-base bin/'
]))