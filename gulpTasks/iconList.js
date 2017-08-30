'use strict';
const gulp = require('gulp');
const glob = require('glob');
const _ = require('underscore');
const fs = require('fs');
const buildIconList = require('./buildIconList');


gulp.task('iconList', function (done) {
  buildIconList('image/svg', 'bin/image', 'icon-list', done);
});
