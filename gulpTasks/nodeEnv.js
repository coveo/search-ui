const gulp = require('gulp');

// NODE_ENV=production sets an environement variable that will allow other tasks to know what we are build for.
gulp.task('setNodeProdEnv', function(done) {
    process.env.NODE_ENV = 'production';
    done();
});
