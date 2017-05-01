import * as _ from 'underscore';
import { IComponentDefinition } from './ui/Base/Component';
import { Logger } from './misc/Logger';
import { Initialization } from './ui/Base/Initialization';

export interface IExportedGlobally {
  [moduleName: string]: any;
}

export function exportGlobally(toExportGlobally: IExportedGlobally) {
  if (window['Coveo'] == undefined) {
    window['Coveo'] = {};
  }
  _.each(_.keys(toExportGlobally), (key: string) => {
    if (window['Coveo'][key] == null) {
      window['Coveo'][key] = toExportGlobally[key];
    }
  });
}

export function lazyExport(component: IComponentDefinition, promiseResolve: Function) {
  if (component.doExport) {
    component.doExport();
  } else {
    new Logger(this).error(`Component ${component} has no export function !`);
  }
  Initialization.registerAutoCreateComponent(component);
  promiseResolve(component);
}

export function lazyExportModule(mod: any, promiseResolve: Function) {
  if (mod.doExport) {
    mod.doExport();
  }
  promiseResolve(mod);
}
