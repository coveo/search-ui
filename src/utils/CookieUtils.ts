// Code originally modified from : https://developers.livechatinc.com/blog/setting-cookies-to-subdomains-in-javascript/
// Should always match: https://github.com/coveo/coveo.analytics.js/blob/master/src/cookieutils.ts
export class CoveoAnalyticsCookie {
  static getHostname() {
    return location.hostname;
  }

  set(name: string, value: string, expire?: number) {
    var domain: string, expirationDate: Date | undefined, domainParts: string[];
    if (expire) {
      expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + expire);
    }
    if (CoveoAnalyticsCookie.getHostname().indexOf('.') === -1) {
      // no "." in a domain - single domain name, it's localhost or something similar
      writeCookie(name, value, expirationDate);
    } else {
      domainParts = CoveoAnalyticsCookie.getHostname().split('.');
      // we always have at least 2 domain parts
      domain = domainParts[domainParts.length - 2] + '.' + domainParts[domainParts.length - 1];
      writeCookie(name, value, expirationDate, domain);
    }
  }

  get(name: string) {
    var cookiePrefix = name + '=';
    var cookieArray = document.cookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
      var cookie = cookieArray[i];
      cookie = cookie.replace(/^\s+/, ''); //strip whitespace from front of cookie only
      if (cookie.lastIndexOf(cookiePrefix, 0) === 0) {
        return cookie.substring(cookiePrefix.length, cookie.length);
      }
    }
    return null;
  }

  erase(name: string) {
    this.set(name, '', -1);
  }
}

function writeCookie(name: string, value: string, expirationDate?: Date, domain?: string) {
  document.cookie =
    `${name}=${value}` +
    (expirationDate ? `;expires=${expirationDate.toUTCString()}` : '') +
    (domain ? `;domain=${domain}` : '') +
    ';SameSite=Lax';
}

export class Cookie {
  private static prefix: string = 'coveo_';
  private static coveoAnalyticsCookie = new CoveoAnalyticsCookie();

  static set(name: string, value: string, expire?: number) {
    this.coveoAnalyticsCookie.set(this.getRealCookieName(name), value, expire);
  }

  static get(name: string) {
    return this.coveoAnalyticsCookie.get(this.getRealCookieName(name));
  }

  static erase(name: string) {
    return this.coveoAnalyticsCookie.erase(this.getRealCookieName(name));
  }

  private static getRealCookieName(name: string) {
    return `${this.prefix}${name}`;
  }
}
