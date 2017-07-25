const gulp = require('gulp');
const strings = require('../strings/strings');
const stringValidations = require('../strings/stringsValidations');

gulp.task('strings', [ 'fileTypes' ], function (done) {
  const dict = strings.load('./bin/strings/filetypesNew.json');
  dict.merge(strings.load('./strings/strings.json', { module: 'Coveo' }));

  dict.writeDeclarationFile('./src/strings/Strings.ts');
  dict.writeDefaultLanguage('./src/strings/DefaultLanguage.ts', 'en', './strings/cultures/globalize.culture.en-US.js', true);
  dict.writeLanguageFile('./bin/js/cultures/en.js', 'en', './strings/cultures/globalize.culture.en-US.js', false);
  dict.writeLanguageFile('./bin/js/cultures/fr.js', 'fr', './strings/cultures/globalize.culture.fr-FR.js', false);
  dict.writeLanguageFile('./bin/js/cultures/cs.js', 'cs', './strings/cultures/globalize.culture.cs.js', false);
  dict.writeLanguageFile('./bin/js/cultures/da.js', 'da', './strings/cultures/globalize.culture.da.js', false);
  dict.writeLanguageFile('./bin/js/cultures/de.js', 'de', './strings/cultures/globalize.culture.de.js', false);
  dict.writeLanguageFile('./bin/js/cultures/el.js', 'el', './strings/cultures/globalize.culture.el.js', false);
  dict.writeLanguageFile('./bin/js/cultures/es-es.js', 'es-ES', './strings/cultures/globalize.culture.es-ES.js', false);
  dict.writeLanguageFile('./bin/js/cultures/fi.js', 'fi', './strings/cultures/globalize.culture.fi.js', false);
  dict.writeLanguageFile('./bin/js/cultures/hu.js', 'hu', './strings/cultures/globalize.culture.hu.js', false);
  dict.writeLanguageFile('./bin/js/cultures/id.js', 'id', './strings/cultures/globalize.culture.id.js', false);
  dict.writeLanguageFile('./bin/js/cultures/it.js', 'it', './strings/cultures/globalize.culture.it.js', false);
  dict.writeLanguageFile('./bin/js/cultures/ja.js', 'ja', './strings/cultures/globalize.culture.ja.js', false);
  dict.writeLanguageFile('./bin/js/cultures/ko.js', 'ko', './strings/cultures/globalize.culture.ko.js', false);
  dict.writeLanguageFile('./bin/js/cultures/nl.js', 'nl', './strings/cultures/globalize.culture.nl.js', false);
  dict.writeLanguageFile('./bin/js/cultures/no.js', 'no', './strings/cultures/globalize.culture.no.js', false);
  dict.writeLanguageFile('./bin/js/cultures/pl.js', 'pl', './strings/cultures/globalize.culture.pl.js', false);
  dict.writeLanguageFile('./bin/js/cultures/pt-br.js', 'pt-BR', './strings/cultures/globalize.culture.pt-BR.js', false);
  dict.writeLanguageFile('./bin/js/cultures/ru.js', 'ru', './strings/cultures/globalize.culture.ru.js', false);
  dict.writeLanguageFile('./bin/js/cultures/sv.js', 'sv', './strings/cultures/globalize.culture.sv.js', false);
  dict.writeLanguageFile('./bin/js/cultures/th.js', 'th', './strings/cultures/globalize.culture.th.js', false);
  dict.writeLanguageFile('./bin/js/cultures/tr.js', 'tr', './strings/cultures/globalize.culture.tr.js', false);
  dict.writeLanguageFile('./bin/js/cultures/zh-cn.js', 'zh-CN', './strings/cultures/globalize.culture.zh-CN.js', false);
  dict.writeLanguageFile('./bin/js/cultures/zh-tw.js', 'zh-TW', './strings/cultures/globalize.culture.zh-TW.js', false);
  done();
});

gulp.task('testString', function (done) {
  stringValidations.validate('./strings/strings.json');
  done();
});
