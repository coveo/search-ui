import { CoreHelpers } from './ui/Templates/CoreHelpers';
import * as _ from 'underscore';

// Webpack output a library target with a temporary name.
// It does not take care of merging the namespace if the global variable already exists.
// If another piece of code in the page use the Coveo namespace (eg: extension), then they get overwritten
// This code swap the current module to the "real" Coveo variable, without overwriting the whole global var.

export function swapVar(scope: any) {
  if (window['Coveo'] == undefined) {
    window['Coveo'] = scope;
  } else {
    _.each(_.keys(scope), k => {
      window['Coveo'][k] = scope[k];
    });
  }
  CoreHelpers.exportAllHelpersGlobally(window['Coveo']);
  if (window['__extends'] == undefined) {
    var __extends = function(d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) {
          d[p] = b[p];
        }
      }
      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
    window['__extends'] = __extends;
  }
}
