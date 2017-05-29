const xml2js = require('xml2js');
const through = require('through2');
const File = require('gulp-util').File;
const util = require('util');
const fs = require('fs');

module.exports = through.obj(function (file, enc, cb) {
  const sizeMap = JSON.parse(fs.readFileSync('gulpTasks/buildSvgStylesheet/iconSizes.json'));
  let currentY = 0;

  xml2js.parseString(file.contents, (err, result) => {
    result.svg.use = [];
    result.svg.view = [];
    result.svg.symbol.forEach((symbol) => {
      const size = getSizeFromId(symbol.$.id);
      symbol.$.viewBox = formatViewBox(size);
      result.svg.use.push(buildUseTag(symbol.$.id, size, currentY));
      result.svg.view.push(buildViewTag(symbol.$.id, size, currentY));
      currentY += parseInt(size.height, 10);
    });

    let builder = new xml2js.Builder();
    this.push(new File({
      cwd: '',
      base: '',
      path: file.path,
      contents: new Buffer(builder.buildObject(result))
    }));
    cb();
  })

  function getSizeFromId(id) {
    if (sizeMap.hasOwnProperty(id)) {
      return sizeMap[id];
    } else {
      console.error('svg icon with id ' + id + ' could not be found in the size map');
    }
  }

  function formatViewBox(size) {
    return '0 0 ' + size.width + ' ' + size.height; 
  }

  function buildUseTag(id, size, currentY) {
    return { $ :
      {
        href: '#' + id,
        width: size.width.toString(10),
        height: size.height.toString(10),
        x: 0,
        y: currentY
      }
    }
  }

  function buildViewTag(id, size, currentY) {
    return { $ : {
        id: id + '-view',
        viewbox: '0 ' + currentY + ' ' + size.width + ' ' + size.height
      }
    }
  }
})

