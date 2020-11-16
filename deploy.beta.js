'use strict';
const login = require('npm-cli-login');
const exec = require('child_process').exec;
login(process.env.NPM_USERNAME, process.env.NPM_PW, 'sandbox_JSUI@coveo.com');

const travisBranchName = process.env.TRAVIS_BRANCH || '';
let branchToTag = '';

if (travisBranchName) {
  branchToTag = travisBranchName.replace('-beta', '');
  const match = branchToTag.match(/([0-9]{1}.[0-9]+).[0-9]+/);
  if (match) {
    if (match[1] == '2.0' || match[1] == '1.0') {
      branchToTag = '-master';
    } else {
      branchToTag = `-${match[1]}`;
    }
  }
}

console.log('executing deploy script beta');
setTimeout(function () {
  exec(`npm publish --tag beta${branchToTag}`, function (error, stdout, stderr) {
    if (error) {
      console.log(error, stdout, stderr);
      process.exit(1);
    }
  });
}, 2000);
