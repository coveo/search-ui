const gulp = require('gulp');
const replace = require('gulp-replace');
const colors = require('colors');

function injectTag() {
  if (process.env.TRAVIS_TAG) {
    console.log(`Injecting ${process.env.TRAVIS_TAG} in Coveo.version ...`.black.bgGreen);
    return gulp
      .src('./src/misc/Version.ts')
      .pipe(replace(/0\.0\.0\.0/g, process.env.TRAVIS_TAG))
      .pipe(gulp.dest('./src/misc/'));
  }

  console.log('Skipping tag injection because it was not detected as an environment variable ...'.black.bgGreen);
  return Promise.resolve();
}

module.exports = { injectTag };
