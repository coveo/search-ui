'use strict';

/**
 * Use this script to link the bin folder from this repository to all your external project's node_modules.
 * When running the gulp dev task, this will create a symlink between the current repo and all other specified
 * in ./environments/conf.js
 */

const fs = require('fs');
const colors = require('colors');
const Q = require('q');
const rmdir = require('rimraf');
let devConfig;

const stats = Q.denodeify(fs.lstat);
const unlink = Q.denodeify(fs.unlink);
const link = Q.denodeify(fs.symlink);
const write = Q.denodeify(fs.writeFile);
const fetch = require('node-fetch');

try {
  devConfig = require('./conf.js');
} catch (e) {
  process.exit(1);
}

if (devConfig.externalsProjects) {
  devConfig.externalsProjects.forEach(function (proj) {
    const path = proj + '/node_modules/coveo-search-ui';
    stats(path)
        .then((fStat)=> {
          if (fStat.isSymbolicLink()) {
            return unlink(path)
          } else if (fStat.isDirectory()) {
            return new Promise((resolve, reject)=> {
              rmdir(path, (err)=> {
                if (err) {
                  reject(err);
                }
                resolve(fStat);
              })
            })
          } else {
            return fStat;
          }
        })
        .catch(()=> {
          return '';
        })
        .then(()=> {
          return fetch('http://localhost:8080/js/CoveoJsSearch.js')
              .then((res)=> {
                if (res && res.status === 200) {
                  return res.text();
                }
                return '';
              })
              .then((body)=> {
                if (body) {
                  return write(process.cwd() + '/bin/js/CoveoJsSearch.js', body);
                }
                return '';
              })
              .catch(()=> {
                return '';
              })
        })
        .then(()=> {
          return link(process.cwd(), path, "dir");
        })
        .done(()=> {
          console.log(`Link done for ${path}`.black.bgGreen);
        })
  })
}




