const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const gulp = require('gulp');
const utilities = require('./buildUtilities');


gulp.task('fileTypes', [ 'sprites' ], function (done) {
  readJsonForAllRepositories(function (json) {
    var sass = generateSass(json);
    fs.writeFileSync('bin/sass/_GeneratedIconsNew.scss', sass);

    var str = generateStrings(json);
    utilities.ensureDirectory('bin/strings');
    fs.writeFileSync('bin/strings/filetypesNew.json', str);

    done();
  }, './filetypes/*.json');
});

gulp.task('fileTypesLegacy', [ 'spritesLegacy' ], function (done) {
  readJsonForAllRepositories(function (json) {
    var sass = generateSass(json, true);
    fs.writeFileSync('bin/sasslegacy/_GeneratedIcons.scss', sass);

    var str = generateStrings(json);
    utilities.ensureDirectory('bin/strings');
    fs.writeFileSync('bin/strings/filetypes.json', str);

    done();
  }, './breakingchanges/redesign/filetypes/*.json');
});

function readJsonForAllRepositories(callback, path) {
  glob(path, function (err, files) {
    var json = {};
    _.each(files, function (file) {
      var data = JSON.parse(fs.readFileSync(file));
      json.objecttype = _.extend(json.objecttype || {}, data.objecttype);
      json.filetype = _.extend(json.filetype || {}, data.filetype);
    });

    callback(json);
  });
}

function generateSass(json, legacy) {
  // Be careful to output lowercase object types, since the JS UI helpers do the same,
  // and CSS class names are case sensitive. I do that because I can't expect to
  // match all the time the casing output by the connectors.

  if (legacy == undefined) {
    legacy = false;
  }
  var sass = '@mixin GeneratedIcons() {\n';
  sass += '  .coveo-icon-caption-overlay { display: none; }';

  var defaultIcon = legacy ? '.coveo-sprites-fileType-default' : '.coveo-sprites-custom';

  sass += '  &.objecttype {\n';
  sass += '    @extend ' + defaultIcon + ';\n';
  sass += generateInnerObjecttype(json, legacy, false);
  sass += '  }\n';

  if (!legacy) {
    sass += '  &.objecttype.coveo-small {\n';
    sass += '    @extend ' + defaultIcon + '-small;\n';
    sass += generateInnerObjecttype(json, legacy, true);
    sass += '  }\n';
  }

  sass += '  &.filetype, &.sysfiletype {\n'; // we include the version with a sys prefix for backward compatibility
  sass += '    @extend ' + defaultIcon + ';\n';
  sass += generateInnerFiletype(json, legacy, false)
  sass += '  }\n';

  if (!legacy) {
    sass += '  &.filetype.coveo-small, &.sysfiletype.coveo-small {\n';
    sass += '    @extend ' + defaultIcon + '-small;\n';
    sass += generateInnerFiletype(json, legacy, true);
    sass += '  }\n';
  }

  sass += '}\n';

  return sass;
}

function generateInnerObjecttype(json, legacy, small) {
  var ret = '';
  _.each(_.keys(json.objecttype), function (objecttype) {
    ensureImageIsValid(objecttype, json.objecttype[objecttype].icon, legacy);
    // This is a special case that we still need to support
    // Old templates in salesforce are using something like this
    // <div class="coveo-icon objecttype <%-raw.objecttype%> "></div>
    // instead of the template helper : <%= fromFileTypeToIcon() %>
    ret += '    &.' + capitalizeFirstLetter(objecttype) + " , ";
    ret += '    &.' + objecttype.toLowerCase() +
        ' { @extend .coveo-sprites-' + (legacy ? 'fileType-' : '' ) +
        json.objecttype[objecttype].icon + (small ? '-small; ' : '; ') +
        generateShouldDisplayLabel(json.objecttype[objecttype].shouldDisplayLabel) +
        ' }\n';
  });
  return ret;
}

function generateInnerFiletype(json, legacy, small) {
  var ret = '';
  _.each(_.keys(json.filetype), function (filetype) {
    // Be careful to output lowercase filetypes, since the JS UI helpers do the same,
    // and CSS class names are case sensitive. I do that because I can't expect to
    // match all the time the casing output by the connectors.
    ensureImageIsValid(filetype, json.filetype[filetype].icon, legacy);
    ret += '    &.' + filetype.toLowerCase() +
        ' { @extend .coveo-sprites-' + (legacy ? 'fileType-' : '' ) +
        json.filetype[filetype].icon + (small ? '-small; ' : '; ') +
        generateShouldDisplayLabel(json.filetype[filetype].shouldDisplayLabel) +
        '}\n';

  });
  return ret;
}

function generateStrings(json) {
  var out = {};

  // Be careful to output lowercase filetypes and objecttypes, since the JS UI
  // helpers do the same, and string lookups are case sensitive. I do that because
  // I can't expect to match all the time the casing output by the connectors.
  _.each(_.keys(json.objecttype), function (objecttype) {

    out['objecttype_' + objecttype.toLowerCase()] = json.objecttype[objecttype].captions;
  });

  _.each(_.keys(json.filetype), function (filetype) {
    out['filetype_' + filetype.toLowerCase()] = json.filetype[filetype].captions;
  });

  return JSON.stringify(out, undefined, ' ');
}

function generateShouldDisplayLabel(shouldDisplayLabel) {
  if (shouldDisplayLabel) {
    return '    .coveo-icon-caption-overlay { display: block; }'
  } else {
    return '';
  }
}

function ensureImageIsValid(filetype, image, legacy) {
  var path = './image/sprites/' + image.replace('-', '/') + '.png';

  // DO not validate legacy because this pollutes the build console
  // with useless stuff
  if (!legacy) {
    if (!fs.existsSync(path)) {
      console.trace();
      throw ('Icon ' + path + ' is referenced by file type ' + filetype + ' but cannot be found!');
    }
  }


  var retinaPath = './image/retina/' + image.replace('-', '/') + '.png';
  // DO not validate legacy because this pollutes the build console
  // with useless stuff
  if (!legacy) {
    if (!legacy) {
      if (!fs.existsSync(retinaPath)) {
        console.warn('WARNING: Icon ' + path + ' is referenced by file type ' + filetype + ' but cannot be found in Retina sprites!');
      }
    }
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
