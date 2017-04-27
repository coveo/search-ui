var commonConfig = require('./karma.common.conf');
var _ = require('underscore');

var configuration = _.extend({}, commonConfig, {
  singleRun: true,
  browsers: ['PhantomJS']
})

module.exports = function(config) {
  config.set(configuration);
};