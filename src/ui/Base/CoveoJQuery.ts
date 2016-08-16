import {Initialization, IInitializationParameters} from './Initialization';
import {IComponentDefinition} from './Component';

interface IWindow {
  $: any;
}

// This class is essentially only there for legacy reasons : If there is any code in the wild that called this directly,
// we don't want this to break.
export class CoveoJQuery {
  public static automaticallyCreateComponentsInside(element: HTMLElement, initParameters: IInitializationParameters, ignore?: string[]) {
    return Initialization.automaticallyCreateComponentsInside(element, initParameters, ignore);
  }

  public static registerAutoCreateComponent(cmp: IComponentDefinition) {
    return Initialization.registerAutoCreateComponent(cmp);
  }
}

export var jQueryInstance: JQuery;

if (jQueryIsDefined()) {
  initCoveoJQuery();
} else {
  // Adding a check in case jQuery was added after the jsSearch
  document.addEventListener('DOMContentLoaded', () => {
    if (jQueryIsDefined()) {
      initCoveoJQuery();
    }
  })
}

function initCoveoJQuery() {
  jQueryInstance = window['$'];
  if (window['Coveo'] == undefined) {
    window['Coveo'] = {};
  }
  if (window['Coveo']['$'] == undefined) {
    window['Coveo']['$'] = jQueryInstance;
  }
  window['$'].fn.coveo = function (...args: any[]) {
    var returnValue: any;
    this.each((index: number, element: HTMLElement) => {
      var returnValueForThisElement: any;
      if (_.isString(args[0])) {
        var token = <string>args[0];
        returnValueForThisElement = Initialization.dispatchNamedMethodCallOrComponentCreation(token, element, args.slice(1));
      } else {
        // Invoking with no method name is a shortcut for the 'get' method (from Component).
        returnValueForThisElement = Initialization.dispatchNamedMethodCall('get', element, args);
      }

      // Keep only the first return value we encounter
      returnValue = returnValue || returnValueForThisElement;
    });
    return returnValue;
  }
}

export function jQueryIsDefined(): boolean {
  return window['$'] != undefined && window['$'].fn != undefined && window['$'].fn.jquery != undefined;
}
