const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function main() {
  const branchName = process.argv[2];

  const exists = await branchExists(branchName);
  console.log(exists);
}

async function branchExists(branchName) {
  try {
    await exec(`git show-ref --verify --quiet refs/heads/${branchName}`);
    return true;
  } catch (e) {
    console.log(`did not find a branch called: ${branchName}`);
    return false;
  }
}

main();
