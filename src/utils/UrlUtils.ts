import { isArray, pairs, compact, uniq, rest, first, isString, contains } from 'underscore';
import { Utils } from './Utils';
import { IEndpointCallParameters } from '../rest/EndpointCaller';

export interface IUrlNormalize {
  paths: string[] | string;
  queryAsString?: string[] | string;
  query?: Record<string, any>;
}

export interface IUrlNormalizedParts {
  pathsNormalized: string[];
  queryNormalized: string[];
  path: string;
}

export class UrlUtils {
  public static getUrlParameter(name: string): string {
    return (
      decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')
      ) || null
    );
  }

  public static merge(endpointParameters: IEndpointCallParameters, ...parts: IUrlNormalize[]) {
    parts.forEach(part => {
      const { path, queryNormalized } = UrlUtils.normalizeAsParts(part);

      if (Utils.isNonEmptyString(path)) {
        endpointParameters = { ...endpointParameters, url: path };
      }

      if (Utils.isNonEmptyArray(queryNormalized)) {
        const queryStringExists = Utils.isNonEmptyArray(endpointParameters.queryString);
        const queryString = queryStringExists
          ? Utils.concatWithoutDuplicate(endpointParameters.queryString, queryNormalized)
          : queryNormalized;
        endpointParameters = { ...endpointParameters, queryString };
      }
    });
    return endpointParameters;
  }

  public static normalizeAsString(toNormalize: IUrlNormalize): string {
    const { queryNormalized, path } = this.normalizeAsParts(toNormalize);

    return `${path}${this.addToUrlIfNotEmpty(queryNormalized, '&', '?')}`;
  }

  public static normalizeAsParts(toNormalize: IUrlNormalize): IUrlNormalizedParts {
    const pathsNormalized = this.normalizePaths(toNormalize);
    const queryNormalized = this.normalizeQueryString(toNormalize);

    return {
      pathsNormalized,
      queryNormalized,
      path: this.addToUrlIfNotEmpty(pathsNormalized, '/', UrlUtils.getRelativePathLeadingCharacters(toNormalize))
    };
  }

  private static getRelativePathLeadingCharacters(toNormalize: IUrlNormalize) {
    let leadingRelativeUrlCharacters = '';

    const relativeUrlLeadingCharactersRegex = /^(([\/])+)/;
    const firstPath = first(this.toArray(toNormalize.paths));

    if (firstPath) {
      const match = relativeUrlLeadingCharactersRegex.exec(firstPath);
      if (match) {
        leadingRelativeUrlCharacters = match[0];
      }
    }

    return leadingRelativeUrlCharacters;
  }

  private static normalizePaths(toNormalize: IUrlNormalize) {
    return this.toArray(toNormalize.paths).map(path => {
      if (Utils.isNonEmptyString(path)) {
        return this.removeProblematicChars(path);
      }
      return '';
    });
  }

  private static normalizeQueryString(toNormalize: IUrlNormalize) {
    let queryNormalized: string[] = [];

    if (toNormalize.queryAsString) {
      const cleanedUp = this.toArray(toNormalize.queryAsString).map(query => {
        query = this.removeProblematicChars(query);
        query = this.encodeKeyValuePair(query);
        return query;
      });
      queryNormalized = queryNormalized.concat(cleanedUp);
    }

    if (toNormalize.query) {
      const paired: string[][] = pairs(toNormalize.query);
      const mapped = paired.map(pair => {
        let [key, value] = pair;

        const exceptions = ['pipeline'];
        const isAnException = isString(key) && contains(exceptions, key.toLowerCase());

        if (!isAnException) {
          if (UrlUtils.isInvalidQueryStringValue(value) || UrlUtils.isInvalidQueryStringValue(key)) {
            return '';
          }
        }

        return [this.removeProblematicChars(key), this.decodeThenEncode(value)].join('=');
      });
      queryNormalized = queryNormalized.concat(mapped);
    }

    return uniq(queryNormalized);
  }

  private static addToUrlIfNotEmpty(toAdd: string[], joinWith: string, leadWith: string) {
    if (Utils.isNonEmptyArray(toAdd)) {
      return `${leadWith}${compact(toAdd).join(joinWith)}`;
    }
    return '';
  }

  private static startsWith(searchString: string, targetString: string) {
    return Utils.stringStartsWith(targetString, searchString);
  }

  private static endsWith(searchString: string, targetString: string) {
    return Utils.stringEndsWith(targetString, searchString);
  }

  private static removeAtEnd(searchString: string, targetString: string) {
    while (this.endsWith(searchString, targetString)) {
      targetString = targetString.slice(0, targetString.length - searchString.length);
    }

    return targetString;
  }

  private static removeAtStart(searchString: string, targetString: string) {
    while (this.startsWith(searchString, targetString)) {
      targetString = targetString.slice(searchString.length);
    }
    return targetString;
  }

  private static toArray(parameter: string | string[]): string[] {
    return isArray(parameter) ? parameter : [parameter];
  }

  private static encodeKeyValuePair(pair: string) {
    const split = pair.split('=');
    if (split.length == 0) {
      return pair;
    }

    let key = split[0];
    let value = rest(split, 1).join('');

    if (!key) {
      return pair;
    }
    if (!value) {
      return pair;
    }

    key = this.removeProblematicChars(key);
    value = this.decodeThenEncode(value);

    return `${key}=${value}`;
  }

  private static removeProblematicChars(value: string) {
    ['?', '/', '#', '='].forEach(problematicChar => {
      value = this.removeAtStart(problematicChar, value);
      value = this.removeAtEnd(problematicChar, value);
    });

    return value;
  }

  private static decodeThenEncode(value: string) {
    const decoded = decodeURIComponent(value);
    return Utils.safeEncodeURIComponent(decoded);
  }

  private static isInvalidQueryStringValue(value: any) {
    if (isString(value)) {
      return Utils.isEmptyString(value);
    }

    return Utils.isNullOrUndefined(value);
  }
}
