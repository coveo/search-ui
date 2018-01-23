import { HashUtils } from '../../src/utils/HashUtils';

export function HashUtilsTest() {
  describe('HashUtils', () => {
    it('parses the q parameter as a string when the value looks like an array', () => {
      let toParse = '#q=[test]';
      let value = HashUtils.getValue('q', toParse);
      expect(typeof value == 'string').toBe(true);
    });

    it('parses the q parameter as a string when the value looks like an object', () => {
      let toParse = '#q={"test": 1}';
      let value = HashUtils.getValue('q', toParse);
      expect(typeof value == 'string').toBe(true);
    });

    it('parses objects correctly', () => {
      let toParse = '#a={"test": 1}';
      let expectedValue = { test: 1 };

      let value = HashUtils.getValue('a', toParse);

      expect(value).toEqual(expectedValue);
    });

    it('parses arrays correctly', () => {
      let toParse = '#a=[1]';
      let expectedValue = ['1'];

      let value = HashUtils.getValue('a', toParse);

      expect(value).toEqual(expectedValue);
    });

    it('parses strings correctly', () => {
      let toParse = '#a=test';
      let expectedValue = 'test';

      let value = HashUtils.getValue('a', toParse);
      expect(value).toEqual(expectedValue);
    });

    it('encodes objects correctly', () => {
      let toEncode = { test: 1 };
      let expectedEncodedValue = 'a={"test":1}';

      let encodedValue = HashUtils.encodeValues({ a: toEncode });

      expect(encodedValue).toEqual(expectedEncodedValue);
    });

    it('encodes arrays correcttly', () => {
      let toEncode = [1];
      let expectEncodedValue = 'a=[1]';

      let encodedValue = HashUtils.encodeValues({ a: toEncode });

      expect(encodedValue).toEqual(expectEncodedValue);
    });

    it('encodes strings correctly', () => {
      let toEncode = 'test';
      let expectedEncodedValue = 'a=test';

      let encodedValue = HashUtils.encodeValues({ a: toEncode });

      expect(encodedValue).toEqual(expectedEncodedValue);
    });

    it('should not throw when encoding null or undefined values', () => {
      let toEncode = null;
      let expectedEncodedValue = '';
      let encodedValue = HashUtils.encodeValues({ a: toEncode });
      expect(() => HashUtils.encodeValues({ a: toEncode })).not.toThrowError();
      expect(encodedValue).toEqual(expectedEncodedValue);
    });

    it('joins values correctly', () => {
      let firstValue = 'test';
      let secondValue = [1];
      let expectedEncodedValues = 'a=test&b=[1]';

      let encodedValues = HashUtils.encodeValues({ a: firstValue, b: secondValue });

      expect(encodedValues).toEqual(expectedEncodedValues);
    });
  });
}
