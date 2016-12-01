'use strict';

const exec = require('child_process').exec;
const cmd = 'npm publish --tag beta';

console.log('executing deploy script beta');
exec(cmd, function (error, stdout, stderr) {
  console.log(error, stdout, stderr);
});
