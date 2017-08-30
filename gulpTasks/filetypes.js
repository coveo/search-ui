'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const gulp = require('gulp');
const utilities = require('./buildUtilities');
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser({ async: false});

gulp.task('fileTypes', function (done) {
   gulp.src('./image/svg/filetypes/*.svg')
       .pipe(gulp.dest('./bin/image'));

  readJsonForAllRepositories(function (json) {
    const sass = generateSass(json);
    utilities.ensureDirectory('bin/sass');
    fs.writeFileSync('bin/sass/_GeneratedIconsNew.scss', sass);

    const str = generateStrings(json);
    utilities.ensureDirectory('bin/strings');
    fs.writeFileSync('bin/strings/filetypesNew.json', str);

    done();
  }, './filetypes/*.json');
});

function readJsonForAllRepositories(callback, path) {
  glob(path, function (err, files) {
    const json = {};
    _.each(files, function (file) {
      const data = JSON.parse(fs.readFileSync(file));
      json.objecttype = _.extend(json.objecttype || {}, data.objecttype);
      json.filetype = _.extend(json.filetype || {}, data.filetype);
    });

    callback(json);
  });
}

function generateSass(json) {
  // Be careful to output lowercase object types, since the JS UI helpers do the same,
  // and CSS class names are case sensitive. I do that because I can't expect to
  // match all the time the casing output by the connectors.
  let sass = '';
  let iconClasses = {};

  sass += '@mixin GeneratedIcons() {\n';
  sass += '  .coveo-icon-caption-overlay { display: none; }';

  const defaultIcon = '.coveo-sprites-custom';

  sass += '  &.objecttype {\n';
  sass += '    @extend .coveo-filetype-custom;\n'
  sass += '    display: inline-block;\n'
  sass += generateInnerObjecttype(json, false, iconClasses);
  sass += '  }\n';

  sass += '  &.objecttype.coveo-small {\n';
  sass += '    @extend .coveo-filetype-custom-small;\n'
  sass += '    display: inline-block;\n'
  sass += generateInnerObjecttype(json, true, iconClasses);
  sass += '  }\n';

  sass += '  &.filetype, &.sysfiletype {\n'; // we include the version with a sys prefix for backward compatibility
  sass += '    @extend .coveo-filetype-custom;\n'
  sass += '    display: inline-block;\n'
  sass += generateInnerFiletype(json, false, iconClasses)
  sass += '  }\n';

  sass += '  &.filetype.coveo-small, &.sysfiletype.coveo-small {\n';
  sass += '    @extend .coveo-filetype-custom-small;\n'
  sass += '    display: inline-block;\n'
  sass += generateInnerFiletype(json, true, iconClasses);
  sass += '  }\n';

  sass += '}\n';

  let sassIconClasses = '';
  for (const className in iconClasses) {
    sassIconClasses += `.${className} ${iconClasses[className]};\n`;
  }

  return sassIconClasses + sass;
}
function generateInnerObjecttype(json, small, iconClasses) {
  let ret = '';
  _.each(_.keys(json.objecttype), function (objecttype) {
    const svgName = json.objecttype[objecttype].icon;
    let className = 'coveo-filetype-' + svgName;
    className += small ? '-small' : '';
    let width, height;
    ({width, height} = getSVGSize(svgName, small));
    if (iconClasses[className] == undefined) {
      iconClasses[className] = ` { display: inline-block; width: ${width}px; height: ${height}px; background-size: ${width}px ${height}px; background-image: url(../../image/svg/filetypes/${svgName}.svg); }`;
    }

    ensureImageIsValid(svgName, objecttype);
    // This is a special case that we still need to support
    // Old templates in salesforce are using something like this
    // <div class="coveo-icon objecttype <%-raw.objecttype%> "></div>
    // instead of the template helper : <%= fromFileTypeToIcon() %>
    ret += '    &.' + removeSpace(capitalizeFirstLetter(objecttype)) + " , ";
    ret += '    &.' + objecttype.toLowerCase() +
        `{ @extend .${className};` +
        generateShouldDisplayLabel(json.objecttype[objecttype].shouldDisplayLabel) +
        ' }\n';
  });
  return ret;
}

function generateInnerFiletype(json, small, iconClasses) {
   let ret = '';
  _.each(_.keys(json.filetype), function (filetype) {
    const svgName = json.filetype[filetype].icon;
    let className = 'coveo-filetype-' + svgName;
    className += small ? '-small' : '';
    ensureImageIsValid(svgName, filetype);
    // Be careful to output lowercase filetypes, since the JS UI helpers do the same,
    // and CSS class names are case sensitive. I do that because I can't expect to
    // match all the time the casing output by the connectors.
    let width, height;
    ({width, height} = getSVGSize(svgName,small));
    if (iconClasses[className] == undefined) {
      iconClasses[className] = ` { display: inline-block; width: ${width}px; height: ${height}px; background-size: ${width}px ${height}px; background-image: url(../../image/svg/filetypes/${svgName}.svg); }`;
    }
    ret += ' &.' + removeSpace(filetype.toLowerCase()) +
      `{ @extend .${className};` +
      generateShouldDisplayLabel(json.filetype[filetype].shouldDisplayLabel) +
      '}\n';

  });
  return ret;
}

function getSVGPath(svgName) {
  return `${__dirname}/../image/svg/filetypes/${svgName}.svg`;
}

function getSVGSize(svgName, small) {
  const svgPath = getSVGPath(svgName);
  const svgContent = fs.readFileSync(svgPath);
  let width, height;
  xmlParser.parseString(svgContent, (err, svg) => {
    width = small ? Math.floor(svg.svg.$.width / 2) : svg.svg.$.width;
    height = small ? Math.floor(svg.svg.$.height / 2) : svg.svg.$.height;
  });
  if (isNaN(width) || isNaN(height)) {
    console.warn(`${svgName} has no width or/and height attribute.`);
  }
  return {width: width, height: height}
}

function generateStrings(json) {
  const out = {};

  // Be careful to output lowercase filetypes and objecttypes, since the JS UI
  // helpers do the same, and string lookups are case sensitive. I do that because
  // I can't expect to match all the time the casing output by the connectors.
  _.each(_.keys(json.objecttype), function (objecttype) {
    out[objecttype.toLowerCase()] = json.objecttype[objecttype].captions;
    out['objecttype_' + objecttype.toLowerCase()] = json.objecttype[objecttype].captions;
  });

  _.each(_.keys(json.filetype), function (filetype) {
    out[filetype.toLowerCase()] = json.filetype[filetype].captions;
    out['filetype_' + filetype.toLowerCase()] = json.filetype[filetype].captions;
  });

  return JSON.stringify(out, undefined, ' ');
}

function generateShouldDisplayLabel(shouldDisplayLabel) {
  if (shouldDisplayLabel) {
    return ' .coveo-icon-caption-overlay { display: block; }'
  } else {
    return '';
  }
}

function ensureImageIsValid(svgName, filetype) {
  if (!fs.existsSync(getSVGPath(svgName))) {
    console.warn('WARNING: Icon ' + svgName + ' is referenced by file type ' + filetype + ' but cannot be found!');
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function removeSpace(str) {
  return str.replace(' ', '-');
}
