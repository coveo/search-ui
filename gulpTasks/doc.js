'use strict';
const gulp = require('gulp');
const TypeDoc = require('typedoc');
const fs = require('fs');
const shell = require('gulp-shell');
const notSupportedFeaturesConfig = require('./notSupportedFeaturesConfig');
const del = require('del');
const baseTsConfig = require('../tsconfig.json');

gulp.task('doc', ['copyBinToDoc', 'buildPlayground'], function() {
  const typedocConfig = {
    ...baseTsConfig.compilerOptions,
    mode: 'file',
    theme: 'docs/theme',
    name: 'Coveo JavaScript Search Framework - Reference Documentation',
    readme: 'README.md',
    excludePrivate: true,
    excludeProtected: true,
    ignoreCompilerErrors: true,
    notSupportedFeaturesConfig
  };

  const app = new TypeDoc.Application(typedocConfig);
  const src = app.expandInputFiles(['src']);
  const project = app.convert(src);
  app.generateDocs(project, 'docgen');
  app.generateJson(project, './bin/docgen/docgen.json', 'https://coveo.github.io/search-ui/');
  return gulp.src('./readme.png').pipe(gulp.dest('./docgen'));
});

gulp.task('cleanGeneratedThemesFiles', () => {
  return del(['./docs/theme/assets/gen/**/*']);
});

gulp.task('copyBinToDoc', ['cleanGeneratedThemesFiles'], function() {
  return gulp.src('./bin/{js,image,css}/**/*').pipe(gulp.dest('./docs/theme/assets/gen'));
});

gulp.task('buildPlayground', shell.task(['node node_modules/webpack/bin/webpack.js --config ./webpack.playground.config.js']));

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on('error', function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on('error', function(err) {
    done(err);
  });
  wr.on('close', function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
