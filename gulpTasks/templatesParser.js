var fs = require('fs');
var path = require('path');
var Q = require('q');
var fsReaddir = Q.denodeify(fs.readdir);
var fsWriteFile = Q.denodeify(fs.writeFile);
var fsStat = Q.denodeify(fs.stat);

function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    var parent = path.dirname(directory);
    if (parent != null && !/^(\s*|\.)$/.test(parent)) {
      createDirectory(parent);
    }
    fs.mkdirSync(directory);
  }
}

function findTemplates(directory, callback) {
  fsReaddir(directory).then(function (files) {
    Q.all(files.map(function (file) {
      var filePath = path.join(directory, file);
      var extname = path.extname(file);
      var deferred = Q.defer();
      fsStat(filePath).then(function (stat) {
        if (stat.isDirectory()) {
          findTemplates(filePath, function (subTemplates) {
            deferred.resolve(subTemplates);
          });
        } else if (stat.isFile() && (extname == '.ejs' || extname == '.html')) {
          deferred.resolve([filePath]);
        } else {
          deferred.resolve([]);
        }
      });
      return deferred.promise;
    })).then(function (results) {
      var templates = [];
      results.forEach(function (file) {
        templates = templates.concat(file)
      });
      callback(templates)
    });
  });
}

function parseDirectory(directory, conditions, callback) {
  findTemplates(directory, function (templates) {
    callback(templates.map(function (template) {
      var extname = path.extname(template);
      var name = path.basename(template, extname);
      var subtemplate = (name.indexOf("_") == 0);
      name = subtemplate ? name.substr(1) : name;
      var condition = conditions[name];
      var content = fs.readFileSync(template).toString();
      var templateObj = {
        name: name,
        type: (extname == '.html' ? 'HtmlTemplate' : 'UnderscoreTemplate'),
        condition: condition,
        subtemplate: subtemplate,
        path: path.dirname(path.relative(directory, template)),
        content: content,
        priority: condition != null ? condition.priority || 0 : -1
      };
      buildRegisterTemplate(templateObj);
      buildTemplateHtml(templateObj);
      return templateObj;
    }).sort(function (a, b) {
      return a.priority < b.priority ? 1 : -1;
    }));
  });
}

function buildRegisterTemplate(template) {
  template.js = 'Coveo.TemplateCache.registerTemplate(' + [
        JSON.stringify(template.name),
        'Coveo.' + template.type + '.fromString(' + JSON.stringify(template.content) + (template.condition != null ? ', ' + JSON.stringify(template.condition.value) : '') + ')',
        (!template.subtemplate).toString(),
        (!template.subtemplate).toString()
      ].join(', ') + ')';
}

function buildTemplateHtml(template) {
  template.html = '<script id=' + JSON.stringify(template.name) +
      ' class="result-template" type="' + ( template.type == 'HtmlTemplate' ? 'text/html' : 'text/underscore' ) + '" ' +
      (template.condition != null ? 'data-condition=' + JSON.stringify(template.condition.value) : '') + ' >' +
      template.content + '</script>';
}

function compileTemplates(directory, destination, fileName, conditions, done) {
  createDirectory(destination);
  parseDirectory(directory, conditions, function (templates) {
    var groupedTemplates = {};
    groupedTemplates[fileName] = [];
    templates.forEach(function (template) {
      if (groupedTemplates[template.path] == null) {
        groupedTemplates[template.path] = [];
      }
      groupedTemplates[template.path].push(template.js);
      groupedTemplates[fileName].push(template.js);
    });
    Q.all(Object.keys(groupedTemplates).map(function (key) {
          return fsWriteFile(path.join(destination, key + '.js'), groupedTemplates[key].join('\n'));
        }))
        .catch(function (e) {
          done(e)
        })
        .then(function () {
          done()
        });
  })
}

module.exports = {
  parseDirectory: parseDirectory,
  compileTemplates: compileTemplates
};