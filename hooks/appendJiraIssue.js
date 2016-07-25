#!/usr/bin/env node

'use strict'

const childProcess = require('child_process');

let branchName = childProcess.execSync('git symbolic-ref --short HEAD', {encoding: 'utf8'});
branchName = branchName.trim().replace(/\r\n$/, '');
console.log(branchName);
