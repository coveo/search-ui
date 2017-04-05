var configuration = {
  singleRun: true,
  browsers: ['PhantomJS'],
  frameworks: ['jasmine'],
  files: [{
    pattern: './node_modules/es6-promise/dist/es6-promise.auto.js',
    watched: false
  }, {
    pattern: './node_modules/phantomjs-polyfill/bind-polyfill.js',
    watched: false
  }, {
    pattern: './test/lib/jasmine-ajax/jasmine-ajax.js',
    watched: false
  }, {
    pattern: './bin/js/CoveoJsSearch.js',
    watched: true
  }, {
    pattern: './bin/tests/tests.js',
    watched: true
  }],
  plugins: [
    'karma-jasmine',
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
