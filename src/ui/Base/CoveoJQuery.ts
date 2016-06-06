import {Initialization} from './Initialization';

interface IWindow {
  $: any;
}

if (window['$'] != undefined && window['$'].fn != undefined) {
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
