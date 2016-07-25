const gulp = require('gulp');
const requireDir = require('require-dir');
const rmdir = require('gulp-rimraf');
const runsequence = require('run-sequence');
const shell = require('gulp-shell');

requireDir('./gulpTasks');

gulp.task('default', ['build', 'buildLegacy']);

gulp.task('build', function (done) {
  runsequence('clean', ['css', 'fileTypes', 'sprites', 'strings', 'setup', 'templates'], 'prettify', 'src', done);
});

gulp.task('src', function (done) {
  runsequence('compile', 'definitions', done);
})

gulp.task('buildLegacy', function (done) {
  runsequence(['cssLegacy', 'fileTypesLegacy', 'spritesLegacy', 'templatesLegacy'], done);
});

gulp.task('clean', function (done) {
  return gulp.src(['./bin', './zip/**.zip'], {read: false})
      .pipe(rmdir())
});
