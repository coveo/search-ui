const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const compareVersions = require('compare-versions');
const { getMajorMinorVersion, getVersion } = require('./tag.utilities');
const { getLatestVersionOnNpm } = require('./npm.utilities');

async function createAndDeployPackage() {
  const paramString = await getResolvedParamString();
  const command = `deployment-package package create ${paramString} --for-spinnaker --with-deploy`;

  console.log('creating and deploying package');
  await exec(command);
}

async function getResolvedParamString() {
  const npmVersion = await getLatestNpmVersion();
  const params = [`MAJOR_MINOR_VERSION=${getMajorMinorVersion()}`, `LATEST_NPM_VERSION=${npmVersion}`];
  return ['', ...params].join(' --resolve ').trim();
}

async function getLatestNpmVersion() {
  const currentVersion = getVersion();
  const latestVersion = await getLatestVersionOnNpm();
  const isCurrentVersionNewerThanLatest = compareVersions(currentVersion, latestVersion) === 1;

  return isCurrentVersionNewerThanLatest ? currentVersion : latestVersion;
}

async function main() {
  try {
    await createAndDeployPackage();
    console.log('Successfully uploaded package to deployment pipeline');
    process.exit(0);
  } catch (e) {
    console.log('Failed to upload package to deployment pipeline', e);
    process.exit(1);
  }
}

main();
