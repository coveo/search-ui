import { StringUtils } from '../../src/utils/StringUtils';

export function StringUtilsTests() {
  describe('StringUtils', () => {
    it('should latinize string correctly', () => {
      expect(StringUtils.latinize('ćäñadå')).toBe('canada');
    });

    it('should html encode correctly', () => {
      expect(StringUtils.htmlEncode('<div></div>')).toBe('&lt;div&gt;&lt;/div&gt;');
    });

    it('should splice correctly', () => {
      expect(StringUtils.splice('foobar', 3, 0, 'baz')).toBe('foobazbar');
      expect(StringUtils.splice('foobar', 0, 6, 'baz')).toBe('baz');
      expect(StringUtils.splice('foobar', 6, 0, 'baz')).toBe('foobarbaz');
    });

    it('should removeMiddle correctly', () => {
      expect(StringUtils.removeMiddle('foobar', 3, '...')).toBe('f...ar');
    });

    it('should regex encode correctly', () => {
      expect(StringUtils.regexEncode('{foo}bar')).toBe('\\{foo\\}bar');
    });

    it('should string to regex correctly', () => {
      expect(StringUtils.stringToRegex('{foo}bar')).toBe('\\{foo\\}bar');
    });

    it('should wildcard to regex correctly', () => {
      expect(StringUtils.wildcardsToRegex('*.*')).toBe('.*\\.\\*');
    });

    it('should encodeCarriageReturn correctly', () => {
      expect(StringUtils.encodeCarriageReturn('\n')).toBe('<br/>');
    });

    it('should equalsCaseInsensitive correctly', () => {
      expect(StringUtils.equalsCaseInsensitive('A', 'a')).toBe(true);
      expect(StringUtils.equalsCaseInsensitive('A', 'B')).toBe(false);
    });
  });
}
