'use strict';
const sizeOf = require('image-size');
const fs = require('fs-extra');
const path = require('path');
const walk = require('walk');
const _ = require('underscore');
const nodeSass = require('node-sass');

let args = require('yargs')
  .option('icons', {
    alias: 's',
    describe: 'The directory from which to load sprites'
  })
  .option('output', {
    alias: 'o',
    describe: 'The output directory'
  })
  .help('help')
  .argv;

function buildIconList(iconsDir, outputDir, fileName, done) {
  iconsDir = iconsDir || args.sprites;
  outputDir = outputDir || args.output;

  if (iconsDir == undefined) throw 'Error. No icon directory defined';
  if (outputDir == undefined) throw 'Error. No output directory defined';

  console.log('Generating icon list');
  
  let icons = [];

  let walker = walk.walk(iconsDir);
  walker.on('file', (root, fileStats, next) => fileHandler(icons, root, fileStats, next));
  walker.on('end', () => endHandler(icons, outputDir, fileName, done));
}

function generateCssClass(iconName, isFileType) {
  let cssClass = '';
  if (isFileType) {
    cssClass = `coveo-filetype-${iconName}`;
  }
  return cssClass;
}

function fileHandler(icons, root, fileStats, next) {
  let fullPath = path.join(root, fileStats.name);

  //node-walk only supports filters for directories...
  if (fileStats.name[0] !== '.' && !fileStats.name.endsWith('.orig')) {
    fs.readFile(fullPath, (err, svgContent) => {
      if (err) throw err;
      let iconName = fileStats.name.replace('.svg', '');
      const isFileType = root.indexOf('filetypes') != -1;
      let cssClass = generateCssClass(iconName, isFileType);
      icons.push({
        cssClass: cssClass,
        img: svgContent.toString('base64'),
        name: iconName,
        isFileType: isFileType
      });
    })
  }
  next();
}

function generateStyling() {
  return nodeSass.renderSync({
    file: 'sass/mixins/_salesforceIconsBackgroundColor.scss',
    includePaths: [__dirname + '/../sass']
  }).css;
}
function generateHtmlOutput(icons) {
  let row = _.template(
    `<tr>
       <td><code><%= iconInfo.name %></code></td>
       <td><code><%= iconInfo.cssClass %></code></td>
       <td><img class="<%= iconInfo.cssClass %>" src="data:image/svg+xml;base64,<%= iconInfo.img %>" /></td>
     </tr>`
  );
  let header = '<!DOCTYPE html><html><table>';
  let style = `<style>td, th { border: 1px solid #ccc; } table { text-align: center; }\n${generateStyling()}</style>`;
  let tableHeader = '<th>Icon name</th><th>Icon CSS class</th><th>Icon</th>'
  let footer = '</table></html>';
  icons = _.sortBy(icons, 'name');
  icons = _.sortBy(icons, iconInfo => iconInfo.isFileType ? 0 : 1);
  let rows = _.map(icons, iconInfo => row({ iconInfo: iconInfo })).join('');
  return header + style + tableHeader + rows + footer;
}

function endHandler(icons, outputDir, fileName, done) {
  let outFilename = fileName;
  if (!outFilename) {
    outFilename = path.join(outputDir, prefix + '-icon-list');
  }
  outFilename = path.join(outputDir, outFilename);
  fs.outputFileSync(`${outFilename}.html`, generateHtmlOutput(icons));
  fs.outputJsonSync(`${outFilename}.json`, icons);
  if (done) done();
}

if (require.main === module) {
  buildSpriteList();
}

module.exports = buildIconList;
