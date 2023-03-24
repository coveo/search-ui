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

declare global {
  interface Window {
    mockCookie?: MockCookie;
  }
}

export interface MockSingleCookie {
  value: string;
  properties: Record<string, string>;
}

export class MockCookie {
  private cookiesDict: { [cookieName: string]: MockSingleCookie } = {};

  static mockBrowserCookies() {
    if (!cookiesDescriptor || !cookiesDescriptor.configurable) {
      return false;
    }
    const mockCookie = new MockCookie();
    Object.defineProperty(document, 'cookie', {
      get: () => mockCookie.cookie,
      set: value => (mockCookie.cookie = value)
    });
    window.mockCookie = mockCookie;
    return true;
  }

  static unmockBrowserCookies() {
    if (!cookiesDescriptor || !cookiesDescriptor.configurable) {
      return false;
    }
    Object.defineProperty(document, 'cookie', cookiesDescriptor);
    return true;
  }

  static get(name: string) {
    if (!window.mockCookie) {
      throw "Cookies aren't mocked.";
    }
    const cookie = window.mockCookie.cookiesDict[name];
    return cookie && cookie.value ? cookie : null;
  }

  static set(name: string, value: string, properties?: Record<string, string>) {
    if (!window.mockCookie) {
      throw "Cookies aren't mocked.";
    }
    window.mockCookie.cookiesDict[name] = { value, properties: properties || {} };
  }

  static clear() {
    if (!window.mockCookie) {
      throw "Cookies aren't mocked.";
    }
    window.mockCookie.cookiesDict = {};
  }

  public get cookie() {
    return Object.keys(this.cookiesDict)
      .map(key => `${key}=${this.cookiesDict[key].value}`)
      .join('; ');
  }

  public set cookie(cookie: string) {
    const assignments = cookie.split(';').map(cookie => cookie.trim());
    const [cookieName, cookieValue] = assignments[0].split('=');
    const properties = mapToObject(assignments.slice(1), assignment => assignment.split('=') as [string, string]);
    if ('expiration' in properties && parseInt(properties.expiration, 10) < Date.now()) {
      delete properties.expiration;
    } else {
      this.cookiesDict[cookieName] = { value: cookieValue, properties };
    }
  }
}
