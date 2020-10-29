import { Cookie } from '../../src/utils/CookieUtils';
import { Simulate } from '../Simulate';

export function CookieUtilsTest() {
  describe('CookieUtils', function () {
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
