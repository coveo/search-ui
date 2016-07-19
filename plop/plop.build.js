'use strict';
const webpack = require('webpack');
const conf = require('../webpack.config.js');
const path = require('path');

conf.entry = [path.resolve('../src/Dependencies.js'), path.resolve('../bin/Plop.Bundle.ts')];
conf.output.filename = 'CoveoJsSearch.Custom.js';
conf.output.path = path.resolve('../bin/js')

webpack(conf, (err, stat)=> {
  if (err) {
    console.log(err);
  }
});
