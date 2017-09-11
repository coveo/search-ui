'use strict';

const TestServer = require('karma').Server;
const _ = require('underscore');
const path = require('path');
const Promise = require('bluebird');
const fs = require('fs');
const colors = require('colors');
const readDir = Promise.promisify(fs.readdir);
const writeFile = Promise.promisify(fs.writeFile);
const ChromiumRevision = require('puppeteer/package.json').puppeteer.chromium_revision;
const Downloader = require('puppeteer/utils/ChromiumDownloader');
const revisionInfo = Downloader.revisionInfo(Downloader.currentPlatform(), ChromiumRevision);

process.env.CHROME_BIN = revisionInfo.executablePath;

const filesToSkip = [
  'CoveoJsSearch.Lazy.js',
  'CoveoJsSearch.Dependencies.js',
  'CoveoJsSearch.js',
  'Checkbox.js',
  'DatePicker.js',
  'Dropdown.js',
  'FormGroup.js',
  'MultiSelect.js',
  'NumericSpinner.js',
  'RadioButton.js',
  'TextInput.js'
];

const exceptions = {
  'Backdrop.js': {
    arrayOfComponents: ['ResultLink', 'YouTubeThumbnail', 'Backdrop']
  },
  'Badge.js': {
    arrayOfComponents: ['FieldValue', 'Badge']
  },
  'FacetRange.js': {
    arrayOfComponents: ['Facet', 'FacetRange']
  },
  'FieldTable.js': {
    arrayOfComponents: ['FieldValue', 'FieldTable']
  },
  'FoldingForThread.js': {
    arrayOfComponents: ['Folding', 'FoldingForThread']
  },
  'HierarchicalFacet.js': {
    arrayOfComponents: ['Facet', 'HierarchicalFacet']
  },
  'Omnibox.js': {
    arrayOfComponents: ['Querybox', 'Omnibox']
  },
  'OmniboxResultList.js': {
    arrayOfComponents: ['ResultList', 'OmniboxResultList']
  },
  'Quickview.js': {
    arrayOfComponents: ['QuickviewDocument', 'Quickview']
  },
  'Recommendation.js': {
    arrayOfComponents: ['RecommendationQuery', 'Recommendation']
  },
  'Searchbox.js': {
    arrayOfComponents: ['Querybox', 'Omnibox', 'SearchButton', 'Searchbox']
  },
  'Thumbnail.js': {
    arrayOfComponents: ['ResultLink', 'Icon', 'Thumbnail']
  },
  'YouTubeThumbnail.js': {
    arrayOfComponents: ['ResultLink', 'YouTubeThumbnail']
  },
  'PrintableUri.js': {
    arrayOfComponents: ['ResultLink', 'PrintableUri']
  }
};

const testTmpl = `'use strict';
describe('<%- componentName %>', function () {
  it('should load only the needed dependencies', function (done) {
    Coveo.LazyInitialization.getLazyRegisteredComponent('<%- componentName %>').then(function () {
      expect(Coveo.Initialization.getListOfLoadedComponents().length).toBe(<%- numberOfExpectedComponents %>);
      expect(Coveo.Initialization.getListOfLoadedComponents()).toEqual(<%= JSON.stringify(arrayOfComponents) %>);
      done();
    }).catch(function () {
      fail('Error');
      done();
    });
  });
});`;

const getAllComponentsFilesToGenerate = () => {
  return readDir(path.resolve('bin/js')).then(files => {
    return _.filter(files, f => {
      return f.indexOf('.map') == -1 && f.indexOf('.min') == -1 && !_.contains(filesToSkip, f) && f.indexOf('.js') != -1;
    });
  });
};

const generateTestFiles = () => {
  if (!fs.existsSync(path.resolve('chunkTesters/gen'))) {
    fs.mkdirSync(path.resolve('chunkTesters/gen'));
  }
  return getAllComponentsFilesToGenerate().then(filesToGenerate => {
    const toWrite = _.map(filesToGenerate, f => {
      const componentName = /([a-zA-Z]+)\.js/.exec(f)[1];
      let tmplData = {
        componentName: componentName,
        numberOfExpectedComponents: 1,
        arrayOfComponents: [componentName]
      };
      const exception = exceptions[f];
      if (exception != null) {
        if (exception.arrayOfComponents) {
          tmplData.numberOfExpectedComponents = exception.arrayOfComponents.length;
          tmplData.arrayOfComponents = exception.arrayOfComponents;
        }
      }
      const tmpl = _.template(testTmpl)(tmplData);
      return writeFile(path.resolve(`chunkTesters/gen/${f}`), tmpl);
    });
    return Promise.all(toWrite);
  });
};

const executeTests = () => {
  let port = 9000;
  return getAllComponentsFilesToGenerate().then(files => {
    const testsToExecute = _.map(files, fileToExecute => {
      return () => {
        port++;
        return new Promise((resolve, reject) => {
          new TestServer(
            {
              files: [
                {
                  pattern: path.resolve(`node_modules/es6-promise/dist/es6-promise.auto.js`)
                },
                {
                  pattern: path.resolve(`node_modules/phantomjs-polyfill/bind-polyfill.js`)
                },
                {
                  pattern: path.resolve(`bin/js/CoveoJsSearch.Lazy.js`)
                },
                {
                  pattern: path.resolve(`bin/js/${fileToExecute}`)
                },
                {
                  pattern: path.resolve(`chunkTesters/gen/${fileToExecute}`)
                }
              ],
              browsers: ['ChromeHeadless'],
              frameworks: ['jasmine'],
              singleRun: true,
              reporters: ['spec'],
              port: port
            },
            exitCode => {
              if (exitCode) {
                reject(exitCode);
              } else {
                resolve('Success');
              }
            }
          ).start();
        });
      };
    });

    return Promise.mapSeries(testsToExecute, aSingleTest => {
      return aSingleTest();
    });
  });
};

generateTestFiles()
  .then(() => executeTests())
  .then(testExecutionsReport => {
    console.log(`\n\n*****************************`.white.bold);
    console.log(`!!! ${testExecutionsReport.length} components tested successfully !!!`.blue.bgGreen);
    console.log(`*****************************\n\n`.white.bold);
  });
