'use strict';
const gulp = require('gulp');
const conditions = require('../templates/conditions.json');
const templatesParser = require('./templatesParser');
const rename = require('gulp-rename');

const templates = gulp.series(buildTemplates, duplicateTemplatesFile);

// We duplicate template files to help on upgrade (deployments using the "NewDesign" file)
// This should help mitigate 404 on those files, and hopefully possible maintenance case(s).
function buildTemplates(cb) {
  templatesParser.compileTemplates('templates/', 'bin/js/templates/', 'templates', conditions, cb);
}

function duplicateTemplatesFile() {
  return gulp
    .src('./bin/js/templates/templates.js')
    .pipe(rename('templatesNew.js'))
    .pipe(gulp.dest('./bin/js/templates/'));
}

module.exports = { templates };
