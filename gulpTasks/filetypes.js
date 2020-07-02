'use strict';

const gulp = require('gulp');
const Promise = require('bluebird');
const glob = Promise.promisify(require('glob'));
const read = Promise.promisify(require('fs').readFile);
const _ = require('underscore');
const xmlParser = Promise.promisify(new require('xml2js').Parser({ async: false }).parseString);
const utilities = require('./buildUtilities');

async function fileTypes() {
  gulp.src('./image/svg/filetypes/*.svg').pipe(gulp.dest('./bin/image'));

  const svgFiles = await glob('./image/svg/filetypes/*.svg');
  const jsonFiles = await glob('./filetypes/*.json');

  const generatedIconsForObjecttypeLarge = await Promise.all(
    jsonFiles.map(file => generateSassExtendsForStandaloneImageVersion(file, 'objecttype', false))
  );
  const generatedIconsForObjecttypeSmall = await Promise.all(
    jsonFiles.map(file => generateSassExtendsForStandaloneImageVersion(file, 'objecttype', true))
  );
  const generatedIconsForFiletypeLarge = await Promise.all(
    jsonFiles.map(file => generateSassExtendsForStandaloneImageVersion(file, 'filetype', false))
  );
  const generatedIconsForFiletypeSmall = await Promise.all(
    jsonFiles.map(file => generateSassExtendsForStandaloneImageVersion(file, 'filetype', true))
  );

  const sass = `
  ${await generateSassForStandaloneImages(svgFiles.map(file => getSvgNameFromFile(file)))}
  @mixin GeneratedIcons() {
    .coveo-icon-caption-overlay { display: none; };
    &.objecttype {
      ${generatedIconsForObjecttypeLarge.join('\n')}
    }
    &.objecttype.coveo-small {
      ${generatedIconsForObjecttypeSmall.join('\n')}
    }
    &.filetype {
      ${generatedIconsForFiletypeLarge.join('\n')}
    }
    &.filetype.coveo-small {
      ${generatedIconsForFiletypeSmall.join('\n')}
    }
  }`;

  const stringsForFileTypesAndObjecttypes = await generateStrings(jsonFiles);

  utilities.ensureDirectory('bin/sass');
  utilities.ensureDirectory('bin/strings');

  require('fs').writeFileSync('bin/sass/_GeneratedIconsNew.scss', sass);
  require('fs').writeFileSync('bin/strings/filetypesNew.json', JSON.stringify(stringsForFileTypesAndObjecttypes));
}

const generateSassForStandaloneImages = async svgFiles => {
  const extractFileSize = smallVersion =>
    svgFiles.map(async fileName => {
      const { width, height } = await getSVGSize(fileName, smallVersion);
      return {
        fileName,
        width,
        height
      };
    });

  const fileWithSizes = await Promise.all(extractFileSize(false));
  const fileWithSizesSmallVersion = await Promise.all(extractFileSize(true));
  const groupedBySameDimension = _.groupBy(fileWithSizes, fileSize => `${fileSize.width}::${fileSize.height}`);
  const groupedBySameDimensionSmallVersion = _.groupBy(fileWithSizesSmallVersion, fileSize => `${fileSize.width}::${fileSize.height}`);

  const generateCssForSizes = (groupToGenerate, smallVersion) => {
    return _.map(groupToGenerate, group => {
      let width, height;
      const cssClasses = _.map(group, valueInGroup => {
        width = valueInGroup.width;
        height = valueInGroup.height;
        return `.${getCssClassNameForSvgName(valueInGroup.fileName, smallVersion)}`;
      }).join(',\n');
      return `${cssClasses} { ${svgTemplateForSize(width, height)} };`;
    }).join('\n');
  };

  const sizes = `
  ${generateCssForSizes(groupedBySameDimension, false)}
  ${generateCssForSizes(groupedBySameDimensionSmallVersion, true)}
  `;

  const backgroundUrl = `${svgFiles.map(svgFile => svgTemplateForUrl(svgFile)).join('\n')}`;

  return `
  ${sizes}
  ${backgroundUrl}  
  `;
};

const generateSassExtendsForStandaloneImageVersion = async (jsonFile, keyForWhichToGenerate, smallVersion) => {
  const fileContent = await read(jsonFile);
  const fileParsed = JSON.parse(fileContent);

  return _.map(fileParsed[keyForWhichToGenerate], (objectDescription, objectKey) => {
    return ` 
    @extend .${getCssClassNameForSvgName('custom', smallVersion)};

    &.${capitalizeAndTrim(objectKey)} , &.${objectKey.toLowerCase()} {
        @extend .${getCssClassNameForSvgName(objectDescription.icon, smallVersion)};
        ${objectDescription.shouldDisplayLabel ? '.coveo-icon-caption-overlay {display: block}' : ''}
      }`;
  }).join('\n');
};

const generateStrings = async jsonFiles => {
  const ret = {};

  const createCaptionsObject = (fileParsed, fileKey) => {
    _.each(fileParsed[fileKey], (objectDescription, objectKey) => {
      ret[`${objectKey.toLowerCase()}`] = objectDescription.captions;
      ret[`${fileKey}_${objectKey.toLowerCase()}`] = objectDescription.captions;
    });
  };

  const stringsForAllFiles = await Promise.all(
    jsonFiles.map(async jsonFile => {
      const fileContent = await read(jsonFile);
      const fileParsed = JSON.parse(fileContent);
      createCaptionsObject(fileParsed, 'filetype');
      createCaptionsObject(fileParsed, 'objecttype');
      return ret;
    })
  );

  return ret;
};

const getCssClassNameForSvgName = (svgName, smallVersion) => {
  return `coveo-filetype-${svgName}${smallVersion ? '-small' : ''}`;
};

const getSVGSize = async (svgName, small) => {
  const svgPath = getSVGPath(svgName);
  const svgContent = await read(svgPath);
  const svg = await xmlParser(svgContent.toString());
  const width = small ? Math.floor(svg.svg.$.width / 2) : svg.svg.$.width;
  const height = small ? Math.floor(svg.svg.$.height / 2) : svg.svg.$.height;
  if (isNaN(width) || isNaN(height)) {
    console.warn(`${svgName} has no width or/and height attribute.`);
  }
  return { width, height };
};

const getSVGPath = svgName => {
  return `${__dirname}/../image/svg/filetypes/${svgName}.svg`;
};

const getSvgNameFromFile = svgFile => {
  return /(([\w-])+)\.svg$/.exec(svgFile)[1];
};

const svgTemplateForSize = (width, height) => {
  return `display: inline-block; width: ${width}px; height: ${height}px; background-size: ${width}px ${height}px;`;
};

const svgTemplateForUrl = svgName => {
  return `.${getCssClassNameForSvgName(svgName, false)}, .${getCssClassNameForSvgName(
    svgName,
    true
  )} {background-image: url(../../image/svg/filetypes/${svgName}.svg)};`;
};

const capitalizeAndTrim = rawValue => {
  return `${rawValue.charAt(0).toUpperCase()}${rawValue.slice(1)}`.replace(' ', '-');
};

module.exports = { fileTypes };
