const gulp = require('gulp');
const requireDir = require('require-dir');
const rmdir = require('gulp-rimraf');
const runsequence = require('run-sequence');
const shell = require('gulp-shell');

requireDir('./gulpTasks');

gulp.task('default', ['build', 'buildLegacy']);

gulp.task('build', function (done) {
  runsequence('clean', ['css', 'fileTypes', 'sprites', 'strings', 'setup'], 'compile', 'definitions', done);
});

gulp.task('buildLegacy', function (done) {
  runsequence(['cssLegacy', 'fileTypesLegacy', 'spritesLegacy'], done)
})

gulp.task('clean', function (done) {
  return gulp.src(['./bin', './zip/**.zip'], {read: false})
      .pipe(rmdir())
});

/*function () {


 var app = new TypeDoc.Application({
 target: 'ES5',
 module: 'commonjs',
 includeDeclarations: true,
 theme: 'docs/theme',
 name: 'Coveo JS search',
 mode: 'file',
 readme: 'none',
 externalPattern: '',
 excludeExternal : true
 });
 var src = app.expandInputFiles(['src/Typedoc.ts']);
 var project = app.convert(src);
 var doc = app.generateDocs(project, 'docstest');
 //console.log(project);
 //var docs = project.toObect();

 var docs = project.toObject();
 var components = [];

 function lookForComponent(current){
 if(current.kindString == "Coveo component"){
 var component = {
 name: current.name,
 description: current.comment.shortText
 };
 var options = current.children.find(function(child){
 return child.name == 'options';
 });
 if(options != null && options.children != null){
 component.options = options.children.map(function(option){
 return {
 name: option.name,
 description: option.comment.shortText
 }
 })
 }
 components.push(component);
 }
 if(current.children) {
 current.children.forEach(lookForComponent)
 }
 }

 lookForComponent(docs);
 })*/