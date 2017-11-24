var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var cheerio = require('cheerio');
var JSON5 = require('json5');
var utilities = require('../gulpTasks/buildUtilities');

exports.load = function(from, options) {
  return new Dictionary(from, options);
};

// Converts from the old XML format to the new one; typically a single usage thing
exports.convert = function(from, to) {
  from = cheerio.load(fs.readFileSync(from));

  var keys = _.uniq(
    from('string').map(function(i, s) {
      return cheerio(s).attr('name');
    })
  );

  var languages = _.uniq(
    from('string').map(function(i, s) {
      return cheerio(s).attr('language');
    })
  );

  var json = {};
  _.each(keys, function(key) {
    json[key] = {};
    _.each(languages, function(language) {
      json[key][language] = from('string[name="' + key + '"][language="' + language + '"]').text();
    });
  });

  utilities.ensureDirectory(path.dirname(to));
  fs.writeFileSync(to, JSON.stringify(json, undefined, ' '));
};

const mergeFunctionAsString =
  'var merge = function(obj1, obj2) {\n' +
  '  var obj3 = {};\n' +
  '  for(var attrname in obj1){obj3[attrname] = obj1[attrname]; }\n' +
  '  for(var attrname in obj2){obj3[attrname] = obj2[attrname]; }\n' +
  '  return obj3;\n' +
  '}\n';

function dictObjectAsString(json, language) {
  var dictAsString = 'var dict = {\n';

  _.each(_.keys(json), function(key) {
    var str = json[key][language.toLowerCase()];
    if (str != undefined) {
      dictAsString += '  ' + JSON.stringify(key) + ': ' + JSON.stringify(json[key][language.toLowerCase()]) + ',\n';
    }
  });

  dictAsString += '}\n';
  return dictAsString;
}

function setPrototypeOnNativeString(language) {
  // Be careful not to override existing localizations, since we sometimes load many
  // separate string files for the same language (ex: interface editor).
  var languageWithQuotes = JSON.stringify(language);
  var nativeStringPrototype = '  var locales = String["locales"] || (String["locales"] = {});\n';
  nativeStringPrototype += '  locales[' + languageWithQuotes + '] = merge(locales[' + languageWithQuotes + '], dict);\n';
  nativeStringPrototype += '  String["toLocaleString"].call(this, { ' + languageWithQuotes + ': dict });\n';
  nativeStringPrototype += '  String["locale"] = ' + languageWithQuotes + ';\n';
  nativeStringPrototype += '  String["defaultLocale"] = "en";\n';
  nativeStringPrototype += '  Globalize.culture(' + languageWithQuotes + ')';
  return nativeStringPrototype;
}

function Dictionary(from, options) {
  options = _.extend(
    {
      module: 'Strings',
      variable: 'l'
    },
    options
  );

  this.json = JSON5.parse(fs.readFileSync(from));

  this.merge = function(dict) {
    this.json = _.extend(this.json, dict.json);
  };

  this.writeDeclarationFile = function(to) {
    var code = '';
    code += "import { L10N } from '../misc/L10N';\n";
    var that = this;
    _.each(_.keys(this.json), function(key) {
      var str = that.json[key];
      var params = getStringParameters(str.en, true);
      code += 'export function l(str : "' + key + '"'; // { return L10N.format("' + key + '"';
      if (params.typed != '') {
        code += ' , ' + params.typed;
      }
      code += ');\n';
    });
    code += 'export function l(...params : any[]);\n';
    code += 'export function l(...params : any[]) { return L10N.format.apply(this, arguments) };\n';

    utilities.ensureDirectory(path.dirname(to));
    fs.writeFileSync(to, code);
  };

  this.writeDefaultLanguage = function(to, language) {
    var code = "import * as Globalize from 'globalize';\n";
    code += mergeFunctionAsString;
    code += dictObjectAsString(this.json, language);
    code += 'export function defaultLanguage() {\n';
    code += setPrototypeOnNativeString(language) + '\n';
    code += '}\n';
    code += 'export function setLanguageAfterPageLoaded() {\n';
    code += setPrototypeOnNativeString(language) + '\n';
    code += '}\n';

    utilities.ensureDirectory(path.dirname(to));
    fs.writeFileSync(to, code);
  };

  this.writeLanguageFile = function(to, language, culture, typed) {
    var cultureFileAsString = fs.readFileSync(culture).toString();
    var code = cultureFileAsString + '(function() {\n';
    code += mergeFunctionAsString;
    code += dictObjectAsString(this.json, language);
    code += setPrototypeOnNativeString(language);
    code += '})();\n';
    code += 'if(!window.Coveo){window.Coveo = {};}\n';
    code += 'Coveo.setLanguageAfterPageLoaded = function() {\n';
    code += mergeFunctionAsString + '\n';
    code += dictObjectAsString(this.json, language) + '\n';
    code += setPrototypeOnNativeString(language) + '\n';
    code += '}';
    utilities.ensureDirectory(path.dirname(to));
    fs.writeFileSync(to, code);
  };

  function getStringParameters(text) {
    var params = _.map(_.range(getNumberOfParameters(text)), function(i) {
      return 'param' + i.toString();
    });
    var paramsWithType = _.map(params, function(p) {
      return p + ': string';
    });

    if (hasSingularOrPlural(text)) {
      params.push('count');
      paramsWithType.push('count: number');
    }

    return {
      untyped: params.join(', '),
      typed: paramsWithType.join(', ')
    };
  }

  function getNumberOfParameters(text) {
    var count = 0;
    while (text.indexOf('{' + count.toString() + '}') != -1) {
      ++count;
    }

    return count;
  }

  function hasSingularOrPlural(text) {
    return text.search(/<pl>.*<\/pl>|<sn>.*<\/sn>/) != -1;
  }
}
