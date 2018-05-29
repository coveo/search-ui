import { Cookie } from '../../src/utils/CookieUtils';
import { Simulate } from '../../testsFramework/TestsFramework';

export function CookieUtilsTest() {
  describe('CookieUtils', () => {
    var mockDocument = {
      cookie: ''
    };
    var cookieDesc =
      Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
    if (cookieDesc && cookieDesc.configurable) {
      Object.defineProperty(document, 'cookie', {
        get: () => {
          return mockDocument.cookie;
        },
        set: function(val) {
          mockDocument.cookie = val;
        }
      });
    }

    afterEach(() => {
      mockDocument.cookie = '';
    });

    it('sets a cookie accordingly', () => {
      Cookie.set('foo', 'bar');
      expect(document.cookie.indexOf('foo=bar')).not.toBe(-1);
    });

    it('gets the right cookie when cookie exists', () => {
      Cookie.set('dude', 'dudevalue');
      expect(Cookie.get('dude')).toBe('dudevalue');
    });

    it("returns null if cookie doesn't exist", () => {
      expect(Cookie.get('foobar2000')).toBe(null);
    });

    it('erases cookie accordingly', () => {
      // Phantom doesn't handle document.cookie
      if (Simulate.isPhantomJs()) {
        expect(true).toBe(true);
      } else {
        document.cookie = 'coveo_patate=frite';
        Cookie.erase('patate');
        expect(document.cookie.replace(' ', '').indexOf('coveo_patate=frite')).toBe(-1);
      }
    });
  });
}
