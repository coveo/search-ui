'use strict';
const gulp = require('gulp');
const glob = require('glob');
const _ = require('underscore');
const pngSprite = require('png-sprite');
const fs = require('fs');
const buildSpriteList = require('./buildSpriteList');
const rename = require('gulp-rename');
const through = require('through2');
const lwip = require('lwip');
const del = require('del');

gulp.task('sprites', ['regularSprites', 'retinaSprites', 'regularSpriteList', 'retinaSpriteList', 'validateRetinaSprites']);
gulp.task('spritesLegacy', ['regularSpritesLegacy', 'retinaSpritesLegacy', 'regularSpriteListLegacy', 'retinaSpriteListLegacy']);

let imageResize = function () {
  return through.obj(function (file, encoding, callback) {
    lwip.open(file.path, function (err, image) {
      image.batch()
          .resize(32, 32)
          .writeFile(file.path.replace(/.png/, '-small.png'), function (err) {
            if (err) {
              throw err;
            }
            callback();
          })
    })
  });
}

gulp.task('regularSprites', ['resizeSalesforceSprites'], function (done) {
  return gulp.src('image/sprites/**/*.png')
      .pipe(pngSprite.gulp({
        cssPath: 'sass/spritesNew.scss',
        pngPath: 'image/spritesNew.png',
        namespace: 'coveo-sprites',
      }))
      .pipe(gulp.dest('./bin'))
});

gulp.task('salesforceSprites', ['cleanSpritesFolder'], function () {
  return gulp.src('node_modules/@salesforce-ux/design-system/assets/icons/{doctype,standard}/**/*_60.png')
      .pipe(rename(function (path) {
        path.basename = path.basename.replace(/_60/, '');
        path.basename = path.basename.replace(/_/g, '-');
        path.basename = path.basename.replace(/email-IQ/, 'email-iq');
        path.basename = path.basename.replace(/task-2/, 'task2');
      }))
      .pipe(gulp.dest('image/sprites/salesforce'))
})

gulp.task('resizeSalesforceSprites', ['salesforceSprites'], function () {
  return gulp.src('image/sprites/salesforce/**/*.png')
      .pipe(imageResize())
})


gulp.task('cleanSpritesFolder', function () {
  return del(['./image/sprites/salesforce/**/*.png',]);
});

gulp.task('regularSpritesLegacy', function (done) {
  return gulp.src('./breakingchanges/redesign/image/sprites/**/*.png')
      .pipe(pngSprite.gulp({
        cssPath: 'sasslegacy/sprites.scss',
        pngPath: 'image/sprites.png',
        namespace: 'coveo-sprites'
      }))
      .pipe(gulp.dest('./bin'))
});

gulp.task('retinaSprites', function (done) {
  return gulp.src('image/retina/**/*.png')
      .pipe(pngSprite.gulp({
        cssPath: 'sass/retinaNew.scss',
        pngPath: 'image/retinaNew.png',
        namespace: 'coveo-sprites',
        ratio: 2
      }))
      .pipe(gulp.dest('./bin'))
});

gulp.task('retinaSpritesLegacy', function (done) {
  return gulp.src('./breakingchanges/redesign/image/retina/**/*.png')
      .pipe(pngSprite.gulp({
        cssPath: 'sasslegacy/retina.scss',
        pngPath: 'image/retina.png',
        namespace: 'coveo-sprites',
        ratio: 2
      }))
      .pipe(gulp.dest('./bin'))
});

gulp.task('validateRetinaSprites', function (done) {
  glob("image/retina/**", function (err, files) {
    _.each(files, function (file) {
      if (fs.statSync(file).isFile() && !fs.existsSync(file.replace('/retina/', '/sprites/'))) {
        console.warn('\nWARNING: Retina sprite ' + file + ' has no corresponding image in sprites!\n');
      }
    });
    done();
  });
});

gulp.task('regularSpriteList', function (done) {
  buildSpriteList('image/sprites', 'bin/image', 'normal-icon-list-new', done);
})

gulp.task('regularSpriteListLegacy', function (done) {
  buildSpriteList('breakingchanges/redesign/image/sprites', 'bin/image', 'normal-icon-list', done);
})

gulp.task('retinaSpriteList', function (done) {
  buildSpriteList('image/retina', 'bin/image', 'retina-icon-list-new', done);
})

gulp.task('retinaSpriteListLegacy', function (done) {
  buildSpriteList('breakingchanges/redesign/image/retina', 'bin/image', 'retina-icon-list', done);
})
