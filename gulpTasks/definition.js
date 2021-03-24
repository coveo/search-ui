const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const footer = require('gulp-footer');
const shell = require('gulp-shell');
const tvm = require('tvm');

const definitions = gulp.series(externalDefs, internalDefs, cleanDefs);

function cleanDefs() {
  return (
    gulp
      .src('bin/ts/CoveoJsSearch.d.ts')
      .pipe(footer('declare module Coveo {\n\t class ResultLayout extends ResultLayoutSelector { }\n}\n'))
      .pipe(replace(/import.*$/gm, ''))
      .pipe(replace(/(declare module )(.*)( {$)/gm, '$1Coveo$3'))
      .pipe(replace(/export =.+;$/gm, ''))
      .pipe(replace(/export .+ from .+$/gm, ''))
      .pipe(replace(/export (?:default )?(.*)$/gm, '$1'))
      .pipe(replace(/private .+;$/gm, ''))
      .pipe(replace(/\t[A-Za-z]+;$/gm, ''))
      .pipe(replace(/\n\t\s*(\n\t\s*)/g, '$1'))
      .pipe(footer('declare module "coveo-search-ui" {\n\texport = Coveo;\n}'))
      .pipe(replace(/never/gm, 'void'))
      .pipe(replace(/ensureDom: Function;\n\s*options\?: any;/gm, 'ensureDom: Function;\n\t\toptions: any;'))
      .pipe(replace(/^(\s*const\s\w+\s)(=\s\w+);$/gm, '$1: any;'))
      .pipe(replace(/:\s?.*ModuleDefinition\./gm, ': ')) // Assume that types that end with ModuleDefinition were imported using the import type only syntax
      // and stripping ModuleDefinition will refer to the correct type.
      .pipe(replace(/\n\t(?:const|let|var)\s.*;/gm, ''))
      .pipe(replace(/readonly/gm, ''))
      .pipe(replace(/undefined/g, 'any'))
      .pipe(replace(/ Record<.*>/g, ' any'))
      .pipe(replace(getEnumRegex(), clearEnumVariableDeclaration))
      .pipe(replace(/extends agGridModule\.[a-zA-Z]+/g, 'extends Object'))
      .pipe(replace(/implements agGridModule\.[a-zA-Z]+/g, 'implements Object'))
      .pipe(replace(/agGridModule\.[a-zA-Z]+/g, 'any'))
      .pipe(replace(/\(this: [A-Za-z_-]+, /gm, '('))
      .pipe(replace(/\| null/gm, '| void'))
      .pipe(replace(/moment\.[a-zA-Z]+/g, 'any'))
      .pipe(replace(/Partial<[A-z]*>/g, 'any'))
      .pipe(replace(/<\s?([a-z]+)\s?=\s?[a-z]+\s?>/gi, '<$1>'))
      .pipe(replace(/ShadowRootInit/, 'any'))
      .pipe(gulp.dest('bin/ts/'))
  );
}

function clearEnumVariableDeclaration(match, p1, p2) {
  let lines = p2.split('\n');
  lines = lines.map(line => line.replace(/ = ["|'][a-zA-Z_$\s]*["|']/, ''));
  return p1 + lines.join('\n');
}

function getEnumRegex() {
  const enumIdentifier = '(enum [a-zA-Z_$]+\\s{$)';
  const enumDeclaration = '\\n^\\s*[a-zA-Z_$]+ = "[a-zA-Z_$\\s]+",?$';
  const documentation = '\\n^\\s*[@{}\\[\\]\\w\\/*.,\\s\\(\\)\\|;]+$';
  return new RegExp(`${enumIdentifier}((?:${enumDeclaration}|${documentation})*)`, 'gm');
}

function externalDefs() {
  return gulp
    .src([
      './node_modules/@types/underscore/index.d.ts',
      './lib/es6-promise/index.d.ts',
      './lib/modal-box/index.d.ts',
      './node_modules/@types/d3/index.d.ts',
      './lib/globalize/index.d.ts',
      './lib/jstimezonedetect/index.d.ts',
      // './lib/coveoanalytics/index.d.ts',
      './lib/map/index.d.ts'
    ])
    .pipe(concat('Externals.d.ts'))
    .pipe(replace(/import.*$/gm, ''))
    .pipe(replace(/(declare module )(.*)( {$)/gm, '$1$2$3'))
    .pipe(replace(/export as namespace .*;$/gm, ''))
    .pipe(replace(/export =.+;$/gm, ''))
    .pipe(replace(/export .+ from .+$/gm, ''))
    .pipe(replace(/export (?:default )?(.*)$/gm, '$1'))
    .pipe(replace(/private .+;$/gm, ''))
    .pipe(replace(/\t[A-Za-z]+;$/gm, ''))
    .pipe(replace(/\n\t\s*(\n\t\s*)/g, '$1'))
    .pipe(replace(/never/gm, 'void'))
    .pipe(replace(/undefined/g, 'any'))
    .pipe(replace(/Partial<[A-z]*>/g, 'any'))
    .pipe(gulp.dest('./bin/ts'));
}

function internalDefs() {
  return require('dts-generator').default({
    name: 'Coveo',
    project: './',
    out: 'bin/ts/CoveoJsSearch.d.ts',
    externs: ['Externals.d.ts'],
    verbose: true,
    exclude: [
      'lib/**/*.d.ts',
      'node_modules/**/*.d.ts',
      'typings/**/*.d.ts',
      'src/*.ts',
      'bin/**/*.d.ts',
      'test/lib/**/*.d.ts',
      'test/Test.ts'
    ]
  });
}

function installTSV1(cb) {
  const version = '1.8.10';
  tvm.install(version, () => tvm.use(version, cb));
}

const validateTSV1 = gulp.series(installTSV1, shell.task('node node_modules/tvm/current/bin/tsc --noEmit ./bin/ts/CoveoJsSearch.d.ts'));

const validateTSV2 = shell.task(['node node_modules/typescript/bin/tsc --noEmit ./bin/ts/CoveoJsSearch.d.ts']);

const validateDefs = gulp.parallel(validateTSV1, validateTSV2);

module.exports = { definitions, validateDefs };
