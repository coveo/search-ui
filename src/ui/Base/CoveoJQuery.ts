import {Initialization} from './Initialization';

interface IWindow {
  $: any;
}

export var jQueryInstance: JQueryStatic;

if (jQueryIsDefined()) {
  initCoveoJQuery();
} else {
  // Adding a check in case jQuery was added after the jsSearch
  // Since this event listener is registered before the Coveo.init call, JQuery should always be initiated before the Coveo.init call  
  document.addEventListener('DOMContentLoaded', () => {
    if (jQueryIsDefined()) {
      initCoveoJQuery();
    }
  });
}

export function initCoveoJQuery() {
  if (window['$']) {
    jQueryInstance = window['$']
  } else {
    jQueryInstance = window['Coveo']['$']
  }

  if (window['Coveo'] == undefined) {
    window['Coveo'] = {};
  }
  if (window['Coveo']['$'] == undefined) {
    window['Coveo']['$'] = jQueryInstance;
  }
  jQueryInstance.fn.coveo = function (...args: any[]) {
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
  };
}

export function jQueryIsDefined(): boolean {
  return window['$'] != undefined && window['$'].fn != undefined && window['$'].fn.jquery != undefined || window['Coveo'] != undefined && window['Coveo']['$'] != undefined;
}
