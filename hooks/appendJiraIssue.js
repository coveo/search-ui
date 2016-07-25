#!/usr/bin/env node

'use strict'

const childProcess = require('child_process');
const fs = require('fs');

let branchName = childProcess.execSync('git symbolic-ref --short HEAD', {encoding: 'utf8'});
branchName = branchName.trim();

let issueRegex = new RegExp(/JSUI-[\d]+/, 'm');


let commitMessageFilename = process.argv[1];

let commitMessage = fs.readFileSync(commitMessageFilename);

