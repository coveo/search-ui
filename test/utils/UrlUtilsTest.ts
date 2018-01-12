import { UrlUtils } from '../../src/utils/UrlUtils';
import { Utils } from '../Test';

export function UrlUtilsTest() {
  describe('UrlUtils', () => {
    it('should support combining multiple paths with trailing slash', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/', 'b/', 'c//', 'd///']
      });
      expect(url).toBe('https://a.com/b/c/d');
    });

    it('should support combining multiple paths with leading slash', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/', '/b', '//c', '///d']
      });
      expect(url).toBe('https://a.com/b/c/d');
    });

    it('should support passing in query string as an array of strings', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: ['123=4', '456=7']
      });
      expect(url).toBe('https://a.com?123=4&456=7');
    });

    it('should support passing in query string as a dictionary', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        query: {
          123: 4,
          456: 7
        }
      });
      expect(url).toBe('https://a.com?123=4&456=7');
    });

    it('should use both query string as an array of strings and a dictionary', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: ['123=4', '456=7'],
        query: {
          abc: 'd',
          efg: 'h'
        }
      });
      expect(url).toBe('https://a.com?123=4&456=7&abc=d&efg=h');
    });

    it('should remove duplicates query string parameters', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: ['123=4', '456=7', '123=4'],
        query: {
          abc: 'd',
          efg: 'h',
          123: 4
        }
      });
      expect(url).toBe('https://a.com?123=4&456=7&abc=d&efg=h');
    });

    it('should url encode query string parameters', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: ['123=4 56'],
        query: {
          abc: '&def'
        }
      });
      expect(url).toBe(`https://a.com?123=4${Utils.safeEncodeURIComponent(' ')}56&abc=${Utils.safeEncodeURIComponent('&')}def`);
    });

    it('should not double url encode query string parameters', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=4${Utils.safeEncodeURIComponent(' ')}56`],
        query: {
          abc: `${Utils.safeEncodeURIComponent('&')}def`
        }
      });
      expect(url).toBe(`https://a.com?123=4${Utils.safeEncodeURIComponent(' ')}56&abc=${Utils.safeEncodeURIComponent('&')}def`);
    });

    it('should remove incoherent "?" character', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/?'],
        queryAsString: ['?123=4', '456?=7', '123=4'],
        query: {
          'abc?': 'd',
          '?efg': 'h?',
          123: 4
        }
      });
      expect(url).toBe(`https://a.com?123=4&456=7&abc=d&efg=h${Utils.safeEncodeURIComponent('?')}`);
    });

    it('should remove incoherent "=" character', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com'],
        queryAsString: ['=123=4'],
        query: {
          '=abc': 'd',
          'efg=': 'h'
        }
      });
      expect(url).toBe(`https://a.com?123=4&abc=d&efg=h`);
    });
  });
}
