const gulp = require('gulp');

// NODE_ENV=production sets an environement variable that will allow other tasks to know what we are build for.
gulp.task('set-dev-node-env', function() {
    process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', function() {
    process.env.NODE_ENV = 'production';
});