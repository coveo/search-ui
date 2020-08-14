'use strict';
const buildIconList = require('./buildIconList');

function iconList(cb) {
  buildIconList('image/svg', 'bin/image', 'icon-list', cb);
}

module.exports = { iconList };
