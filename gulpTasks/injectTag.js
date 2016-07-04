const gulp = require('gulp');
const replace = require('gulp-replace');
const colors = require('colors');

if (process.env.TRAVIS_TAG) {
  gulp.task('injectTag', function () {
    console.log(`Injecting ${process.env.TRAVIS_TAG} in Coveo.version ...`.black.bgGreen)
    return gulp.src('./src/misc/Version.ts')
        .pipe(replace(/0\.0\.0\.0/g, process.env.TRAVIS_TAG))
        .pipe(gulp.dest('./src/misc/'));
  })
} else {
  gulp.task('injectTag', function (done) {
    console.log('Skipping tag injection because it was not detected as an environment variable ...'.black.bgGreen);
    done();
  })
}

