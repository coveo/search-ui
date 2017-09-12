import { IQueryResults } from '../rest/QueryResults';
import { IQueryResult } from '../rest/QueryResult';
import { IQuery } from '../rest/Query';
import { Assert } from '../misc/Assert';
import { Utils } from '../utils/Utils';
import * as _ from 'underscore';

declare let crypto: Crypto;

export class QueryUtils {
  static createGuid(): string {
    let guid: string;
    let success: boolean = false;
    if (typeof crypto != 'undefined' && typeof crypto.getRandomValues != 'undefined') {
      try {
        guid = QueryUtils.generateWithCrypto();
        success = true;
      } catch (e) {
        success = false;
      }
    }

    if (!success) {
      guid = QueryUtils.generateWithRandom();
    }

    return guid;
  }

  // This method is a fallback as it's generate a lot of collisions in Chrome.
  static generateWithRandom(): string {
    // http://stackoverflow.com/a/2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static generateWithCrypto(): string {
    let buf = new Uint16Array(8);
    crypto.getRandomValues(buf);
    let S4 = function(num) {
      let ret = num.toString(16);
      while (ret.length < 4) {
        ret = '0' + ret;
      }
      return ret;
    };
    return S4(buf[0]) + S4(buf[1]) + '-' + S4(buf[2]) + '-' + S4(buf[3]) + '-' + S4(buf[4]) + '-' + S4(buf[5]) + S4(buf[6]) + S4(buf[7]);
  }

  static setStateObjectOnQueryResults(state: any, results: IQueryResults) {
    QueryUtils.setPropertyOnResults(results, 'state', state);
  }

  static setStateObjectOnQueryResult(state: any, result: IQueryResult) {
    QueryUtils.setPropertyOnResult(result, 'state', state);
  }

  static setSearchInterfaceObjectOnQueryResult(searchInterface, result: IQueryResult) {
    QueryUtils.setPropertyOnResult(result, 'searchInterface', searchInterface);
  }

  static setIndexAndUidOnQueryResults(query: IQuery, results: IQueryResults, queryUid: string, pipeline: string, splitTestRun: string) {
    Assert.exists(query);
    Assert.exists(results);
    let index = query.firstResult;
    QueryUtils.setPropertyOnResults(results, 'queryUid', queryUid);
    QueryUtils.setPropertyOnResults(results, 'pipeline', pipeline);
    QueryUtils.setPropertyOnResults(results, 'splitTestRun', splitTestRun);
    QueryUtils.setPropertyOnResults(results, 'index', index, () => ++index);
  }

  static setTermsToHighlightOnQueryResults(query: IQuery, results: IQueryResults) {
    QueryUtils.setPropertyOnResults(results, 'termsToHighlight', results.termsToHighlight);
    QueryUtils.setPropertyOnResults(results, 'phrasesToHighlight', results.phrasesToHighlight);
  }

  static splitFlags(flags: string, delimiter: string = ';') {
    Assert.exists(flags);
    return flags.split(delimiter);
  }

  static isAttachment(result: IQueryResult) {
    return _.contains(QueryUtils.splitFlags(result.flags), 'IsAttachment');
  }

  static containsAttachment(result: IQueryResult) {
    return _.contains(QueryUtils.splitFlags(result.flags), 'ContainsAttachment');
  }

  static hasHTMLVersion(result: IQueryResult) {
    return _.contains(QueryUtils.splitFlags(result.flags), 'HasHtmlVersion');
  }

  static hasThumbnail(result: IQueryResult) {
    return _.contains(QueryUtils.splitFlags(result.flags), 'HasThumbnail');
  }

  static hasExcerpt(result: IQueryResult) {
    return result.excerpt != undefined && result.excerpt != '';
  }

  static getAuthor(result: IQueryResult): string {
    return result.raw['author'];
  }

  static getUriHash(result: IQueryResult): string {
    return result.raw['urihash'];
  }

  static getObjectType(result: IQueryResult): string {
    return result.raw['objecttype'];
  }

  static getCollection(result: IQueryResult): string {
    return result.raw['collection'];
  }

  static getSource(result: IQueryResult): string {
    return result.raw['source'];
  }

  static getLanguage(result: IQueryResult): string {
    return result.raw['language'];
  }

  static getPermanentId(result: IQueryResult): { fieldValue: string; fieldUsed: string } {
    let fieldValue;
    let fieldUsed;
    let permanentId = Utils.getFieldValue(result, 'permanentid');
    if (permanentId) {
      fieldUsed = 'permanentid';
      fieldValue = permanentId;
    } else {
      fieldUsed = 'urihash';
      fieldValue = Utils.getFieldValue(result, 'urihash');
    }
    return {
      fieldValue: fieldValue,
      fieldUsed: fieldUsed
    };
  }

