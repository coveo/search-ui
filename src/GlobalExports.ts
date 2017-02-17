import * as _ from 'underscore';

export interface IExportedGlobally {
  [moduleName: string]: any;
}

export function exportGlobally(toExportGlobally: IExportedGlobally) {
  if (window['Coveo'] == undefined) {
    window['Coveo'] = {};
  } else {
    _.each(_.keys(toExportGlobally), (key: string) => {
      window['Coveo'][key] = toExportGlobally[key];
    });
  }
}
