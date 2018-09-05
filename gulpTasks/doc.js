'use strict';
const gulp = require('gulp');
const TypeDoc = require('typedoc');
const fs = require('fs');
const shell = require('gulp-shell');
const notSupportedFeaturesConfig = require('./notSupportedFeaturesConfig');
const del = require('del');
const runsequence = require('run-sequence');
const _ = require('underscore');
const baseTsConfig = require('../tsconfig.json');

const docgenJsonPath = './bin/docgen/docgen.json';

gulp.task('doc', done => {
  runsequence('buildDoc', 'testDoc', done);
});

gulp.task('buildDoc', ['copyBinToDoc', 'buildPlayground'], () => {
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
  app.generateJson(project, docgenJsonPath, 'https://coveo.github.io/search-ui/');
  return gulp.src('./readme.png').pipe(gulp.dest('./docgen'));
});

gulp.task('cleanGeneratedThemesFiles', () => {
  return del(['./docs/theme/assets/gen/**/*']);
});

gulp.task('copyBinToDoc', ['cleanGeneratedThemesFiles'], () => {
  return gulp.src('./bin/{js,image,css}/**/*').pipe(gulp.dest('./docs/theme/assets/gen'));
});

gulp.task('buildPlayground', shell.task(['node node_modules/webpack/bin/webpack.js --config ./webpack.playground.config.js']));

gulp.task('testDoc', () => {
  const docgenJson = JSON.parse(fs.readFileSync(docgenJsonPath));

  // Check if object is defined and non-empty
  if (!docgenJson || !docgenJson.length) {
    throw new Error('Invalid object');
  }

  // Check that all attributes are defined correctly
  const attributes = [
    { name: 'name', types: ['string'] },
    { name: 'notSupportedIn', types: ['string', 'object'] },
    { name: 'comment', types: ['string'] },
    { name: 'type', types: ['string'] },
    { name: 'constrainedValues', types: ['object'] },
    { name: 'miscAttributes', types: ['object'] }
  ];

  _.each(docgenJson, element =>
    _.each(attributes, ({ name, types }) => {
      if (!_.has(element, name) || !_.contains(types, typeof element[name])) {
        throw new Error(`Invalid or missing attribute "${name}" for doc element "${JSON.stringify(element)}"`);
      }
    })
  );

  // Check that some specific doc elements are present
  const elements = [
    {
      name: 'SearchAlerts.usageAnalytics',
      notSupportedIn: '',
      comment:
        '<p>A reference to the <a href="https://coveo.github.io/search-ui/components/analytics.html#client">Analytics.client</a>.</p>\n',
      type: 'IAnalyticsClient'
    },
    {
      name: 'Thumbnail.options',
      notSupportedIn: '',
      comment: '<p>Options for the Thumbnail</p>\n',
      type: 'object'
    }
  ];

  _.each(elements, element => {
    if (!_.findWhere(docgenJson, element)) {
      throw new Error(`Can't find doc element "${JSON.stringify(element)}"`);
    }
  });
});
