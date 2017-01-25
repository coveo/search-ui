const SpritesmithPlugin = require('webpack-spritesmith');
const path = require('path');

module.exports = new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, '../image'),
        glob: '{retina,sprites}/*.png'
      },
      target: {
        image: path.resolve(__dirname, '../bin/image/spritesNew1.png'),
        css: [path.resolve(__dirname, '../bin/sass/sprites.scss'),
              [path.resolve(__dirname, '../bin/css/allSprites.scss'), {
                format: 'css',
                formatOpts: {
                  cssSelector: function(spriteGroup) {
                  return '.coveo-sprites-' + spriteGroup.name;
                  }
                },
              }]]
      },
      apiOptions: {
        cssImageRef: '../image/spritesNew1.png',
      },
      retina: {
        classifier: function(spritePath) {
          var normalName;
          var retinaName;
          var isRetina = spritePath.indexOf('retina') != -1;
          if (isRetina) {
            normalName = spritePath.replace('retina', 'sprites');
            retinaName = spritePath;
          } else {
            normalName = spritePath;
            retinaName = spritePath.replace('sprites', 'retina');
          }

          var spriteDescription = {
            type: isRetina ? 'retina' : 'normal',
            normalName: normalName,
            retinaName: retinaName
          }

          return spriteDescription;
        },
        targetImage: path.resolve(__dirname, '../bin/image/retinaNew1.png'),
        cssImageRef: '../image/retinaNew1.png'
      }
    })