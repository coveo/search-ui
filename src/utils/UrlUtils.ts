import { isArray, pairs, Dictionary, compact } from 'underscore';
import { Utils } from './Utils';

export interface IUrlNormalize {
  paths: string[] | string;
  queryAsString?: string[] | string;
  hashAsString?: string[] | string;
  query?: Dictionary<string>;
  hash?: Dictionary<string>;
}

export class UrlUtils {
  public static getUrlParameter(name: string): string {
    return (
      decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')
      ) || null
    );
  }

  public static normalizeAsString(toNormalize: IUrlNormalize): string {
    const { queryNormalized, hashNormalized, path } = this.normalizeAsParts(toNormalize);

    return `${path}${this.addToUrlIfNotEmpty(queryNormalized, '&', '?')}${this.addToUrlIfNotEmpty(hashNormalized, '&', '#')}`;
  }

  public static normalizeAsParts(toNormalize: IUrlNormalize) {
    const pathsNormalized = this.normalizePaths(toNormalize);
    const queryNormalized = this.normalizeQueryString(toNormalize);
    const hashNormalized = this.normalizeHash(toNormalize);

    return {
      pathsNormalized,
      queryNormalized,
      hashNormalized,
      path: this.addToUrlIfNotEmpty(pathsNormalized, '/', '')
    };
  }

  private static normalizePaths(toNormalize: IUrlNormalize) {
    return this.toArray(toNormalize.paths).map(path => {
      if (Utils.isNonEmptyString(path)) {
        let treatedPath = this.removeAtEnd('/', path);
        treatedPath = this.removeAtStart('/', treatedPath);
        return treatedPath;
      }
      return '';
    });
  }

  private static normalizeQueryString(toNormalize: IUrlNormalize) {
    let queryNormalized: string[] = [];

    if (toNormalize.queryAsString) {
      queryNormalized = queryNormalized.concat(
        this.toArray(toNormalize.queryAsString).map(query => {
          ['?', '&'].forEach(problematicChar => {
            query = this.removeAtStart(problematicChar, query);
            query = this.removeAtEnd(problematicChar, query);
          });
          return query;
        })
      );
    }

    if (toNormalize.query) {
      const paired: string[][] = pairs(toNormalize.query);
      queryNormalized = queryNormalized.concat(
        paired.map(pair => {
          const [key, value] = pair;
          if (!Utils.isNullOrUndefined(value)) {
            return [key, Utils.safeEncodeURIComponent(value)].join('=');
          }
          return '';
        })
      );
    }

    return queryNormalized;
  }

  private static normalizeHash(toNormalize: IUrlNormalize) {
    let hashNormalized: string[] = [];

    if (toNormalize.hashAsString) {
      hashNormalized = hashNormalized.concat(
        this.toArray(toNormalize.hashAsString).map(hash => {
          ['#', '&'].forEach(problematicChar => {
            hash = this.removeAtStart(problematicChar, hash);
            hash = this.removeAtEnd(problematicChar, hash);
          });
          return hash;
        })
      );
    }

    if (toNormalize.hash) {
      const paired: string[][] = pairs(toNormalize.hash);
      hashNormalized = hashNormalized.concat(
        paired.map(pair => {
          const [key, value] = pair;
          if (Utils.isNonEmptyString(value)) {
            return [key, Utils.safeEncodeURIComponent(value)].join('=');
          }
          return '';
        })
      );
    }
    return hashNormalized;
  }

  private static addToUrlIfNotEmpty(toAdd: string[], joinWith: string, leadWith: string) {
    if (Utils.isNonEmptyArray(toAdd)) {
      return `${leadWith}${compact(toAdd).join(joinWith)}`;
    }
    return '';
  }

  private static startsWith(searchString: string, targetString: string) {
    return targetString.charAt(0) == searchString;
  }

  private static endsWith(searchString: string, targetString: string) {
    return targetString.charAt(targetString.length - 1) == searchString;
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
    let ret: string[];
    if (!isArray(parameter)) {
      ret = [parameter];
    } else {
      ret = parameter;
    }
    return ret;
  }
}
