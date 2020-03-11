const ChromiumRevision = require('puppeteer/package.json').puppeteer.chromium_revision;
const Downloader = require('puppeteer/utils/ChromiumDownloader');
const revisionInfo = Downloader.revisionInfo(Downloader.currentPlatform(), ChromiumRevision);

process.env.CHROME_BIN = revisionInfo.executablePath;

/**
 * @type {import('karma').ConfigOptions}
 */
var configuration = {
  singleRun: true,
  browsers: ['ChromeHeadless'],
  frameworks: ['jasmine'],
  browserNoActivityTimeout: 90000,
  browserDisconnectTolerance: 10,
  files: [
    {
      pattern: './bin/tests/lib/axe.js',
      watched: false
    },
    {
      pattern: './bin/css/CoveoFullSearch.css',
      type: 'css',
      watched: true
    },
    {
      pattern: './bin/js/CoveoJsSearch.js',
      watched: true
    },
    {
      pattern: './bin/tests/accessibilityTests.js',
      watched: true
    }
  ],
  reporters: ['spec'],
  plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-spec-reporter']
};

module.exports = function(config) {
  config.set(configuration);
};
