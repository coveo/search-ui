import { IQueryResult } from '../rest/QueryResult';
import _ = require('underscore');

const isCoveoFieldRegex = /^@[a-zA-Z0-9_\.]+$/;

export class Utils {
  static isUndefined(obj: any): boolean {
    return typeof obj == 'undefined';
  }

  static isNull(obj: any): boolean {
    return obj === null;
  }

  static isNullOrUndefined(obj: any): boolean {
    return Utils.isUndefined(obj) || Utils.isNull(obj);
  }

  static exists(obj: any): boolean {
    return !Utils.isNullOrUndefined(obj);
  }

  static toNotNullString(str: string): string {
    return _.isString(str) ? str : '';
  }

  static anyTypeToString(value: any): string {
    return value ? value.toString() : '';
  }

  static isNullOrEmptyString(str: string): boolean {
    return Utils.isNullOrUndefined(str) || !Utils.isNonEmptyString(str);
  }

  static isNonEmptyString(str: string): boolean {
    return _.isString(str) && str !== '';
  }

  static isEmptyString(str: string): boolean {
    return !Utils.isNonEmptyString(str);
  }

  static stringStartsWith(str: string, startWith: string): boolean {
    return str.slice(0, startWith.length) == startWith;
  }

  static isNonEmptyArray(obj: any): boolean {
    return _.isArray(obj) && obj.length > 0;
  }

  static isEmptyArray(obj: any): boolean {
    return !Utils.isNonEmptyArray(obj);
  }

  static isHtmlElement(obj: any): boolean {
    if (window['HTMLElement'] != undefined) {
      return obj instanceof HTMLElement;
    } else { // IE 8 FIX
      return obj && obj.nodeType && obj.nodeType == 1;
    }
  }

  static parseIntIfNotUndefined(str: string): number {
    if (Utils.isNonEmptyString(str)) {
      return parseInt(str, 10);
    } else {
      return undefined;
    }
  }

  static parseFloatIfNotUndefined(str: string): number {
    if (Utils.isNonEmptyString(str)) {
      return parseFloat(str);
    } else {
      return undefined;
    }
  }

  static round(num: number, decimals: number) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  static parseBooleanIfNotUndefined(str: string): boolean {
    if (Utils.isNonEmptyString(str)) {
      switch (str.toLowerCase()) {
        case 'true':
        case '1':
        case 'yes':
          return true;
        case 'false':
        case '0':
        case 'no':
          return false;
        default:
          return undefined;
      }
    } else {
      return undefined;
    }
  }

  static trim(value: string): string {
    if (value == null) {
      return null;
    }
    return value.replace(/^\s+|\s+$/g, '');
  }

  static encodeHTMLEntities(rawStr: string) {
    let ret = [];
    for (let i = rawStr.length - 1; i >= 0; i--) {
      if (/^[a-z0-9]/i.test(rawStr[i])) {
        ret.unshift(rawStr[i]);
      } else {
        ret.unshift(['&#', rawStr.charCodeAt(i), ';'].join(''));
      }
    }
    return ret.join('');
  }

  static decodeHTMLEntities(rawString: string) {
    return rawString.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
  }

  static arrayEqual(array1: any[], array2: any[], sameOrder: boolean = true): boolean {
    if (sameOrder) {
      return _.isEqual(array1, array2);
    } else {
      let arrays = [array1, array2];
      return _.all(arrays, (array: any[]) => {
        return array.length == arrays[0].length && _.difference(array, arrays[0]).length == 0;
      });
    }
  }

  static objectEqual(obj1: Object, obj2: Object): boolean {
    return _.isEqual(obj1, obj2);
  }


  static isCoveoField(field: string): boolean {
    return isCoveoFieldRegex.test(field);
  }

  static escapeRegexCharacter(str: string) {
    let ret = str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    return ret;
  }

  static getCaseInsensitiveProperty(object: {}, name: string): any {
    // First try using a fast case-sensitive lookup
    let value = object[name];

    // Then try a fast case-sensitive lookup with lowercase name
    if (value == null) {
      let lowerCaseName = name.toLowerCase();
      value = object[lowerCaseName];
      // Then try a slow scanning of all the properties
      if (value == null) {
        let matchingKey = _.find(_.keys(object), (key: string) => key.toLowerCase() == lowerCaseName);
        if (matchingKey != null) {
          value = object[matchingKey];
        }
      }
    }
    return value;
  }

