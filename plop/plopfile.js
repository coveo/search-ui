'use strict';
const Q = require('q');
const path = require('path');
const fs = require('fs');
const pathToBundle = path.resolve('../bin/Plop.Bundle.ts');

try {
  const stats = fs.lstatSync(pathToBundle);
  if (stats.isFile()) {
    fs.unlinkSync(pathToBundle);
  }
}
catch (e) {
}

const toExclude = ['Misc', 'Base', 'ResponsiveComponents'];

var getComponentsList = (dir)=> {
  return fs.readdirSync(path.resolve(dir)).filter((file)=> {
    return toExclude.indexOf(file) == -1;
  });
}

var getBundleByName = (name)=> {
  return `export * from '../src/${name}';`
}

var components = getComponentsList('../src/ui');

module.exports = function (plop) {
  plop.setGenerator('Create a new bundle', {
    description: `Create a new customized component bundle`,
    prompts: [{
      message: `Choose component to add to the bundle.\nPress spacebar to select multiple, enter to finish selection`,
      type: 'checkbox',
      name: 'components',
      choices: ()=> {
        return components.map((cmp)=> {
          return {name: cmp, value: cmp}
        })
      }
    }],
    actions: (data)=> {
      var actions = [];
      if (data.components.length === 0) {
        actions.push(() => {
          return `No component were selected : Exiting.`
        });
      } else {
        data.base = getBundleByName('Base');
        data.basicextensioncode = getBundleByName('UIBase');
        actions.push({
          type: 'add',
          path: path.resolve('../bin/Plop.Bundle.ts'),
          templateFile: path.resolve('./plopTemplates/plop.bundle.template.hbs')
        })
      }
      return actions;
    }
  })
}