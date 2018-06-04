'use strict';
const baseTestConfig = require('./webpack.unit.test.config');

baseTestConfig.entry = {
  accessibilityTests: ['./accessibilityTest/Test.ts']
};

baseTestConfig.externals = [
  {
    'coveo-search-ui': 'Coveo'
  }
];

module.exports = baseTestConfig;
