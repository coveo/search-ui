const SpritesmithPlugin = require('webpack-spritesmith');

module.exports = new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, '../image'),
        glob: '{retina,sprites}/*.png'
      },
      target: {
        image: path.resolve(__dirname, '../bin/image/spritesNew.png'),
        css: [path.resolve(__dirname, '../bin/css/sprites.styl'),
              [path.resolve(__dirname, '../bin/css/allSprites.css'), {
                formatOpts: {
                  cssSelector: function(spriteGroup) {
                  return '.coveo-sprites-' + spriteGroup.name;
                  }
                },
              }]]
      },
      apiOptions: {
        cssImageRef: '../image/spritesNew.png',
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
        targetImage: path.resolve(__dirname, '../bin/image/retinaNew.png'),
        cssImageRef: '../image/retinaNew.png'
      }
    })