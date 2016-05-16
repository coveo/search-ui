const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const fs = require('fs');
const runsequence = require('run-sequence');

gulp.task('definitions', function (done) {
  runsequence('internalDefs', 'externalDefs', 'removeExternalDefs', 'cleanDefs', done)
})

gulp.task('cleanDefs', function () {
  return gulp.src('bin/ts/CoveoJsSearch.d.ts')
      .pipe(replace(/import.*$/gm, ''))
      .pipe(replace(/(declare module )(.*)( {$)/gm, '$1Coveo$3'))
      .pipe(gulp.dest('bin/ts/'))
})

gulp.task('removeExternalDefs', function (done) {
  var file = fs.readFileSync('bin/ts/CoveoJsSearch.d.ts').toString();
  var start = file.indexOf('declare module \'Coveo\'');
  var content = file.substr(start);
  content = content.replace(/\/\/\/.*<reference.*\/>/gm, '');
  content = '/// <reference path="Externals.d.ts" />\n' + content;
  var end = content.lastIndexOf('declare module \'Coveo\'');
  content = content.substring(0, end);
  fs.writeFileSync('bin/ts/CoveoJsSearch.d.ts', content);
  done();
})

gulp.task('externalDefs', function () {
  return gulp.src([
        './typings/browser/ambient/underscore/index.d.ts',
        './typings/browser/ambient/jquery/index.d.ts',
        './lib/MagicBox.d.ts',
        './lib/d3.d.ts',
        './lib/fastclick.d.ts',
        './lib/promise.d.ts',
        './lib/globalize.d.ts',
        './lib/jstz.d.ts'
      ])
      .pipe(concat('Externals.d.ts'))
      .pipe(gulp.dest('./bin/ts'));
})

gulp.task('internalDefs', function (done) {
  require('dts-generator').default({
    name: 'Coveo',
    project: './',
    baseDir: './src/',
    out: 'bin/ts/CoveoJsSearch.d.ts',
    externs: ['Externals.d.ts'],
    excludes: ['/lib/**/*.d.ts', 'node_modules/**/*.d.ts', 'typings/**/*.d.ts']
  });
  done();
})

