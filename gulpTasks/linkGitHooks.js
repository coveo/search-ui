'use strict';

const fs = require('fs-extra');
const path = require('path');
const _ = require('underscore');
const Q = require('q');
const colors = require('colors');

const symlink = Q.denodeify(fs.ensureSymlink);
const copy = Q.denodeify(fs.copy);
const readdir = Q.denodeify(fs.readdir);

const gitHooksDir = '.git/hooks/';
const gitHooksSourceDir = 'hooks/';

function linkGitHooks(cb) {
  readdir(gitHooksSourceDir)
    .then(files => _.each(files, filename => createSymLink(filename)))
    .catch(err => console.log(colors.red(err)))
    .finally(cb);
}

function createSymLink(filename) {
  const symname = path.resolve(process.cwd(), gitHooksDir + filename);
  const source = path.resolve(process.cwd(), gitHooksSourceDir + filename);

  symlink(source, symname, 'file').catch(err => {
    //Need to be admin on windows to create a symlink (╯°□°）╯︵ ┻━┻
    console.log("Couldn't create a symlink, trying to copy...".yellow);
    copy(source, symname)
      .done(() => {
        console.log('Hook successfully copied');
      })
      .catch(err => {
        console.log(colors.red(err));
      });
  });
}

module.exports = { linkGitHooks };
