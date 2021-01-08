const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function getLatestVersionOnNpm() {
  const tags = await getTags();
  const latestTag = tags.find(tag => tag.indexOf('latest') !== -1);
  return latestTag.split(':')[1].trim();
}

async function getTags() {
  const command = 'npm dist-tags ls coveo-search-ui';
  const { stdout } = await exec(command);
  return stdout.split('\n');
}

module.exports = {
  getLatestVersionOnNpm
};
