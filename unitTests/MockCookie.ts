function mapToObject<T = any>(list: string[], predicate: (value: string) => [string, string]): T {
  const obj = {};
  list.forEach(listMember => {
    const [key, value] = predicate(listMember);
    obj[key] = value;
  });
  return obj as T;
}

const cookiesDescriptor =
  Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

export class MockCookie {
  private cookiesDict: { [cookieName: string]: string } = {};

  static mockBrowserCookies() {
    if (!cookiesDescriptor || !cookiesDescriptor.configurable) {
      return false;
    }
    const mockCookie = new MockCookie();
    Object.defineProperty(document, 'cookie', {
      get: () => mockCookie.cookie,
      set: value => (mockCookie.cookie = value)
    });
    return true;
  }

  static unmockBrowserCookies() {
    if (!cookiesDescriptor || !cookiesDescriptor.configurable) {
      return false;
    }
    Object.defineProperty(document, 'cookie', cookiesDescriptor);
    return true;
  }

  public get cookie() {
    return Object.keys(this.cookiesDict)
      .map(key => `${key}=${this.cookiesDict[key]}`)
      .join('; ');
  }

  public set cookie(cookie: string) {
    const assignments = cookie.split(';').map(cookie => cookie.trim());
    const [cookieName, cookieValue] = assignments[0].split('=');
    const properties = mapToObject(assignments.slice(1), assignment => assignment.split('=') as [string, string]);
    if ('expiration' in properties && parseInt(properties.expiration, 10) < Date.now()) {
      delete properties.expiration;
    } else {
      this.cookiesDict[cookieName] = cookieValue;
    }
  }
}