  static quoteAndEscapeIfNeeded(str: string): string {
    Assert.isString(str);
    return QueryUtils.isAtomicString(str) || (QueryUtils.isRangeString(str) || QueryUtils.isRangeWithoutOuterBoundsString(str))
      ? str
      : QueryUtils.quoteAndEscape(str);
  }

  static quoteAndEscape(str: string): string {
    Assert.isString(str);
    return `"${QueryUtils.escapeString(str)}"`;
  }

  static escapeString(str: string): string {
    Assert.isString(str);
    return str.replace(/"/g, ' ');
  }

  static isAtomicString(str: string): boolean {
    Assert.isString(str);
    return /^\d+(\.\d+)?$|^[\d\w]+$/.test(str);
  }

  static isRangeString(str: string): boolean {
    Assert.isString(str);
    return /^\d+(\.\d+)?\.\.\d+(\.\d+)?$|^\d{4}\/\d{2}\/\d{2}@\d{2}:\d{2}:\d{2}\.\.\d{4}\/\d{2}\/\d{2}@\d{2}:\d{2}:\d{2}$/.test(str);
  }

  static isRangeWithoutOuterBoundsString(str: string): boolean {
    Assert.isString(str);
    return /^\d+(\.\d+)?$|^\d{4}\/\d{2}\/\d{2}@\d{2}:\d{2}:\d{2}$/.test(str);
  }

  static buildFieldExpression(field: string, operator: string, values: string[]) {
    Assert.isNonEmptyString(field);
    Assert.stringStartsWith(field, '@');
    Assert.isNonEmptyString(operator);
    Assert.isLargerOrEqualsThan(1, values.length);

    if (values.length == 1) {
      return field + operator + QueryUtils.quoteAndEscapeIfNeeded(values[0]);
    } else {
      return field + operator + '(' + _.map(values, str => QueryUtils.quoteAndEscapeIfNeeded(str)).join(',') + ')';
    }
  }

  static buildFieldNotEqualExpression(field: string, values: string[]) {
    Assert.isNonEmptyString(field);
    Assert.stringStartsWith(field, '@');
    Assert.isLargerOrEqualsThan(1, values.length);

    let filter: string;
    if (values.length == 1) {
      filter = field + '==' + QueryUtils.quoteAndEscapeIfNeeded(values[0]);
    } else {
      filter = field + '==' + '(' + _.map(values, str => QueryUtils.quoteAndEscapeIfNeeded(str)).join(',') + ')';
    }

    return '(NOT ' + filter + ')';
  }

  static mergeQueryString(url: string, queryString: string) {
    let queryStringPosition = url.indexOf('?');
    if (queryStringPosition != -1) {
      url += '&' + queryString;
    } else {
      url += '?' + queryString;
    }
    return url;
  }

  static mergePath(url: string, path: string) {
    let urlSplit = url.split('?');
    return urlSplit[0] + path + '?' + (urlSplit[1] || '');
  }

  public static setPropertyOnResults(results: IQueryResults, property: string, value: any, afterOneLoop?: () => any) {
    _.each(results.results, (result: IQueryResult) => {
      QueryUtils.setPropertyOnResult(result, property, value);
      value = afterOneLoop ? afterOneLoop() : value;
    });
  }

  public static setPropertyOnResult(result: IQueryResult, property: string, value: any) {
    result[property] = value;
    _.each(result.childResults, (child: IQueryResult) => {
      child[property] = value;
    });
    if (!Utils.isNullOrUndefined(result.parentResult)) {
      result.parentResult[property] = value;
    }
  }

  // http://stackoverflow.com/a/11582513
  public static getUrlParameter(name: string): string {
    return (
      decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')
      ) || null
    );
  }

  public static isStratusAgnosticField(fieldToVerify: string, fieldToMatch: string): boolean {
    let checkForSystem = /^(@?)(sys)?(.*)/i;
    let matchFieldToVerify = checkForSystem.exec(fieldToVerify);
    let matchFieldToMatch = checkForSystem.exec(fieldToMatch);
    if (matchFieldToVerify && matchFieldToMatch) {
      return (matchFieldToVerify[1] + matchFieldToVerify[3]).toLowerCase() == (matchFieldToMatch[1] + matchFieldToMatch[3]).toLowerCase();
    }
    return false;
  }
}
