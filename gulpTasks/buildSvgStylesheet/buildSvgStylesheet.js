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
    let maxWidth = 0;
    result.svg.symbol.forEach((symbol) => {
      const size = getSizeFromViewBox(symbol.$.viewBox);
      result.svg.use.push(buildUseTag(symbol.$.id, size, currentY));
      result.svg.view.push(buildViewTag(symbol.$.id, size, currentY));
      currentY += parseInt(size.height, 10);

      let width = parseInt(size.width, 10); 
      if (width > maxWidth) {
        maxWidth = width;
      }
    });

    let svgWidth = maxWidth.toString(10);
    let svgHeight = currentY.toString(10);
    result.svg.$.viewBox = formatViewBox(svgWidth, svgHeight)
    result.svg.$.width = svgWidth;
    result.svg.$.height = svgHeight;

    let builder = new xml2js.Builder();
    this.push(new File({
      cwd: '',
      base: '',
      path: file.path,
      contents: new Buffer(builder.buildObject(result))
    }));
    cb();
  })

  function getSizeFromViewBox(viewBox) {
    const values = viewBox.split(' ');
    return {
      width: values[2],
      height: values[3]
    }
  }

  function formatViewBox(width, height) {
    return '0 0 ' + width + ' ' + height; 
  }

  function buildUseTag(id, size, currentY) {
    return { $ :
      {
        href: '#' + id,
        width: size.width,
        height: size.height,
        x: 0,
        y: currentY
      }
    }
  }

  function buildViewTag(id, size, currentY) {
    return { $ : {
        id: id + '-view',
        viewBox: '0 ' + currentY + ' ' + size.width + ' ' + size.height
      }
    }
  }
})

