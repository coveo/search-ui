var configuration = {
  singleRun: true,
  browsers: ['PhantomJS'],
  frameworks: ['jasmine'],
  files: [
    {
      pattern: './bin/js/CoveoJsSearch.Lazy.js',
      watched: true
    },
    {
      pattern: './chunkTesters/chunk.CoveoJsSearch.Lazy.js',
      watched: true
    }
  ],
  plugins: [
    'karma-jasmine',
    'karma-chrome-launcher',
    'karma-phantomjs-launcher',
    'karma-coverage',
    'karma-spec-reporter'
  ],
  reporters: ['spec']
};

module.exports = function (config) {
  config.set(configuration);
};
