const gulp = require('gulp');
const TypeDoc = require('typedoc');

gulp.task('doc', function () {
  var app = new TypeDoc.Application({
    mode: 'file',
    target: 'ES5',
    experimentalDecorators: true,
    module: 'CommonJS',
    includeDeclarations: true,
    theme: 'docs/theme',
    name: 'Coveo search ui documentation',
    readme: 'README.md',
    externalPattern: '**/{typings,lib}/**',
    ignoreCompilerErrors: true
  });
  var src = app.expandInputFiles(['src/Doc.ts']);
  var project = app.convert(src);
  app.generateDocs(project, 'docgen');
  app.generateJson(project, './bin/docgen/docgen.json', 'https://coveo.github.io/search-ui/');
})
