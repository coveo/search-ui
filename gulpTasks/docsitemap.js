const gulp = require('gulp');

function docsitemap(cb) {
  var SitemapGenerator = require('sitemap-generator');
  const sitePath = 'https://coveo.github.io/search-ui';
  const options = {
    restrictToBasepath: false,
    stripQuerystring: true
  };
  const destinationPath = './docgen/sitemap.xml';

  // Create generator
  console.log('Generating sitemap (this may take a while...');
  var generator = new SitemapGenerator(sitePath, options);

  // register event listeners
  generator.on('fetch', function(status, url) {
    console.log(status + '\n' + url);
  });

  generator.on('clienterror', function(queueError, errorData) {
    console.log(queueError + '\n' + errorData);
  });

  generator.on('done', function(sitemap) {
    require('fs').writeFileSync(destinationPath, sitemap);
    console.log("Sitemap generated at '" + destinationPath + "'.");
  });

  // Start the crawler
  generator.start();
  cb();
}

module.exports = { docsitemap };
