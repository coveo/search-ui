// Code originally taken from : https://developers.livechatinc.com/blog/setting-cookies-to-subdomains-in-javascript/
export class Cookie {
  private static prefix: string = 'coveo_';

  static set(name: string, value: string, expiration?: number) {
    let domain: string, domainParts: string[], date, expires: string, host: string;

    if (expiration) {
      date = new Date();
      date.setTime(date.getTime() + expiration);
      expires = '; expires=' + date.toGMTString();
    } else {
      expires = '';
    }

    host = location.hostname;
    if (host.split('.').length === 1) {
      // no '.' in a domain - it's localhost or something similar
      document.cookie = this.prefix + name + '=' + value + expires + '; SameSite=Lax; path=/';
    } else {
      // Remember the cookie on all subdomains.
      //
      // Start with trying to set cookie to the top domain.
      // (example: if user is on foo.com, try to set
      //  cookie to domain '.com')
      //
      // If the cookie will not be set, it means '.com'
      // is a top level domain and we need to
      // set the cookie to '.foo.com'
      domainParts = host.split('.');
      domainParts.shift();
      domain = '.' + domainParts.join('.');

      document.cookie = this.prefix + name + '=' + value + expires + '; SameSite=Lax; path=/; domain=' + domain;

      // check if cookie was successfuly set to the given domain
      // (otherwise it was a Top-Level Domain)
      if (Cookie.get(name) == null || Cookie.get(name) != value) {
        // append '.' to current domain
        domain = '.' + host;
        document.cookie = this.prefix + name + '=' + value + expires + '; SameSite=Lax; path=/; domain=' + domain;
      }
    }
  }

  static get(name: string) {
    let nameEQ = this.prefix + name + '=';
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

  static erase(name: string) {
    Cookie.set(name, '', -1);
  }
}
