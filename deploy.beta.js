'use strict';
const login = require('npm-cli-login');
const exec = require('child_process').exec;
login('coveo', process.env.NPM_PW, 'sandbox_JSUI@coveo.com');

console.log('executing deploy script beta');
setTimeout(function () {
  exec('npm publish --tag beta', function (error, stdout, stderr) {
    console.log(error, stdout, stderr);
  })
}, 2000);
