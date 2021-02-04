const gulp = require('gulp');
const replace = require('gulp-replace');
const colors = require('colors');
const { version } = require('../package.json');

function injectVersion() {
  console.log(`Injecting ${version} in Coveo.version ...`.black.bgGreen);
  return gulp
    .src('./src/misc/Version.ts')
    .pipe(replace(/0\.0\.0\.0/g, version))
    .pipe(gulp.dest('./src/misc/'));
}

module.exports = { injectVersion };
