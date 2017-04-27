const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const event_stream = require('event-stream');

gulp.task('css', ['fullCss']);
gulp.task('cssLegacy', ['fullCssLegacy', 'miniCssLegacy', 'minimalistCssLegacy', 'mobileCssLegacy']);

gulp.task('prepareSass', ['fileTypes', 'sprites'], function () {
  return event_stream.merge(
      gulp.src('./node_modules/modal-box/bin/modalBox.css')
          .pipe(rename('_ModalBox.scss'))
          .pipe(gulp.dest('./bin/sass/')),

      gulp.src('./node_modules/coveomagicbox/sass/**/*.scss')
          .pipe(gulp.dest('./bin/sass/MagicBox')),

      gulp.src('./sass/**/*')
          .pipe(gulp.dest('./bin/sass/'))
    ).pipe(event_stream.wait())
});

gulp.task('prepareSassLegacy', ['fileTypesLegacy', 'spritesLegacy'], function () {
  return event_stream.merge(
      gulp.src('./breakingchanges/redesign/sass/**/*')
          .pipe(gulp.dest('./bin/sasslegacy/')),

      gulp.src('./node_modules/modal-box/bin/modalBox.css')
          .pipe(rename('_ModalBox.scss'))
          .pipe(gulp.dest('./bin/sasslegacy/')),

      gulp.src('./node_modules/coveomagicbox/sass/**/*.scss')
          .pipe(gulp.dest('./bin/sasslegacy/MagicBox'))
  ).pipe(event_stream.wait())
});

gulp.task('fullCss', ['prepareSass'], function (done) {
  return gulp.src('./sass/FullSearch.scss')
    .pipe(sass())
    .pipe(rename('CoveoFullSearchNewDesign.css'))
    .pipe(gulp.dest('./bin/css'))
});

gulp.task('fullCssLegacy', ['prepareSassLegacy'], function (done) {
  return gulp.src('./bin/sasslegacy/FullSearch.scss')
      .pipe(sass())
      .pipe(rename('CoveoFullSearch.css'))
      .pipe(gulp.dest('./bin/css'))
});

gulp.task('miniCssLegacy', ['prepareSassLegacy'], function (done) {
  return gulp.src('./bin/sasslegacy/MiniSearch.scss')
    .pipe(sass())
      .pipe(rename('CoveoMiniSearch.css'))
    .pipe(gulp.dest('./bin/css'));
});

gulp.task('minimalistCssLegacy', ['prepareSassLegacy'], function (done) {
  return gulp.src('./bin/sasslegacy/Minimalist.scss')
    .pipe(sass())
    .pipe(rename('CoveoMinimalist.css'))
    .pipe(gulp.dest('./bin/css'))
});

gulp.task('mobileCssLegacy', ['prepareSassLegacy'], function (done) {
  return gulp.src('./bin/sasslegacy/MobileSearch.scss')
    .pipe(sass())
      .pipe(rename('CoveoMobileSearch.css'))
    .pipe(gulp.dest('./bin/css'));
});