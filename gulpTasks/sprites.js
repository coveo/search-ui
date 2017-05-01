'use strict';
const gulp = require('gulp');
const glob = require('glob');
const _ = require('underscore');
const fs = require('fs');
const buildSpriteList = require('./buildSpriteList');
const shell = require('gulp-shell');

gulp.task('spritesLists', ['regularSpriteList', 'retinaSpriteList', 'validateRetinaSprites', 'dumbCopy']);

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
});

gulp.task('retinaSpriteList', function (done) {
  buildSpriteList('image/retina', 'bin/image', 'retina-icon-list-new', done);
});

gulp.task('dumbCopy', shell.task(['cp ./doctype.svg ./bin/']));
