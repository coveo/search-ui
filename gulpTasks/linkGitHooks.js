'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const Q = require('Q');
const colors = require('colors');

const lstat = Q.denodeify(fs.stat);
const symlink = Q.denodeify(fs.symlink);

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
      let cwd = process.cwd();
      process.chdir(gitHooksDir);
      symlink(source, symname, 'file')
        .catch(err => {
          console.log(colors.red(err));
        })
        .finally(() => {
          process.chdir(cwd);
        });
    });
  });
});