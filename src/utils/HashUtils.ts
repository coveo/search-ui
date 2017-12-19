import { Assert } from '../misc/Assert';
import { Utils } from '../utils/Utils';
import * as _ from 'underscore';
import { Logger } from '../MiscModules';

export class HashUtils {
  private static DELIMITER = {
    objectStart: '{',
    objectEnd: '}',
    arrayStart: '[',
    arrayEnd: ']',
    objectStartRegExp: '^{',
    objectEndRegExp: '}+$',
    arrayStartRegExp: '^[',
    arrayEndRegExp: ']+$'
  };

  public static getHash(w = window): string {
    Assert.exists(w);

    // window.location.hash returns the DECODED hash on Firefox (it's a well known bug),
    // so any & in values will be already unescaped. This breaks our value splitting.
    // The following trick works on all browsers.
    const ret = '#' + (w.location.href.split('#')[1] || '');
    return HashUtils.getAjaxcrawlableHash(ret);
  }

  public static getValue(key: string, toParse: string): any {
    Assert.isNonEmptyString(key);
    Assert.exists(toParse);
    toParse = HashUtils.getAjaxcrawlableHash(toParse);
    let paramValue = HashUtils.getRawValue(key, toParse);
    if (paramValue != undefined) {
      paramValue = HashUtils.getValueDependingOnType(key, paramValue);
    }
    return paramValue;
  }

  public static encodeValues(values: {}): string {
    const hash: String[] = [];
    _.each(<_.Dictionary<any>>values, (valueToEncode, key, obj?) => {
      let encodedValue = '';
      if (Utils.isNonEmptyArray(valueToEncode)) {
        encodedValue = HashUtils.encodeArray(valueToEncode);
      } else if (_.isObject(valueToEncode) && Utils.isNonEmptyArray(_.keys(valueToEncode))) {
        encodedValue = HashUtils.encodeObject(valueToEncode);
      } else if (!Utils.isNullOrUndefined(valueToEncode)) {
        encodedValue = Utils.safeEncodeURIComponent(valueToEncode.toString());
      }
      if (encodedValue != '') {
        hash.push(key + '=' + encodedValue);
      }
    });

    return hash.join('&');
  }

  private static getAjaxcrawlableHash(hash: string) {
    if (hash[1] != undefined && hash[1] == '!') {
      return hash.substring(0, 1) + hash.substring(2);
    } else {
      return hash;
    }
  }

  private static getRawValue(key: string, toParse: string): string {
    Assert.exists(key);
    Assert.exists(toParse);
    Assert.check(toParse.indexOf('#') == 0 || toParse == '');

    const toParseArray = toParse.substr(1).split('&');
    let paramPos = 0;
    let loop = true;
    let paramValue: string = undefined;
    while (loop) {
      const paramValuePair = toParseArray[paramPos].split('=');
      if (paramValuePair[0] == key) {
        loop = false;
        paramValue = paramValuePair[1];
      } else {
        paramPos++;
        if (paramPos >= toParseArray.length) {
          paramPos = undefined;
          loop = false;
        }
      }
    }
    return paramValue;
  }

  private static getValueDependingOnType(key: string, paramValue: string): any {
    const type = HashUtils.getValueType(key, paramValue);
    let returnValue;

    if (type == 'object') {
      returnValue = HashUtils.decodeObject(paramValue);
    } else if (type == 'array') {
      returnValue = HashUtils.decodeArray(paramValue);
    } else {
      try {
        returnValue = decodeURIComponent(paramValue);
      } catch (e) {
        new Logger(HashUtils).warn('Error while decoding a value from the URL as a standard value', e, key, paramValue);
      }
    }
    return returnValue;
  }

  private static getValueType(key: string, paramValue: string): string {
    if (key == 'q') {
      return 'other';
    } else if (HashUtils.isObject(paramValue)) {
      return 'object';
    } else if (HashUtils.isArray(paramValue)) {
      return 'array';
    } else {
      return 'other';
    }
  }

  private static isArrayStartNotEncoded(value: string) {
    return value.substr(0, 1) == HashUtils.DELIMITER.arrayStart;
  }

  private static isArrayStartEncoded(value: string) {
    return value.indexOf(Utils.safeEncodeURIComponent(HashUtils.DELIMITER.arrayStart)) == 0;
  }

  private static isArrayEndNotEncoded(value: string) {
    return value.substr(value.length - 1);
  }

