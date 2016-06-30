'use strict';

/**
 * Use this script to link the bin folder from this repository to all your external project's node_modules.
 * When running the gulp dev task, this will create a symlink between the current repo and all other specified
 * in ./environments/conf.js
 */

const fs = require('fs');
const colors = require('colors');
const Q = require('q');
var devConfig;

const stats = Q.denodeify(fs.stat);
const unlink = Q.denodeify(fs.unlink);
const link = Q.denodeify(fs.symlink);
const write = Q.denodeify(fs.writeFile);
const fetch = require('node-fetch');

try {
  devConfig = require('./conf.js');
} catch (e) {
  console.log('conf.js not found. Did you forget to rename the sample file in ./environments ?'.black.bgRed);
  process.exit(1);
}

if (devConfig.externalsProjects) {
  devConfig.externalsProjects.forEach(function (proj) {
    const path = proj + '/node_modules/coveo-search-ui';
    stats(path)
        .then(function (fStat) {
          if (fStat.isDirectory()) {
            return unlink(path)
          } else {
            return fStat;
          }
        })
        .catch(function () {
          return '';
        })
        .then(function () {
          return fetch('http://localhost:8080/js/CoveoJsSearch.js')
              .then(function (res) {
                if (res && res.status === 200) {
                  return res.text();
                }
                return '';
              })
              .then(function (body) {
                if (body) {
                  return write(process.cwd() + '/bin/js/CoveoJsSearch.js', body);
                }
                return '';
              })
              .catch(function () {
                return '';
              })
        })
        .then(function () {
          return link(process.cwd(), path, "dir");
        })
        .done(function () {
          console.log(`Link done for ${path}`.black.bgGreen);
        })
  })
}




