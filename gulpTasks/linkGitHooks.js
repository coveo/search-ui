'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const Q = require('Q');
const colors = require('colors');

const lstat = Q.denodeify(fs.lstat);

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
        fs.symlinkSync(source, symname, 'file');
        process.chdir(cwd);
      };

      lstat(symname)
          .then(stats => {
            if (!stats.isSymbolicLink()) {
              fs.unlinkSync(symname);
              createSymlink();
            }
          })
          .catch(err => {
            console.log(colors.red(err));
          });
    });
  });
});