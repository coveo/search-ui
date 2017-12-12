import { Utils } from '../../src/utils/Utils';

export function UtilsTest() {
  describe('Utils', () => {
    it('safeEncodeURIComponent should support null values', () => {
      expect(Utils.safeEncodeURIComponent(null)).toEqual(encodeURIComponent('null'));
    });

    it('safeEncodeURIComponent should return the standard value for standard string', () => {
      expect(Utils.safeEncodeURIComponent('The quick brown fox over the lazy dog')).toEqual(
        encodeURIComponent('The quick brown fox over the lazy dog')
      );
    });

    it('safeEncodeURIComponent should not throw when encoding weird unicode strings as opposed to the standard function', () => {
      expect(() => encodeURIComponent('\uD800')).toThrow();
      expect(() => Utils.safeEncodeURIComponent('\uD800')).not.toThrow();
    });
  });
}
