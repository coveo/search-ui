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
    if (Utils.isNonEmptyString(objecttype) && !objecttype.match(/^(file|document|ContentVersion)$/i)) {
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
    objecttype = objecttype.toLowerCase();

    const variableValue = `objecttype_${objecttype}`;
    // Most object types have a set of localized strings in the main dictionary
    var localizedString = l(variableValue);

    return {
      'icon': 'coveo-icon objecttype ' + objecttype.replace(' ', '-'),
      caption: localizedString != variableValue ? localizedString : objecttype
    };
  }

  static getFileType(filetype: string): IFileTypeInfo {
    // We must use lowercase filetypes because that's how the CSS classes
    // are generated (they are case sensitive, alas).
    filetype = filetype.toLowerCase();

    // Sometimes, filetype begins with a period (typically means the index has
    // no idea and uses the file extension as a filetype).
    if (filetype[0] == '.') {
      filetype = filetype.substring(1);
    }

    const variableValue = `filetype_${filetype}`;
    // Most filetypes have a set of localized strings in the main dictionary
    let localizedString = l(variableValue);

    return {
      'icon': 'coveo-icon filetype ' + filetype.replace(' ', '-'),
      caption: localizedString != variableValue ? localizedString : filetype
    };
  }

  static getFileTypeCaptions() {
    if (fileTypeCaptions == undefined) {
      fileTypeCaptions = {};
      var strings = String['locales'][String['locale'].toLowerCase()];
      Assert.isNotUndefined(strings);
      _.each(_.keys(strings), function (key) {
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
