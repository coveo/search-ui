import {HashUtils} from '../../src/utils/HashUtils';

export function HashUtilsTest() {
  describe('HashUtils', () => {

    it('parses the q parameter as a string when the value looks like an array', () => {
      let toParse = '#q=[test]';
      let value = HashUtils.getValue('q', toParse);
      expect(typeof value == 'string').toBe(true);
    });

    it ('parses the q parameter as a string when the value looks like an object', () => {
      let toParse = '#q={test}';
      let value = HashUtils.getValue('q', toParse);
      expect(typeof value == 'string').toBe(true);
    });
  });
}
