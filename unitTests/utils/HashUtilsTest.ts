import { HashUtils } from '../../src/utils/HashUtils';

export function HashUtilsTest() {
  describe('HashUtils', () => {
    it('parses the q parameter as a string when the value looks like an array', () => {
      const toParse = '#q=[test]';
      const value = HashUtils.getValue('q', toParse);
      expect(typeof value == 'string').toBe(true);
    });

    it('parses the t parameter as a string when the value has two characters', () => {
      const toParse = '#t=ab';
      const value = HashUtils.getValue('t', toParse);
      expect(typeof value == 'string').toBe(true);
    });

    it('parses the q parameter as a string when the value looks like an object', () => {
      const toParse = '#q={"test": 1}';
      const value = HashUtils.getValue('q', toParse);
      expect(typeof value == 'string').toBe(true);
    });

    it('parses objects correctly', () => {
      const toParse = '#a={"test": 1}';
      const expectedValue = { test: 1 };

      const value = HashUtils.getValue('a', toParse);

      expect(value).toEqual(expectedValue);
    });

    it('parses object which contains array correctly', () => {
      const toParse = '#a={"test":[Foo,Bar]}';
      const expectedValue = { test: ['Foo', 'Bar'] };

      const value = HashUtils.getValue('a', toParse);

      expect(value).toEqual(expectedValue);
    });

    it('parses unencoded arrays correctly', () => {
      const toParse = '#a=[1]';
      const expectedValue = ['1'];

      const value = HashUtils.getValue('a', toParse);

      expect(value).toEqual(expectedValue);
    });

    it('parses encoded arrays correctly', () => {
      const encodedLeftBracket = '%5B';
      const encodedRightBracket = '%5D';
      const toParse = `#a=${encodedLeftBracket}1${encodedRightBracket}`;
      const expectedValue = ['1'];

      const value = HashUtils.getValue('a', toParse);

      expect(value).toEqual(expectedValue);
    });

    it('parses arrays with only a left bracket correctly', () => {
      const value = 'value';
      const toParse = `#f=[${value}`;
      const expectedValue = [value];

      const result = HashUtils.getValue('f', toParse);
      expect(result).toEqual(expectedValue);
    });

    it('parses arrays with only a right bracket correctly', () => {
      const value = 'value';
      const toParse = `#f=${value}]`;
      const expectedValue = [value];

      const result = HashUtils.getValue('f', toParse);
      expect(result).toEqual(expectedValue);
    });

    it('parses strings correctly', () => {
      const toParse = '#a=test';
      const expectedValue = 'test';

      const value = HashUtils.getValue('a', toParse);
      expect(value).toEqual(expectedValue);
    });

    it('encodes objects correctly', () => {
      const toEncode = { test: 1 };
      const expectedEncodedValue = 'a={"test":1}';

      const encodedValue = HashUtils.encodeValues({ a: toEncode });

      expect(encodedValue).toEqual(expectedEncodedValue);
    });

    it('encodes complex objects correctly', () => {
      const toEncode = { test: { subTest: ['1', '2'] } };
      const expectedEncodedValue = 'a={"test":{"subTest":["1","2"]}}';

      const encodedValue = HashUtils.encodeValues({ a: toEncode });

      expect(encodedValue).toEqual(expectedEncodedValue);
    });

    it('encodes arrays correctly', () => {
      const toEncode = [1];
      const expectEncodedValue = 'a=[1]';

      const encodedValue = HashUtils.encodeValues({ a: toEncode });

      expect(encodedValue).toEqual(expectEncodedValue);
    });

    it('encodes strings correctly', () => {
      const toEncode = 'test';
      const expectedEncodedValue = 'a=test';

      const encodedValue = HashUtils.encodeValues({ a: toEncode });

      expect(encodedValue).toEqual(expectedEncodedValue);
    });

    it('should not throw when encoding null or undefined values', () => {
      const toEncode = null;
      const expectedEncodedValue = '';
      const encodedValue = HashUtils.encodeValues({ a: toEncode });
      expect(() => HashUtils.encodeValues({ a: toEncode })).not.toThrowError();
      expect(encodedValue).toEqual(expectedEncodedValue);
    });

    it('joins values correctly', () => {
      const firstValue = 'test';
      const secondValue = [1];
      const expectedEncodedValues = 'a=test&b=[1]';

      const encodedValues = HashUtils.encodeValues({ a: firstValue, b: secondValue });

      expect(encodedValues).toEqual(expectedEncodedValues);
    });
  });
}
