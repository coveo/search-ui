'use strict';
const gulp = require('gulp');
const conditions = require('../templates/conditions.json');
const templatesParser = require('./templatesParser');

gulp.task('templates', (done)=> {
  templatesParser.compileTemplates('templates/', 'bin/js/templates/', 'templatesNew', conditions, done);
});
