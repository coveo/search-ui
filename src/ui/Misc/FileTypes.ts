import { IQueryResult } from '../../rest/QueryResult';
import { Utils } from '../../utils/Utils';
import { l } from '../../strings/Strings';
import { Assert } from '../../misc/Assert';
import * as _ from 'underscore';

// On-demand mapping of file types to captions. Used by facets, but I don't
// really like this. Maybe a dedicated filetype facet would be better? Hmm...
let fileTypeCaptions: { [id: string]: string };

export interface IFileTypeInfo {
  icon: string;
  caption: string;
}

export class FileTypes {
  static get(result: IQueryResult): IFileTypeInfo {
    var objecttype = <string>Utils.getFieldValue(result, 'objecttype');
    var filetype = <string>Utils.getFieldValue(result, 'filetype');

    // When @objecttype is File, Document, or ContentVersion we fallback on @filetype for icons and such
    if (Utils.isNonEmptyString(objecttype) && !objecttype.match(/^(file|document|contentversion)$/i)) {
      return FileTypes.getObjectType(objecttype);
    } else if (Utils.isNonEmptyString(filetype)) {
      return FileTypes.getFileType(filetype);
    } else {
      return {
        // This will render a default icon. Really it should not happen.
        icon: 'coveo-icon filetype',
        caption: l('Unknown')
      };
    }
  }

  static getObjectType(objecttype: string): IFileTypeInfo {
    // We must use lowercase filetypes because that's how the CSS classes
    // are generated (they are case sensitive, alas).
    const loweredCaseObjecttype = objecttype.toLowerCase();

    const variableValue = `objecttype_${loweredCaseObjecttype}`;
    // Most object types have a set of localized strings in the main dictionary
    let localizedString = l(variableValue);
    // Some strings are sent as `objecttype_[...]` to specify a dictionary to use. If there's no match, try using
    // the main dictionary by using the original value.
    if (localizedString.toLowerCase() == variableValue.toLowerCase()) {
      localizedString = l(objecttype);
    }
    return {
      icon: 'coveo-icon objecttype ' + loweredCaseObjecttype.replace(' ', '-'),
      caption: localizedString
    };
  }

  static getFileType(filetype: string): IFileTypeInfo {
    // We must use lowercase filetypes because that's how the CSS classes
    // are generated (they are case sensitive, alas).
    let loweredCaseFiletype = filetype.toLowerCase();

    // Sometimes, filetype begins with a period (typically means the index has
    // no idea and uses the file extension as a filetype).
    if (loweredCaseFiletype[0] == '.') {
      loweredCaseFiletype = loweredCaseFiletype.substring(1);
    }

    const variableValue = `filetype_${loweredCaseFiletype}`;
    // Most filetypes have a set of localized strings in the main dictionary
    let localizedString = l(variableValue);
    if (localizedString.toLowerCase() == variableValue.toLowerCase()) {
      // Some strings are sent as `filetype_[...]` to specify a dictionary to use. If there's no match, try using
      // The main dictionary by using the original value.
      localizedString = l(filetype);
    }
    return {
      icon: 'coveo-icon filetype ' + loweredCaseFiletype.replace(' ', '-'),
      caption: localizedString
    };
  }

  static getFileTypeCaptions() {
    if (fileTypeCaptions == undefined) {
      fileTypeCaptions = {};
      var strings = String['locales'][String['locale'].toLowerCase()];
      Assert.isNotUndefined(strings);
      _.each(_.keys(strings), function(key) {
        if (key.indexOf('filetype_') == 0) {
          fileTypeCaptions[key.substr('filetype_'.length)] = key.toLocaleString();
        } else if (key.indexOf('objecttype_') == 0) {
          fileTypeCaptions[key.substr('objecttype_'.length)] = key.toLocaleString();
        }
      });
    }

    return fileTypeCaptions;
  }
}
