const gulp = require('gulp');
const requireDir = require('require-dir');
const del = require('del');
const runsequence = require('run-sequence');

requireDir('./gulpTasks');

gulp.task('default', ['build', 'buildLegacy']);

gulp.task('build', ['linkGitHooks', 'setNodeProdEnv'], (done) => {
  runsequence('clean', ['fileTypes', 'spritesLists', 'strings', 'setup', 'templates'], 'prettify', 'src', done);
});

gulp.task('src', (done) => {
  runsequence('compile', 'definitions', done);
});

gulp.task('buildLegacy', (done) => {
  runsequence('legacy', done);
});

gulp.task('clean', () => {
  return del.sync(['./bin/**/*']);
});
