var gulp = require('gulp');
var concat = require('gulp-concat');
var conditions = require('../templates/conditions.json');
var conditionsLegacy = require('../breakingchanges/redesign/templates/conditions.json');
var templatesParser = require('./templatesParser');


gulp.task('buildTemplate', function (done) {
  templatesParser.compileTemplates('templates/', 'bin/js/templates/', 'templatesNew', conditions,  done);
});

gulp.task('buildTemplateLegacy', function (done) {
  templatesParser.compileTemplates('breakingchanges/redesign/templates/', 'bin/js/templates/', 'templates', conditionsLegacy,  done);
});