import {Initialization, IInitializationParameters} from './Initialization';

interface IWindow {
  $: any;
}

// This class is essentially only there for legacy reasons : If there is any code in the wild that called this directly,
// we don't want this to break.
export class CoveoJQuery {
  public static automaticallyCreateComponentsInside(element: HTMLElement, initParameters: IInitializationParameters, ignore?: string[]) {
    return Initialization.automaticallyCreateComponentsInside(element, initParameters, ignore);
  }
}

if (window['$'] != undefined && window['$'].fn != undefined) {
  window['$'].fn.coveo = function(...args: any[]) {
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
