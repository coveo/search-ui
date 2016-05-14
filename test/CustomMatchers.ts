/// <reference path="Test.ts" />


module Coveo {
  export function registerCustomMatcher() {
    var customMatcher: jasmine.CustomMatcherFactories = {
      eventHandlerToHaveBeenCalledWith: function (util, customEqualityTesters) {

        return {
          compare: function (actual, expected) {
            var args = Array.prototype.slice.call(arguments, 0),
                actual = args[0],
                expectedArgs = args.slice(1),
                result = {pass: false, message: ''};
            if (!actual.calls.any()) {
              result.message = 'Expected spy ' + actual.and.identity() + ' to be called, but was never called'
              return result;
            }
            var found = _.chain(actual.calls.allArgs())
                .flatten()
                .pluck('detail')
                .findWhere(expected)
                .value();

            if (found) {
              result.pass = true;
              result.message = 'Expected spy ' + actual.and.identity() + ' to not have been called with ' + JSON.stringify(expected) + ' but it was';
            } else {
              result.message = 'Expected spy ' + actual.and.identity() + ' to have been called with ' + JSON.stringify(expected) + ' but it was called with ' + JSON.stringify(actual.calls.allArgs()[0][0].detail);
            }

            return result;
          }
        }
      },
      toHaveBeenCalledTimes: function (util, customEqualityTesters) {
        return {
          compare: function (actual, expected) {

            var args = Array.prototype.slice.call(arguments, 0),
                result = {pass: false, message : undefined};

            if (!expected) {
              throw new Error('Expected times failed is required as an argument.');
            }

            actual = args[0];
            var calls = actual.calls.count();
            var timesMessage = expected === 1 ? 'once' : expected + ' times';
            result.pass = calls === expected;
            result.message = result.pass ?
            'Expected spy ' + actual.and.identity() + ' not to have been called ' + timesMessage + '. It was called ' + calls + ' times.' :
            'Expected spy ' + actual.and.identity() + ' to have been called ' + timesMessage + '. It was called ' + calls + ' times.';
            return result;
          }
        };
      }
    }
    jasmine.addMatchers(customMatcher);
  }
}

declare module jasmine {
  import GenericParam = Coveo.IStringMap;
  interface Matchers {
    eventHandlerToHaveBeenCalledWith(data: any);
  }

  interface IAjax {
    install: ()=> void;
    uninstall: ()=> void;
    requests: IAjaxRequests;
  }

  interface IAjaxRequests {
    at: (idx: number)=> IFakeXMLHttpRequest;
    count: ()=> number;
    filter: (urlToMatch: string)=> IFakeXMLHttpRequest[];
    first: ()=> IFakeXMLHttpRequest;
    mostRecent: ()=> IFakeXMLHttpRequest;
    reset: ()=> void;
    track: (request: IFakeXMLHttpRequest) => void;
  }

  interface IFakeXMLHttpRequest {
    method: string;
    onreadystatechange: (ev) => void;
    overrideMimeType: string;
    params: string;
    password: string;
    username: string;
    readyState: number;
    requestHeaders: Coveo.IStringMap<any>;
    responseType: string;
    url: string;
    withCredentials: boolean;
    respondWith: (data: any)=> void;
  }

  var Ajax: IAjax;
}
