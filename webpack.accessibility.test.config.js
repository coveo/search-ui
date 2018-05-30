'use strict';
const baseTestConfig = require('./webpack.unit.test.config');

baseTestConfig.entry = {
  accessibilityTests: ['./accessibilityTest/Test.ts']
};

module.exports = baseTestConfig;
