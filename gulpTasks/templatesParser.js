'use strict';
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    var parent = path.dirname(directory);
    if (parent != null && !/^(\s*|\.)$/.test(parent)) {
      createDirectory(parent);
    }
    fs.mkdirSync(directory);
  }
}

function isTemplateFile(file) {
  const extname = path.extname(file);
  return (extname == '.ejs' || extname == '.html');
}

function readDirectory(directory) {
  return fs.readdirAsync(directory).map(fileName => {
    const fullPath = path.join(directory, fileName);
    return fs.statAsync(fullPath).then(stat => stat.isDirectory() ? readDirectory(fullPath) : fullPath);
  })
      .reduce((a, b) => a.concat(b), [])
      .filter(path => isTemplateFile(path));
}

function parseDirectory(directory, conditions) {
  return readDirectory(directory).map(template => {
    var extname = path.extname(template);
    var name = path.basename(template, extname);
    var subtemplate = (name.indexOf("_") == 0);
    name = subtemplate ? name.substr(1) : name;
    var condition = conditions[name];
    var content = fs.readFileSync(template).toString();
    var templateObj = {
      name: name,
      type: 'HtmlTemplate',
      condition: condition || {},
      subtemplate: subtemplate,
      path: path.dirname(path.relative(directory, template)),
      content: content,
      priority: condition != null ? condition.priority || 0 : -1,
      layout: condition != null ? condition.layout : null,
      role: condition != null ? condition.role : null
    };
    buildRegisterTemplate(templateObj);
    buildTemplateHtml(templateObj);
    return templateObj;
  }).then(templates => {
    return templates.sort((a, b) => a.priority < b.priority ? 1 : -1)
  })
}

function buildRegisterTemplate(template) {
  template.js = 'Coveo.TemplateCache.registerTemplate(' + [
        JSON.stringify(template.name),
        `Coveo.${template.type}.fromString(`
        + JSON.stringify(template.content) + ','
        + JSON.stringify({
          'condition': addToJsonIfNotNull(template, 'value'),
          'layout': addToJsonIfNotNull(template, 'layout'),
          'fieldsToMatch': addToJsonIfNotNull(template, 'fieldsToMatch'),
          'mobile': addToJsonIfNotNull(template, 'mobile'),
          'role': addToJsonIfNotNull(template, 'role')
        }) + '),'
        +
        (!template.subtemplate).toString(),
        (!template.subtemplate).toString()
      ].join(', ') + ')';
}

function buildTemplateHtml(template) {
  const cssClassName = 'result-template';
  const type = template.type == 'HtmlTemplate' ? 'text/html' : 'text/underscore';
  const layout = template.layout != null ? `data-layout="${template.layout}"` : '';
  const role = template.role != null ? `data-role="${template.role}"`: '';
  let fieldsCondition = '';
  if (template.condition) {
    if (template.condition.fieldsToMatch) {
      template.condition.fieldsToMatch.forEach((fieldToMatch)=> {
        fieldsCondition += `data-field-${fieldToMatch.field}`;
        if (fieldToMatch.values) {
          fieldsCondition += `="${fieldToMatch.values.join(',')}" `
        } else {
          fieldsCondition += '="" ';
        }
      });
    }
  }
  template.html = `<script id="${template.name}" class="${cssClassName}" type="${type}" ${layout} ${role} ${fieldsCondition}>${template.content}</script>`
}

function compileTemplates(directory, destination, fileName, conditions, done) {
  createDirectory(destination);
  parseDirectory(directory, conditions).then(templates => {
    let groupedTemplates = {};
    groupedTemplates[fileName] = [];
    templates.forEach(template => {
      if (groupedTemplates[template.path] == null) {
        groupedTemplates[template.path] = [];
      }
      groupedTemplates[template.path].push(template.js);
      groupedTemplates[fileName].push(template.js);
    });
    return groupedTemplates;
  }).then(groupedTemplates => {
    Object.keys(groupedTemplates).forEach(key => {
      fs.writeFileAsync(path.join(destination, key + '.js'), groupedTemplates[key].join('\n'));
    })
  }).then(()=> done()).catch(e => done(e));
}

function addToJsonIfNotNull(template, key) {
  if (template.condition && template.condition[key]) {
    return template.condition[key]
  }
  return null;
}

module.exports = {
  parseDirectory: parseDirectory,
  compileTemplates: compileTemplates
};
