const gulp = require('gulp');
const sonar = require('gulp-sonar');
const gutil = require('gulp-util');

gulp.task('sonar', function () {
  var options = {
    sonar: {
      host: {
        url: 'http://sonar.cloud.coveo.com'
      },
      jdbc: {
        url: 'jdbc:mysql://sonardb.cloud.coveo.com:3306/sonar?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true&useConfigs=maxPerformance',
        username: process.env.SONAR_JDBC_USERNAME,
        password: process.env.SONAR_JDBC_PASSWORD
      },
      projectKey: 'jsui',
      projectName: 'JSUI',
      // comma-delimited string of source directories
      sources: 'src',
      language: 'js',
      sourceEncoding: 'UTF-8',
      javascript: {
        lcov: {
          reportPath: 'coverage/lcov.info'
        }
      },
      exec: {
        // All these properties will be send to the child_process.exec method (see: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback )
        // Increase the amount of data allowed on stdout or stderr (if this value is exceeded then the child process is killed, and the gulp-sonar will fail).
        maxBuffer : 1024*1024
      }
    }
  };

  return gulp.src('nonexistent', { read: false })
    .pipe(sonar(options))
    .on('error', gutil.log)
})
