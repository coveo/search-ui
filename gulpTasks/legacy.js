'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const event_stream = require('event-stream');

// For old times sake, we simply take the precompiled/prebuilt css/images/templates for the old style and copy it in the bin directory
gulp.task('legacy', ()=> {
  return event_stream.merge(
      gulp.src('./legacy/prebuilt/css/**/*')
          .pipe(gulp.dest('./bin/css')),

      gulp.src('./legacy/prebuilt/sass/**/*')
          .pipe(gulp.dest('./bin/sass')),

      gulp.src('./legacy/prebuilt/image/**/*')
          .pipe(gulp.dest('./bin/image')),

      gulp.src('./legacy/prebuilt/templates/**/*')
          .pipe(gulp.dest('./bin/js/templates/')),

      gulp.src('./legacy/prebuilt/filetypes/**/*')
          .pipe(gulp.dest('./bin/strings'))
  ).pipe(event_stream.wait());
});
