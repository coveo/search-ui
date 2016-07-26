'use strict';

const gulp = require('gulp');
const fs = require('fs-extra');
const path = require('path');
const _ = require('underscore');
const Q = require('Q');
const colors = require('colors');

const symlink = Q.denodeify(fs.ensureSymlink);
const copy = Q.denodeify(fs.copy);
const readdir = Q.denodeify(fs.readdir);

gulp.task('linkGitHooks', function() {
  let noSuchFile = -2;
  let gitHooksDir = '.git/hooks/';
  let gitHooksSourceDir = 'hooks/';

  readdir(gitHooksSourceDir).then((files) => {
    _.each(files, filename => {
      let symname = path.resolve(process.cwd(), gitHooksDir + filename);
      let source = path.resolve(process.cwd(), gitHooksSourceDir + filename);
      let cwd = process.cwd();
      process.chdir(gitHooksDir);
      symlink(source, symname, 'file')
          .catch(err => {
            //Need to be admin on windows to create a symlink (╯°□°）╯︵ ┻━┻
            console.log('Couldn\'t create a symlink, trying to copy...'.yellow);
            copy(source, symname)
                .done(() => {
                  console.log('Hook successfully copied.');
                })
                .catch(err => {
                  console.log(colors.red(err));
                });
          })
          .finally(() => {
            process.chdir(cwd);
          });
    });
  });
});