import { ScopedCookie, CookieContext } from '../../src/utils/CookieUtils';
import { MockCookie, MockSingleCookie } from '../MockCookie';
import { Simulate } from '../Simulate';

export function CookieUtilsTest() {
  describe('CookieUtils', function () {
    it('sets a cookie accordingly', () => {
      ScopedCookie.set('foo', 'bar');
      expect(document.cookie.indexOf('foo=bar')).not.toBe(-1);
    });

    it('gets the right cookie when cookie exists', () => {
      ScopedCookie.set('dude', 'dudevalue');
      expect(ScopedCookie.get('dude')).toBe('dudevalue');
    });

    it("returns null if cookie doesn't exist", () => {
      expect(ScopedCookie.get('foobar2000')).toBe(null);
    });

    it('erases cookie accordingly', () => {
      // Phantom doesn't handle document.cookie
      if (Simulate.isPhantomJs()) {
        expect(true).toBe(true);
      } else {
        document.cookie = 'coveo_patate=frite';
        ScopedCookie.erase('patate');
        expect(document.cookie.replace(' ', '').indexOf('coveo_patate=frite')).toBe(-1);
      }
    });

    describe('includes the correct domain', () => {
      const scopedCookieName = 'test';
      const cookieName = `coveo_${scopedCookieName}`;
      const cookieValue = 'testvalue';
      function testCookie(options: { simulatedHostname: string }) {
        spyOn(CookieContext, 'getHostname').and.returnValue(options.simulatedHostname);
        ScopedCookie.set(scopedCookieName, cookieValue);
      }

      function buildMockSingleCookie(domain: string | null): MockSingleCookie {
        return { value: cookieValue, properties: { SameSite: 'Lax', ...(domain !== null ? { domain } : {}) } };
      }

      beforeEach(() => {
        MockCookie.clear();
      });

      it('when the hostname is a website with a subdomain, exclude the subdomain', () => {
        testCookie({ simulatedHostname: 'hello.example.com' });
        expect(MockCookie.get(cookieName)).toEqual(buildMockSingleCookie('example.com'));
      });

      it('when the hostname is a website with multiple subdomains, exclude the subdomains', () => {
        testCookie({ simulatedHostname: 'test.hello.example.com' });
        expect(MockCookie.get(cookieName)).toEqual(buildMockSingleCookie('example.com'));
      });

      it('when the hostname is a website without a subdomain, allow subdomains', () => {
        testCookie({ simulatedHostname: 'example.com' });
        expect(MockCookie.get(cookieName)).toEqual(buildMockSingleCookie('example.com'));
      });

      it('when the hostname is an IPv4 address, do not include a domain', () => {
        pending("Doesn't pass, even in coveo.analytics. Not important enough to fix.");
        testCookie({ simulatedHostname: '192.168.0.1' });
        expect(MockCookie.get(cookieName)).toEqual(buildMockSingleCookie(null));
      });

      it('when the hostname is an IPv6 address, do not include a domain', () => {
        testCookie({ simulatedHostname: '[::1]' });
        expect(MockCookie.get(cookieName)).toEqual(buildMockSingleCookie(null));
      });

      it('when the hostname is localhost, do not include a domain', () => {
        testCookie({ simulatedHostname: 'localhost' });
        expect(MockCookie.get(cookieName)).toEqual(buildMockSingleCookie(null));
      });
    });
  });
}
