var gulp = require('gulp');
var gulpTsc = require('gulp-tsc');
var jasmine = require('gulp-jasmine-phantom');

gulp.task('testJasmine', ['buildTestJasmine'], function () {
  return gulp.src('./target/testJasmine/CoveoJsSearchTests.js')
    .pipe(jasmine({
      integration: true,
      keepRunner: './core/testJasmine',
      abortOnFail: true,
      jasmineVersion: '2.3',
      vendor: [
        './core/testJasmine/lib/jasmine-ajax/jasmine-ajax.js',
        './target/jsSearch/package/js/CoveoJsSearch.Dependencies.js',
        './target/jsSearch/package/js/CoveoJsSearch.js',
        './target/jsSearch/package/js/d3.min.js'
      ]
    }));
});

gulp.task('buildTestJasmine', function () {
  return gulp.src('./core/testJasmine/Test.ts')
    .pipe(gulpTsc({module: 'amd', out: 'CoveoJsSearchTests.js', declaration: true, target: 'ES5'}))
    .pipe(gulp.dest('./target/testJasmine'))
});