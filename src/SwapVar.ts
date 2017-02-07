import { CoreHelpers } from './ui/Templates/CoreHelpers';
import _ = require('underscore');

// Webpack output a library target with a temporary name.
// This is to allow end user to put CoveoJsSearch.Dependencie.js before or after the main CoveoJsSearch.js, without breaking
// This code swap the current module to the "real" Coveo variable.


export function swapVar(scope: any) {
  if (window['Coveo'] == undefined) {
    window['Coveo'] = scope;
  } else {
    _.each(_.keys(scope), (k) => {
      window['Coveo'][k] = scope[k];
    });
  }
  CoreHelpers.exportAllHelpersGlobally(window['Coveo']);
  if (window['__extends'] == undefined) {
    var __extends = function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) {
          d[p] = b[p];
        }
      }
      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    window['__extends'] = __extends;
  }
}
