const { promisify } = require('util');
const { getLatestVersionOnNpm } = require('./npm.utilities');
const exec = promisify(require('child_process').exec);

async function main() {
  const branchName = process.env.BRANCH_NAME || '';

  if (!branchName) {
    return console.log('please specify a branch name');
  }

  const exists = await checkIfBranchExists(branchName);
  exists ? updateBranch() : createBranch();

  await push();
}

async function checkIfBranchExists(branchName) {
  try {
    await exec(`git show-ref --verify --quiet refs/heads/${branchName}`);
    return true;
  } catch (e) {
    console.log(`did not find a branch called: ${branchName}`);
    return false;
  }
}

async function updateBranch(branchName) {
  console.log(`updating branch: ${branchName}`);

  await exec(`git checkout ${branchName}`);
  await exec(`npm version patch`);
}

async function createBranch(branchName) {
  console.log(`creating branch: ${branchName}`);

  await exec(`git checkout -b ${branchName}`);
  const newVersion = await getNewReleaseVersion();
  await exec(`npm version ${newVersion}`);
}

async function getNewReleaseVersion() {
  const version = await getLatestVersionOnNpm();
  const { major, minor } = parseVersion(version);
  return `${major}.${minor + 1}.0`;
}

function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(num => parseInt(num, 10));
  return { major, minor, patch };
}

async function push(branchName) {
  console.log(`pushing branch: ${branchName}`);
  await exec(`git push origin ${branchName}`);
}

main();
