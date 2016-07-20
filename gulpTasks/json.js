const gulp = require('gulp');
const TypeDoc = require('typedoc');

gulp.task('json', function () {
  var app = new TypeDoc.Application({
    mode: 'file',
    target: 'ES5',
    experimentalDecorators: true,
    module: 'CommonJS',
    includeDeclarations: true,
    theme: 'docs/theme',
    name: 'Coveo search ui documentation',
    readme: 'README.md',
    externalPattern: '**/{typings,lib}/**'
  });
  var src = app.expandInputFiles(['src/Doc.ts']);
  var project = app.convert(src);
  app.generateJson(project, '/users/fgagnon/docgen.json');
})
