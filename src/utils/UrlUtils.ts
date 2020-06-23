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

  public static getLinkDestination(origin: string, href: string) {
    if (!this.urlIsRelative(href)) {
      return href;
    }
    let currentPosition = this.removeAtEnd(this.getRawUrlParameters(origin), origin);
    if (!href) {
      return currentPosition;
    }
    href.split('/').forEach((urlPart, index) => {
      if (!urlPart && !index) {
        currentPosition = this.getFullHostPath(origin) || '';
      } else if (urlPart === '..') {
        currentPosition = this.removeLastPart(currentPosition);
      } else if (urlPart !== '.') {
        currentPosition += `/${urlPart}`;
      }
    });
    return currentPosition;
  }

  private static urlIsRelative(url: string) {
    const host = this.getFullHostPath(url);
    return !host || !url.match(/[^\/.]\.[^\/.]/);
  }

  private static removeLastPart(url: string) {
    const host = this.getFullHostPath(url);
    return (
      (host || '') +
      this.removeAtStart(host, url)
        .split('/')
        .slice(0, -1)
        .join('/')
    );
  }

  private static getRawUrlParameters(url: string) {
    const match = url.match(/(\?.*|#.*)$/);
    if (!match) {
      return '';
    }
    return match[0];
  }

  private static getFullHostPath(url: string) {
    const match = url.match(/^([^:]+:\/\/)?[^\/]+/);
    if (!match) {
      return null;
    }
    return match[0];
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

        if (!this.isEncoded(value)) {
          return [this.removeProblematicChars(key), Utils.safeEncodeURIComponent(value)].join('=');
        } else {
          return [this.removeProblematicChars(key), value].join('=');
        }
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
    return targetString.substr(0, searchString.length) === searchString;
  }

  private static endsWith(searchString: string, targetString: string) {
    return targetString.substring(targetString.length - searchString.length, targetString.length) === searchString;
  }

  private static removeAtEnd(searchString: string, targetString: string) {
    if (!searchString) {
      return targetString;
    }
    while (this.endsWith(searchString, targetString)) {
      targetString = targetString.slice(0, targetString.length - searchString.length);
    }

    return targetString;
  }

  private static removeAtStart(searchString: string, targetString: string) {
    if (!searchString) {
      return targetString;
    }
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
    if (!this.isEncoded(value)) {
      value = Utils.safeEncodeURIComponent(value);
    }

    return `${key}=${value}`;
  }

  private static removeProblematicChars(value: string) {
    ['?', '/', '#', '='].forEach(problematicChar => {
      value = this.removeAtStart(problematicChar, value);
      value = this.removeAtEnd(problematicChar, value);
    });

    return value;
  }

  private static isEncoded(value: string) {
    return value != decodeURIComponent(value);
  }

  private static isInvalidQueryStringValue(value: any) {
    if (isString(value)) {
      return Utils.isEmptyString(value);
    }

    return Utils.isNullOrUndefined(value);
  }
}
