const ChromiumRevision = require('puppeteer/package.json').puppeteer.chromium_revision;
const Downloader = require('puppeteer/utils/ChromiumDownloader');
const revisionInfo = Downloader.revisionInfo(Downloader.currentPlatform(), ChromiumRevision);

process.env.CHROME_BIN = revisionInfo.executablePath;

var configuration = {
  singleRun: true,
  browsers: ['ChromeHeadless'],
  frameworks: ['jasmine'],
  browserNoActivityTimeout: 90000,
  browserDisconnectTolerance: 10,
  files: [
    {
      pattern: './node_modules/es6-promise/dist/es6-promise.auto.js',
      watched: false
    },
    {
      pattern: './unitTests/lib/jasmine-ajax/jasmine-ajax.js',
      watched: false
    },
    {
      pattern: 'https://cdnjs.cloudflare.com/ajax/libs/ag-grid/16.0.1/ag-grid.min.noStyle.js',
      watched: false
    },
    {
      pattern: './node_modules/axe-core/axe.js',
      watched: false
    },
    {
      pattern: './bin/js/CoveoJsSearch.js',
      watched: true
    },
    {
      pattern: './bin/tests/tests.js',
      watched: true
    }
  ],
  plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-coverage', 'karma-spec-reporter'],
  preprocessors: {
    './bin/tests/tests.js': 'coverage'
  },
  reporters: ['coverage', 'spec'],
  coverageReporter: {
    dir: './bin/coverage',
    reporters: [{ type: 'json', subdir: '.', file: 'coverage-es5.json' }, { type: 'lcov', subdir: 'lcov-es5' }]
  }
};

module.exports = function(config) {
  config.set(configuration);
};
