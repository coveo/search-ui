const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith');

let cwd = path.resolve(__dirname, '../../image/sprites');

module.exports = new SpritesmithPlugin({
  src: {
    cwd: cwd,
    glob: 'salesforce/**/*.png'
  },

  target: {
    image: path.resolve(__dirname, '../../bin/image/salesforceSprites.png'),
    css: [[path.resolve(__dirname, '../../bin/sass/salesforceSprites.scss'),{
      spritesheetName: 'salesforce',
      format: 'optimized_scss_template',
      formatOpts: {
        functions: false // disables the mixins in the sass stylesheet
      }
    }]]
  },
  apiOptions: {
    cssImageRef: '../image/salesforceSprites.png',
    generateSpriteName: function(spriteImageFullPath) {
      let relative = path.relative(cwd, spriteImageFullPath);
      return relative.split('/').join('-').replace('.png', '').toLowerCase();
    }
  },
  customTemplates: {
    'optimized_scss_template': path.resolve(__dirname, './scss_custom.template.handlebars'),
  }

})