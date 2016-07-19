'use strict';
const sizeOf = require('image-size');
const fs = require('fs-extra');
const path = require('path');
const walk = require('walk');
const _ = require('underscore');
const color = require('colors');

let args = require('yargs')
  .option('sprites', {
    alias: 's',
    describe: 'The directory from which to load sprites'
  })
  .option('output', {
    alias: 'o',
    describe: 'The output directory'
  })
  .help('help')
  .argv;

function buildSpriteList(spriteDir, outputDir, fileName, done) {
  spriteDir = spriteDir || args.sprites;
  outputDir = outputDir || args.output;

  if (spriteDir == undefined) throw 'Error. No sprite directory defined';
  if (outputDir == undefined) throw 'Error. No output directory defined';

  console.log(`Generating sprite list for ${spriteDir} as ${fileName}`.green.bgBlue);

  let sprites = {};
  let prefix = spriteDir.indexOf('retina') !== -1 ? 'retina' : 'normal';

  let walker = walk.walk(spriteDir);
  walker.on('file', (root, fileStats, next) => fileHandler(sprites, root, fileStats, prefix, next));
  walker.on('end', () => endHandler(sprites, outputDir, prefix, fileName, done));
}

function generateCssClass(filePath, prefix) {
  let prefixToReplace = prefix === 'retina' ? 'image-retina-' : 'image-';
  let returnValue = '.coveo-' + filePath
    .replace(/\//g, '-')
    .replace(/\\/, '-')
    .replace(prefixToReplace, '')
    .replace('.png', '')
    .replace('.gif', '')
  return returnValue;
}

function fileHandler(sprites, root, fileStats, prefix, next) {
  let fullPath = path.join(root, fileStats.name);

  //node-walk only supports filters for directories...
  if (fileStats.name[0] !== '.') {
    fs.readFile(fullPath, (err, imgBuffer) => {
      if (err) throw err;
      let cssClass = generateCssClass(fullPath, prefix);
      try {
        let imgSize = sizeOf(imgBuffer);
        sprites[cssClass] = {
          img: imgBuffer.toString('base64'),
          size: imgSize.width * imgSize.height,
          name: cssClass.substring(1)
        }
      } catch (e) {
        console.log(`Skipping file : ${fullPath}`);
      }
    })
  }
  next();
}

function generateHtmlOutput(sprites) {
  let row = _.template(
    `<tr>
       <td><code><%= cssClass %></code></td>
       <td><img src="data:image/png;base64,<%= val.img %>" /></td>
     </tr>`
  );
  let header = '<!DOCTYPE html><html><table>';
  let style = '<style>td { border: 1px solid #ccc; } table { text-align: center; }</style>';
  let footer = '</table></html>';
  let rows = _.map(sprites, (val, cssClass) => row({ cssClass: cssClass, val: val })).join('');

  return header + style + rows + footer;
}

function endHandler(sprites, outputDir, prefix, fileName, done) {
  let outFilename = fileName;
  if (!outFilename) {
    outFilename = path.join(outputDir, prefix + '-icon-list');
  }
  outFilename = path.join(outputDir, outFilename);
  fs.outputFileSync(`${outFilename}.html`, generateHtmlOutput(sprites));
  fs.outputJsonSync(`${outFilename}.json`, sprites);
  if (done) done();
}

if (require.main === module) {
  buildSpriteList();
}

module.exports = buildSpriteList;
