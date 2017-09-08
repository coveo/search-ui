const gulp = require('gulp');
const requireDir = require('require-dir');
const runsequence = require('run-sequence');

requireDir('./gulpTasks');

gulp.task('default', ['buildLegacy', 'build']);

gulp.task('build', ['linkGitHooks', 'setNodeProdEnv'], done => {
  runsequence(['fileTypes', 'iconList', 'strings', 'setup', 'templates'], 'src', done);
});

gulp.task('src', done => {
  runsequence('compile', 'definitions', done);
});

gulp.task('buildLegacy', done => {
  runsequence('legacy', done);
});
