'use strict';

const TestServer = require('karma').Server;
const fs = require('fs');
const _ = require('underscore');

fs.readdir(__dirname, (err, files) => {
  let filesToExecute = _.without(files, 'chunk.tester.js', 'webpackJsonp.js');
  _.each(filesToExecute, fileToExecute => {
    new TestServer({
      files: [`../bin/js/CoveoJsSearch.Lazy.js`, `../bin/js/${fileToExecute}`, `./${fileToExecute}`],
      browsers: ['PhantomJS'],
      frameworks: ['jasmine'],
      singleRun: true,
      reporters: ['spec']
    }, (exitCode) => {
      if (exitCode) {
        // Fail CI builds if any test fails (since karma will exit 1 on any error)
        throw new Error(exitCode);
      }
    }).start();
  })
})
