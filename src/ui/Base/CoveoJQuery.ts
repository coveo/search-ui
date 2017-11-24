import { Initialization } from './Initialization';
import * as _ from 'underscore';

export interface IJQuery {
  fn: any;
}

export var jQueryInstance: IJQuery;

if (!initCoveoJQuery()) {
  // Adding a check in case jQuery was added after the jsSearch
  // Since this event listener is registered before the Coveo.init call, JQuery should always be initiated before the Coveo.init call
  document.addEventListener('DOMContentLoaded', () => {
    initCoveoJQuery();
  });
}

export function initCoveoJQuery() {
  if (!jQueryIsDefined()) {
    return false;
  }

  jQueryInstance = getJQuery();

  if (window['Coveo'] == undefined) {
    window['Coveo'] = {};
  }
  if (window['Coveo']['$'] == undefined) {
    window['Coveo']['$'] = jQueryInstance;
  }

  jQueryInstance.fn.coveo = function(...args: any[]) {
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

  return true;
}

export function jQueryIsDefined(): boolean {
  return jQueryDefinedOnWindow() || jQueryDefinedOnCoveoObject();
}

function jQueryDefinedOnCoveoObject(): boolean {
  return window['Coveo'] != undefined && window['Coveo']['$'] != undefined;
}

function jQueryDefinedOnWindow(): boolean {
  return window['$'] != undefined && window['$'].fn != undefined && window['$'].fn.jquery != undefined;
}

function getJQuery(): IJQuery {
  let jQueryInstance: IJQuery;
  if (window['$']) {
    jQueryInstance = window['$'];
  } else {
    jQueryInstance = window['Coveo']['$'];
  }
  return jQueryInstance;
}
