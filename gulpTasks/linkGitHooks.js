'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const Q = require('Q');

const stat = Q.denodeify(fs.lstat);

gulp.task('linkGitHooks', function() {
  let noSuchFile = -2;
  let gitHooksDir = '.git/hooks/';
  let gitHooksSourceDir = 'hooks/';
  
  if (!fs.existsSync(gitHooksDir)) {
    fs.mkdirSync(gitHooksDir);
  }

  fs.readdir(gitHooksSourceDir, (err, files) => {
    _.each(files, filename => {
      let symname = path.resolve(process.cwd(), gitHooksDir + filename);
      let source = path.resolve(process.cwd(), gitHooksSourceDir + filename);
      let createSymlink = () => {
        let cwd = process.cwd();
        process.chdir(gitHooksDir);
        fs.symlinkSync(source, symname);
        process.chdir(cwd);
      };

      stat(symname)
          .then(stats => {
            if (stats.isFile() || stats.isSymbolicLink()) {
              fs.unlinkSync(symname);
            }
            createSymlink();
          })
          .catch(err => {
            if (err.errno === noSuchFile) {
              createSymlink();
            } else {
              console.log(err);
            }
          });
    });
  });
});