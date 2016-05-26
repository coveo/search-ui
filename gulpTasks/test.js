const gulp = require('gulp');
const tsc = require('gulp-tsc');
const TestServer = require('karma').Server;

gulp.task('test', ['buildTest'], function (done) {
  new TestServer({
    configFile: __dirname + '/../karma.conf.js',
  }, function(){done();}).start();
});

gulp.task('buildTest', function () {
  return gulp.src('./test/Test.ts')
      .pipe(tsc({
        target: 'ES5',
        out: 'tests.js',
        module: 'amd'
      }))
      .pipe(gulp.dest('./bin/tests'))
})