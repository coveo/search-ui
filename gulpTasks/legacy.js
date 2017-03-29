'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const event_stream = require('event-stream');
const sass = require('gulp-sass');

// For old time sake, we simply take the precompiled/prebuilt css/images/templates for the old style and copy it in the bin directory
gulp.task('legacy', ()=> {
  return event_stream.merge(
      gulp.src('./legacy/prebuilt/css/**/*')
          .pipe(gulp.dest('./bin/css')),

      gulp.src('./legacy/prebuilt/image/**/*')
          .pipe(gulp.dest('./bin/image')),

      gulp.src('./legacy/redesign/sass/**/*')
          .pipe(gulp.dest('./bin/sasslegacy/')),

      gulp.src('./legacy/prebuilt/templates/**/*')
          .pipe(gulp.dest('./bin/js/templates/')),

      gulp.src('./legacy/prebuilt/sass/**/*')
          .pipe(gulp.dest('./bin/sasslegacy/')),

      gulp.src('./node_modules/modal-box/bin/modalBox.css')
          .pipe(rename('_ModalBox.scss'))
          .pipe(gulp.dest('./bin/sasslegacy/')),

      gulp.src('./node_modules/coveomagicbox/sass/**/*.scss')
          .pipe(gulp.dest('./bin/sasslegacy/MagicBox'))
  ).pipe(event_stream.wait());
});