  private static isArrayEndEncoded(value: string) {
    return (
      value.indexOf(Utils.safeEncodeURIComponent(HashUtils.DELIMITER.arrayEnd)) ==
      value.length - Utils.safeEncodeURIComponent(HashUtils.DELIMITER.arrayEnd).length
    );
  }

  private static isObjectStartNotEncoded(value: string) {
    return value.substr(0, 1) == HashUtils.DELIMITER.objectStart;
  }

  private static isObjectStartEncoded(value: string) {
    return value.indexOf(Utils.safeEncodeURIComponent(HashUtils.DELIMITER.objectStart)) == 0;
  }

  private static isObjectEndNotEncoded(value: string) {
    return value.substr(value.length - 1) == HashUtils.DELIMITER.objectEnd;
  }

  private static isObjectEndEncoded(value: string) {
    return (
      value.indexOf(Utils.safeEncodeURIComponent(HashUtils.DELIMITER.objectEnd)) ==
      value.length - Utils.safeEncodeURIComponent(HashUtils.DELIMITER.objectEnd).length
    );
  }

  private static isObject(value: string) {
    const isObjectStart = HashUtils.isObjectStartNotEncoded(value) || HashUtils.isObjectStartEncoded(value);
    const isObjectEnd = HashUtils.isObjectEndNotEncoded(value) || HashUtils.isObjectEndEncoded(value);
    return isObjectStart && isObjectEnd;
  }

  private static isArray(value: string) {
    const isArrayStart = HashUtils.isArrayStartNotEncoded(value) || HashUtils.isArrayStartEncoded(value);
    const isArrayEnd = HashUtils.isArrayEndNotEncoded(value) || HashUtils.isArrayEndEncoded(value);
    return isArrayStart && isArrayEnd;
  }

  public static encodeArray(array: string[]): string {
    const arrayReturn = _.map(array, value => {
      return Utils.safeEncodeURIComponent(value);
    });
    return HashUtils.DELIMITER.arrayStart + arrayReturn.join(',') + HashUtils.DELIMITER.arrayEnd;
  }

  public static encodeObject(obj: Object): string {
    const retArray = _.map(<_.Dictionary<any>>obj, (val, key?, obj?) => {
      return `"${Utils.safeEncodeURIComponent(key)}":${this.encodeValue(val)}`;
    });
    return HashUtils.DELIMITER.objectStart + retArray.join(' , ') + HashUtils.DELIMITER.objectEnd;
  }

  private static encodeValue(val: any) {
    let encodedValue = '';
    if (_.isArray(val)) {
      encodedValue = HashUtils.encodeArray(val);
    } else if (_.isObject(val)) {
      encodedValue = HashUtils.encodeObject(val);
    } else if (_.isNumber(val) || _.isBoolean(val)) {
      encodedValue = Utils.safeEncodeURIComponent(val.toString());
    } else {
      encodedValue = '"' + Utils.safeEncodeURIComponent(val) + '"';
    }
    return encodedValue;
  }

  private static decodeObject(obj: string): Object {
    if (HashUtils.isObjectStartEncoded(obj) && HashUtils.isObjectEndEncoded(obj)) {
      obj = obj.replace(/encodeURIComponent(HashUtils.Delimiter.objectStart)/, HashUtils.DELIMITER.objectStart);
      obj = obj.replace(Utils.safeEncodeURIComponent(HashUtils.DELIMITER.objectEnd), HashUtils.DELIMITER.objectEnd);
    }
    try {
      const decoded = decodeURIComponent(obj);
      return JSON.parse(decoded);
    } catch (e) {
      new Logger(HashUtils).warn('Error while decoding a value from the URL as an object', e, obj);
      return {};
    }
  }

  private static decodeArray(value: string): any[] {
    if (HashUtils.isArrayStartEncoded(value) && HashUtils.isArrayEndEncoded(value)) {
      value = value.replace(Utils.safeEncodeURIComponent(HashUtils.DELIMITER.arrayStart), HashUtils.DELIMITER.arrayStart);
      value = value.replace(Utils.safeEncodeURIComponent(HashUtils.DELIMITER.arrayEnd), HashUtils.DELIMITER.arrayEnd);
    }
    value = value.substr(1);
    value = value.substr(0, value.length - 1);
    const array = value.split(',');
    return _.chain(array)
      .map(val => {
        try {
          return decodeURIComponent(val);
        } catch (e) {
          new Logger(HashUtils).warn('Error while decoding a value from the URL as an array', e, val, value);
          return null;
        }
      })
      .compact()
      .value();
  }
}
