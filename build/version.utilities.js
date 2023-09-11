function getVersion() {
  return require('../package.json').version;
}

function isAlphaVersion() {
  return getMajorMinorVersion() === '2.0';
}

function getMajorMinorVersion() {
  const version = getVersion();
  const { major, minor } = parseVersion(version);
  return `${major}.${minor}`;
}

function getPatchVersion() {
  const version = getVersion();
  return parseVersion(version).patch;
}

function parseVersion(version) {
  /** @type {string[]} */
  const [major, minor, patch] = version.split('.').map(num => parseInt(num, 10));
  return { major, minor, patch };
}

module.exports = {
  getVersion,
  isAlphaVersion,
  getMajorMinorVersion,
  getPatchVersion,
  parseVersion
};
