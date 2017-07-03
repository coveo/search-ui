'use strict';
const gulp = require('gulp');
const conditions = require('../templates/conditions.json');
const templatesParser = require('./templatesParser');
const runsequence = require('run-sequence');
const rename = require('gulp-rename');

gulp.task('templates', (done) => {
  runsequence('buildTemplates', 'duplicateTemplatesFile', done);
});

gulp.task('buildTemplates', (done) => {
  templatesParser.compileTemplates('templates/', 'bin/js/templates/', 'templates', conditions, done);
});

gulp.task('duplicateTemplatesFile', () => {
  gulp.src('./bin/js/templates/templates.js')
    .pipe(rename('templatesNew.js'))
    .pipe(gulp.dest('./bin/js/templates/'))
});
