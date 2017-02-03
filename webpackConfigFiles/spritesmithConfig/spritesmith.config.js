const SpritesmithPlugin = require('webpack-spritesmith');
const path = require('path');

module.exports = new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, '../../image'),
        glob: '{retina,sprites}/*.png'
      },
      target: {
        image: path.resolve(__dirname, '../../bin/image/spritesNew.png'),
        css: [[path.resolve(__dirname, '../../bin/sass/sprites.scss'),{
          format: 'optimized_scss_template'
        }]]
      },
      apiOptions: {
        cssImageRef: '../image/spritesNew.png'
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
        targetImage: path.resolve(__dirname, '../../bin/image/retinaNew.png'),
        cssImageRef: '../image/retinaNew.png'
      },
      spritesmithOptions: {
        padding: 1  
      },
      customTemplates: {
        'optimized_scss_template': path.resolve(__dirname, './scss_custom.template.handlebars'),
        'optimized_scss_template_retina': path.resolve(__dirname, './scss_retina_custom.template.handlebars')
      }
    })