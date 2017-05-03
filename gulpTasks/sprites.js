'use strict';
const gulp = require('gulp');
const glob = require('glob');
const _ = require('underscore');
const fs = require('fs');
const buildSpriteList = require('./buildSpriteList');
const shell = require('gulp-shell');
const svgSprite = require('gulp-svg-sprites')


gulp.task('spritesLists', ['regularSpriteList', 'retinaSpriteList', 'validateRetinaSprites', 'dumbCopy', 'spritesSymbols', 'spritesCssFile']);

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

  let config = {
    /*templates: {
      css: fs.readFileSync('./sass/template/svgSpriteTemplate.lodash.scss', 'utf-8')
    },*/
    mode: 'symbols',
    common: 'coveo',
    svg: {
      symbols: 'image/symbols.svg'
    }
  };
gulp.task('spritesSymbols', function () {

  return gulp.src('image/svg/*.svg')
      .pipe(svgSprite(config))
      .pipe(gulp.dest('bin'));
})

gulp.task('spritesCssFile', function () {

  return gulp.src('image/svg/*.svg')
      .pipe(svgSprite({
        templates: {
          css: fs.readFileSync('./sass/template/svgSpriteTemplate.lodash.scss', 'utf-8')
        },
        common: 'coveo-svg-icon',
        cssFile: 'sass/svgSprite.scss'
      }))
      .pipe(gulp.dest('bin'));
})
gulp.task('dumbCopy', shell.task(['cp ./doctype.svg ./bin/ && cp ./ai.svg ./bin/ && cp ./more.svg ./bin/']));
