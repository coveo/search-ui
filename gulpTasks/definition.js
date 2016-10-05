const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const fs = require('fs');
const runsequence = require('run-sequence');

gulp.task('definitions', function (done) {
  runsequence('externalDefs', 'internalDefs', 'cleanDefs', done);
});

gulp.task('cleanDefs', function () {
  return gulp.src('bin/ts/CoveoJsSearch.d.ts')
      .pipe(replace(/import.*$/gm, ''))
      .pipe(replace(/(declare module )(.*)( {$)/gm, '$1Coveo$3'))
      .pipe(gulp.dest('bin/ts/'));
});

gulp.task('externalDefs', function () {
  return gulp.src([
    './lib/es6-promise/index.d.ts',
    './lib/modal-box/index.d.ts',
    './lib/magic-box/index.d.ts',
    './node_modules/@types/d3/index.d.ts',
    './node_modules/@types/fastclick/index.d.ts',
    './lib/globalize/index.d.ts',
    './lib/jstimezonedetect/index.d.ts',
    './lib/coveoanalytics/index.d.ts'
      ])
      .pipe(concat('Externals.d.ts'))
      .pipe(gulp.dest('./bin/ts'));
});

gulp.task('internalDefs', function () {
  return require('dts-generator').default({
    name: 'Coveo',
    project: './',
    baseDir: './src/',
    out: 'bin/ts/CoveoJsSearch.d.ts',
    externs: ['Externals.d.ts'],
    verbose: true,
    exclude: ['lib/**/*.d.ts', 'node_modules/**/*.d.ts', 'typings/**/*.d.ts', 'src/*.ts', 'bin/**/*.d.ts', 'test/lib/**/*.d.ts', 'test/Test.ts']
  });
})
