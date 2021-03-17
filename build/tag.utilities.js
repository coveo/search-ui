const tag = process.env.TAG_NAME || '';

const number = '[0-9]+';
const dot = '[.]';

function isTagged() {
  return tag && tag !== '';
}

function majorMinorForm() {
  return `${number}${dot}${number}`;
}

function getVersion() {
  return require('../package.json').version;
}

function isAlphaVersion() {
  return getMajorMinorVersion() === '2.0';
}

function getMajorMinorVersion() {
  const version = getVersion();
  const form = `^${majorMinorForm()}`;
  const majorMinorRegex = new RegExp(form);

  return majorMinorRegex.exec(version)[0];
}

function getPatchVersion() {
  const version = getVersion();
  const patchForm = `${number}$`;
  const regex = new RegExp(patchForm);

  return regex.exec(version)[0];
}

module.exports = {
  isTagged,
  getVersion,
  isAlphaVersion,
  getMajorMinorVersion,
  getPatchVersion
};
