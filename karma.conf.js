var configuration = {
  singleRun: true,
  browsers: ['PhantomJS'],
  frameworks: ['jasmine'],
  files: [{
    pattern: './node_modules/jasmine-core/lib/jasmine-core/jasmine.css',
    watched: false
  }, {
    pattern: './node_modules/es6-promise/dist/es6-promise.auto.js',
    watched: false
  }, {
    pattern: './node_modules/phantomjs-polyfill/bind-polyfill.js',
    watched: false
  }, {
    pattern: './test/lib/jasmine-2.4.1/jasmine.css',
    watched: false
  }, {
    pattern: './test/lib/jasmine-ajax/jasmine-ajax.js',
    watched: false
  }, {
    pattern: './bin/tests/tests.js',
    watched: true
  }],
  plugins: [
    'karma-jasmine',
    'karma-chrome-launcher',
    'karma-phantomjs-launcher',
    'karma-coverage',
    'karma-spec-reporter'
  ],
  preprocessors: {
    './bin/tests/tests.js': 'coverage'
  },
  reporters: ['coverage', 'spec'],
  coverageReporter: {
    dir: './bin/coverage',
    reporters: [
      {type: 'json', subdir: '.', file: 'coverage-es5.json'},
      {type: 'lcov', subdir: 'lcov-es5'}
    ]
  }
};

module.exports = function(config) {
  config.set(configuration);
};
