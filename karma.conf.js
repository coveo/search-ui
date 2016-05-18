module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    singleRun: true,
    files: ['./test/lib/jasmine-ajax/jasmine-ajax.js', './test/lib/jquery.js', './bin/js/CoveoJsSearch.js', './bin/js/CoveoJsSearch.dependencies.js', './bin/tests/tests.js'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ],
    preprocessors: {
      './bin/js/CoveoJsSearch.js': 'coverage'
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'text-summary'
    }
  });
};