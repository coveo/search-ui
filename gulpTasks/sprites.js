'use strict';
const gulp = require('gulp');
const glob = require('glob');
const _ = require('underscore');
const fs = require('fs');
const buildSpriteList = require('./buildSpriteList');
const shell = require('gulp-shell');
const svgSprite = require('gulp-svg-sprites')
const buildSvgStylesheet = require('./buildSvgStylesheet/buildSvgStylesheet.js')


gulp.task('spritesLists', ['regularSpriteList', 'retinaSpriteList']);

gulp.task('regularSpriteList', function (done) {
  buildSpriteList('image/sprites', 'bin/image', 'normal-icon-list-new', done);
});

gulp.task('retinaSpriteList', function (done) {
  buildSpriteList('image/retina', 'bin/image', 'retina-icon-list-new', done);
});

gulp.task('spritesSymbols', function () {
  let config = {
    templates: {
      css: fs.readFileSync('./sass/template/svgSpriteTemplate.lodash.scss', 'utf-8')
    },
    common: 'coveo',
    svg: {
      symbols: 'image/symbols.svg'
    }
  };
  return gulp.src('image/svg/*.svg')
      .pipe(svgSprite(config))
      .pipe(buildSvgStylesheet)
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
