const puppeteer = require('puppeteer');

process.env.CHROME_BIN = puppeteer.executablePath();

const configuration = {
  singleRun: true,
  browsers: ['ChromeHeadless'],
  frameworks: ['jasmine'],
  browserDisconnectTimeout: 120000,
  browserNoActivityTimeout: 120000,
  captureTimeout: 120000,
  processKillTimeout: 120000,
  browserDisconnectTolerance: 10,
  files: [
    {
      pattern: './node_modules/es6-promise/dist/es6-promise.auto.js',
      watched: false
    },
    {
      pattern: './testsFramework/lib/jasmine-ajax/jasmine-ajax.js',
      watched: false
    },
    {
      pattern: 'https://cdnjs.cloudflare.com/ajax/libs/ag-grid/16.0.1/ag-grid.min.noStyle.js',
      watched: false
    },
    {
      pattern: './bin/js/CoveoJsSearch.js',
      watched: true
    },
    {
      pattern: './bin/tests/unitTests.js',
      watched: true
    }
  ],
  plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-coverage', 'karma-spec-reporter'],
  preprocessors: {
    './bin/tests/unitTests.js': 'coverage'
  },
  reporters: ['coverage', 'spec'],
  coverageReporter: {
    dir: './bin/coverage',
    reporters: [
      { type: 'json', subdir: '.', file: 'coverage-es5.json' },
      { type: 'lcov', subdir: 'lcov-es5' }
    ]
  }
};

module.exports = function(config) {
  config.set(configuration);
};
