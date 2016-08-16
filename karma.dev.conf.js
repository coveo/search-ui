var commonConfig = require('./karma.common.conf');
var _ = require('underscore');

var configuration = _.extend({}, commonConfig, {
  singleRun: false,
  browsers: ['PhantomJS']
})

module.exports = function (config) {
  config.set(configuration);
};
