const fs = require('fs');
const path = require('path');
const _ = require('underscore');

exports.ensureDirectory = function(dir) {
  if (!fs.existsSync(dir)) {
    exports.ensureDirectory(path.dirname(dir));
    fs.mkdirSync(dir);
  }
};

exports.exec = function(command, args, options, done) {
  options = _.extend({}, {
    failOnError: true
  }, options);
  
  var p = require('child_process').spawn(command, args, {
    stdio: 'inherit'
  })
    .on('exit', function (code) {
      if (options.failOnError && code != 0) {
        done(command + " " + args + " failed with error " + code);
      } else {
        done();
      }
    });
};
