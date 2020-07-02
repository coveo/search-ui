'use strict';
const gulp = require('gulp');
const glob = require('glob');
const _ = require('underscore');
const fs = require('fs');
const buildIconList = require('./buildIconList');

function iconList(cb) {
  buildIconList('image/svg', 'bin/image', 'icon-list', cb);
}

module.exports = { iconList };
