const gulp = require('gulp');
const TypeDoc = require('typedoc');

gulp.task('doc', function () {
  var app = new TypeDoc.Application({
    mode: 'file',
    target: 'ES5',
    module: 'CommonJS',
    includeDeclarations: true,
    theme: 'docs/theme',
    name: 'Coveo JS search',
    readme: 'none',
    externalPattern: '**/typings/**',
    excludeExternal: false
  });
  var src = app.expandInputFiles(['src/Exports.ts']);
  var project = app.convert(src);
  app.generateDocs(project, 'docstest');
})
