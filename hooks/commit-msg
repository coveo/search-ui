#!/usr/bin/env node

'use strict'

const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const colors = require('colors');
const ini = require('ini');

const urlBase = 'https://coveord.atlassian.net/browse/';
const projectAcronym = 'JSUI';
if (!fs.existsSync('.git/config')) {
  process.exit();
}
const gitConfig = ini.parse(fs.readFileSync('.git/config', {encoding: 'utf8'}));
if (gitConfig.jirahook && gitConfig.jirahook.disable) {
  process.exit();
}

let issueNumber;
let branchName = childProcess.execSync('git symbolic-ref --short HEAD', {encoding: 'utf8'});
branchName = branchName.trim();
let issueRegex = new RegExp(projectAcronym + '-[\\d]+','i');

let match = branchName.match(issueRegex);
if (match) {
  issueNumber = match[0].toUpperCase();
} else {
  console.log(colors.red(`Could not find JIRA issue in branch name
You can disable this hook using the repo git config:
[jirahook]
disable = true`));
  process.exit();
}

let commitMessageFilename = process.argv[2];
let commitMessage = fs.readFileSync(commitMessageFilename, {encoding: 'utf8'});
if (!commitHasIssueNumber(commitMessage, issueNumber) && !commitHasIssue(commitMessage)) {
  fs.appendFileSync(commitMessageFilename, os.EOL + urlBase + issueNumber);
  console.log(`Appended ${urlBase}${issueNumber} to commit message`.green);
} else if (!commitHasIssueNumber(commitMessage, issueNumber) && commitHasIssue(commitMessage)){
  console.log('Oops... Branch name and issue in commit message don\'t match'.red);
}

function commitHasIssue(commitMessage) {
  let urlIssueRegex = new RegExp(urlBase + issueRegex.source);
  return commitMessage.search(urlIssueRegex) != -1;
}

function commitHasIssueNumber(commitMessage, issueNumber) {
  return commitMessage.indexOf(urlBase + issueNumber) != -1;
}

