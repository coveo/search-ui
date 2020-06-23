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

    it('should support relative urls with leading slash', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['/a', '/b', '//c', '///d']
      });
      expect(url).toBe('/a/b/c/d');
    });

    it('should support relative urls with double leading slash', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['//a', '/b', '//c', '///d']
      });
      expect(url).toBe('//a/b/c/d');
    });

    it('should support relative url with ..', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['../a', '/b', '//c', '///d']
      });
      expect(url).toBe('../a/b/c/d');
    });

    it('should support relative url with .', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['./a', '/b', '//c', '///d']
      });
      expect(url).toBe('./a/b/c/d');
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

    it('should support passing in query string 0 as a dictionary', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        query: {
          123: 0
        }
      });
      expect(url).toBe('https://a.com?123=0');
    });

    it('should support passing in query string false as a dictionary', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        query: {
          123: false
        }
      });
      expect(url).toBe('https://a.com?123=false');
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

    it('should remove query string parameter that are an empty string', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=456`],
        query: {
          abc: ''
        }
      });
      expect(url).toBe(`https://a.com?123=456`);
    });

    it('should nremove query string parameter that are null', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=456`],
        query: {
          abc: null
        }
      });
      expect(url).toBe(`https://a.com?123=456`);
    });

    it('should remove query string parameter that are undefined', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=456`],
        query: {
          abc: undefined
        }
      });
      expect(url).toBe(`https://a.com?123=456`);
    });

    it('should not remove query string parameter that are 0', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=0`],
        query: {
          abc: 0
        }
      });
      expect(url).toBe(`https://a.com?123=0&abc=0`);
    });

    it('should not remove query string parameter that are "null" as string', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=null`],
        query: {
          abc: 'null'
        }
      });
      expect(url).toBe(`https://a.com?123=null&abc=null`);
    });

    it('should not remove query string parameter that are "undefined" as string', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=undefined`],
        query: {
          abc: 'undefined'
        }
      });
      expect(url).toBe(`https://a.com?123=undefined&abc=undefined`);
    });

    it('should not remove query string parameter that are "false" as string', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=false`],
        query: {
          abc: 'false'
        }
      });
      expect(url).toBe(`https://a.com?123=false&abc=false`);
    });

    it('should not remove query string parameter that are "true" as string', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=true`],
        query: {
          abc: 'true'
        }
      });
      expect(url).toBe(`https://a.com?123=true&abc=true`);
    });

    it('should not remove pipeline query string parameter that is empty', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`123=true`],
        query: {
          pipeline: ''
        }
      });
      expect(url).toBe(`https://a.com?123=true&pipeline=`);
    });

    it('should not remove pipeline query string parameter that is empty', () => {
      const url = UrlUtils.normalizeAsString({
        paths: ['https://a.com/'],
        queryAsString: [`pipeline=`],
        query: {
          abc: '',
          def: 'hij'
        }
      });
      expect(url).toBe(`https://a.com?pipeline&def=hij`);
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

    describe('getLinkDestination', () => {
      const originHost = 'https://cname.somewebsite.org';
      const originPages = ['members', 'me'];
      const originPage = originPages.join('/');
      const origin = `${originHost}/${originPage}?friends=0&favorite-cake=chocolate#blog-title`;
      it('should treat a path starting with a slash as absolute', () => {
        expect(UrlUtils.getLinkDestination(origin, '/')).toEqual(`${originHost}/`);
        expect(UrlUtils.getLinkDestination(origin, '/hello/world')).toEqual(`${originHost}/hello/world`);
        expect(UrlUtils.getLinkDestination(origin, '/hello/world/')).toEqual(`${originHost}/hello/world/`);
      });

      it('should treat a path not starting with a slash as relative', () => {
        expect(UrlUtils.getLinkDestination(origin, '')).toEqual(`${originHost}/${originPage}`);
        expect(UrlUtils.getLinkDestination(origin, 'hello/world')).toEqual(`${originHost}/${originPage}/hello/world`);
        expect(UrlUtils.getLinkDestination(origin, 'hello/world/')).toEqual(`${originHost}/${originPage}/hello/world/`);
        expect(UrlUtils.getLinkDestination(origin, 'hello/world/')).toEqual(`${originHost}/${originPage}/hello/world/`);
      });

      it('should correctly handle single periods', () => {
        expect(UrlUtils.getLinkDestination(origin, '.')).toEqual(`${originHost}/${originPage}`);
        expect(UrlUtils.getLinkDestination(origin, './')).toEqual(`${originHost}/${originPage}/`);
        expect(UrlUtils.getLinkDestination(origin, 'hello/./world')).toEqual(`${originHost}/${originPage}/hello/world`);
        expect(UrlUtils.getLinkDestination(origin, 'hello/world/.')).toEqual(`${originHost}/${originPage}/hello/world`);
        expect(UrlUtils.getLinkDestination(origin, 'hello/world/./')).toEqual(`${originHost}/${originPage}/hello/world/`);
        expect(UrlUtils.getLinkDestination(origin, '/hello/./world')).toEqual(`${originHost}/hello/world`);
        expect(UrlUtils.getLinkDestination(origin, '/hello/world/.')).toEqual(`${originHost}/hello/world`);
        expect(UrlUtils.getLinkDestination(origin, '/hello/world/./')).toEqual(`${originHost}/hello/world/`);
      });

      it('should correctly handle double periods', () => {
        expect(UrlUtils.getLinkDestination(origin, '..')).toEqual(`${originHost}/${originPages[0]}`);
        expect(UrlUtils.getLinkDestination(origin, '../')).toEqual(`${originHost}/${originPages[0]}/`);
        expect(UrlUtils.getLinkDestination(origin, '../..')).toEqual(`${originHost}`);
        expect(UrlUtils.getLinkDestination(origin, '../../')).toEqual(`${originHost}/`);
        expect(UrlUtils.getLinkDestination(origin, '../../hello/world/..')).toEqual(`${originHost}/hello`);
        expect(UrlUtils.getLinkDestination(origin, '../../hello/world/../')).toEqual(`${originHost}/hello/`);
        expect(UrlUtils.getLinkDestination(origin, '/..')).toEqual(originHost);
        expect(UrlUtils.getLinkDestination(origin, '/hello/world/..')).toEqual(`${originHost}/hello`);
        expect(UrlUtils.getLinkDestination(origin, '/hello/world/../')).toEqual(`${originHost}/hello/`);
        expect(UrlUtils.getLinkDestination(origin, '/hello/../../../../blah')).toEqual(`${originHost}/blah`);
      });

      it('with an absolute path instead of a relative path, should return the new path', () => {
        expect(UrlUtils.getLinkDestination(origin, 'mywebsite.com')).toEqual('mywebsite.com');
        expect(UrlUtils.getLinkDestination(origin, 'www.mywebsite.com')).toEqual('www.mywebsite.com');
        expect(UrlUtils.getLinkDestination(origin, 'www.mywebsite.com/')).toEqual('www.mywebsite.com/');
        expect(UrlUtils.getLinkDestination(origin, 'https://www.mywebsite.com')).toEqual('https://www.mywebsite.com');
        expect(UrlUtils.getLinkDestination(origin, 'http://www.mywebsite.com')).toEqual('http://www.mywebsite.com');
        expect(UrlUtils.getLinkDestination(origin, origin)).toEqual(origin);
      });
    });
  });
}
