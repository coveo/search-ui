const gulp = require('gulp');

// NODE_ENV=production sets an environement variable that will allow other tasks to know what we are build for.
function setNodeProdEnv(cb) {
  process.env.NODE_ENV = 'production';
  cb();
}

module.exports = { setNodeProdEnv };