  static getFieldValue(result: IQueryResult, name: string): any {
    // Be as forgiving as possible about the field name, since we expect
    // user provided values.
    if (name == null) {
      return undefined;
    }
    name = Utils.trim(name);
    if (name[0] == '@') {
      name = name.substr(1);
    }
    if (name == '') {
      return undefined;
    }

    // At this point the name should be well formed
    if (!Utils.isCoveoField('@' + name)) {
      throw `Not a valid field : ${name}`;
    }
    // Handle namespace field values of the form sf.Foo.Bar
    let parts = name.split('.').reverse();
    let obj = result.raw;
    while (parts.length > 1) {
      obj = Utils.getCaseInsensitiveProperty(obj, parts.pop());
      if (Utils.isUndefined(obj)) {
        return undefined;
      }
    }
    let value = Utils.getCaseInsensitiveProperty(obj, parts[0]);
    // If still nothing, look at the root of the result
    if (value == null) {
      value = Utils.getCaseInsensitiveProperty(result, name);
    }
    return value;
  }

  static throttle(func, wait, options: { leading?: boolean; trailing?: boolean; } = {}, context?, args?) {
    let result;
    let timeout: number = null;
    let previous = 0;
    let later = function () {
      previous = options.leading === false ? 0 : new Date().getTime();
      timeout = null;
      result = func.apply(context, args);
    };
    return function () {
      let now = new Date().getTime();
      if (!previous && options.leading === false) {
        previous = now;
      }
      let remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  static extendDeep(target, src): {} {
    if (!target) {
      target = {};
    }
    let isArray = _.isArray(src);
    let toReturn = isArray && [] || {};
    if (isArray) {
      target = target || [];
      toReturn = toReturn['concat'](target);
      _.each(src, (e, i, obj) => {
        if (typeof target[i] === 'undefined') {
          toReturn[i] = <any>e;
        } else if (typeof e === 'object') {
          toReturn[i] = Utils.extendDeep(target[i], e);
        } else {
          if (target.indexOf(e) === -1) {
            toReturn['push'](e);
          }
        }
      });
    } else {
      if (target && typeof target === 'object') {
        _.each(_.keys(target), (key) => {
          toReturn[key] = target[key];
        });
      }
      _.each(_.keys(src), (key) => {
        if (typeof src[key] !== 'object' || !src[key]) {
          toReturn[key] = src[key];
        } else {
          if (!target[key]) {
            toReturn[key] = src[key];
          } else {
            toReturn[key] = Utils.extendDeep(target[key], src[key]);
          }
        }
      });
    }
    return toReturn;
  }

  static getQueryStringValue(key, queryString = window.location.search) {
    return queryString.replace(new RegExp('^(?:.*[&\\?]' + key.replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1');
  }

  static isValidUrl(str: string): boolean {
    let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(str);
  }

  static debounce(func: Function, wait: number) {
    let timeout: number;
    let stackTraceTimeout: number;
    return function (...args: any[]) {
      if (timeout == null) {
        timeout = setTimeout(() => {
          timeout = null;
        }, wait);
        stackTraceTimeout = setTimeout(() => {
          func.apply(this, args);
          stackTraceTimeout = null;
        });
      } else if (stackTraceTimeout == null) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
          timeout = null;
        }, wait);
      }
    };
  }

  static readCookie(name: string) {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  static toDashCase(camelCased: string) {
    return camelCased.replace(/([a-z][A-Z])/g, (g) => g[0] + '-' + g[1].toLowerCase());
  }

  // Based on http://stackoverflow.com/a/8412989
  static parseXml(xml: string): XMLDocument {
    if (typeof DOMParser != 'undefined') {
      return (new DOMParser()).parseFromString(xml, 'text/xml');
    } else if (typeof ActiveXObject != 'undefined' && new ActiveXObject('Microsoft.XMLDOM')) {
      var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
      xmlDoc.async = 'false';
      xmlDoc.loadXML(xml);
      return xmlDoc;
    } else {
      throw new Error('No XML parser found');
    }
  }

  static copyObject<T>(target: T, src: T) {
    _.each(_.keys(src), key => {
      if (typeof src[key] !== 'object' || !src[key]) {
        target[key] = src[key];
      } else if (!target[key]) {
        target[key] = src[key];
      } else {
        this.copyObject(target[key], src[key]);
      }
    });
  }

  static copyObjectAttributes<T>(target: T, src: T, attributes: string[]) {
    _.each(_.keys(src), key => {
      if (_.contains(attributes, key)) {
        if (typeof src[key] !== 'object' || !src[key]) {
          target[key] = src[key];
        } else if (!target[key]) {
          target[key] = src[key];
        } else {
          this.copyObject(target[key], src[key]);
        }
      }
    });
  }
}
