import { Utils } from '../../src/utils/Utils';

export function UtilsTest() {
  describe('Utils', () => {
    describe('safeEncodeURIComponent', () => {
      it('should support null values', () => {
        expect(Utils.safeEncodeURIComponent(null)).toEqual(encodeURIComponent('null'));
      });

      it('should return the standard value for standard string', () => {
        expect(Utils.safeEncodeURIComponent('The quick brown fox over the lazy dog')).toEqual(
          encodeURIComponent('The quick brown fox over the lazy dog')
        );
      });

      it('should not throw when encoding weird unicode strings as opposed to the standard function', () => {
        expect(() => encodeURIComponent('\uD800')).toThrow();
        expect(() => Utils.safeEncodeURIComponent('\uD800')).not.toThrow();
      });
    });

    describe('extendDeep', () => {
      const nonExistingValue = 'value1';
      const existingValue = 'value2';

      it('should add new key in target', () => {
        const result = Utils.extendDeep({ existingValue }, { nonExistingValue });
        expect(result).toEqual({
          nonExistingValue,
          existingValue
        });
      });

      it('should override the value of an existing key in target', () => {
        const newValue = 'bloup';

        const result = Utils.extendDeep({ existingValue }, { existingValue: newValue });
        expect(result).toEqual({
          existingValue: newValue
        });
      });

      it('should merge two arrays with simple values', () => {
        const result = Utils.extendDeep({ existingValue: [nonExistingValue] }, { existingValue: [existingValue] });
        expect(result).toEqual({
          existingValue: [nonExistingValue, existingValue]
        });
      });

      it('should merge two arrays with HTML element values', () => {
        const existingElement = document.createElement('div');
        const nonExistingElement = document.createElement('div');
        const result = Utils.extendDeep({ existingValue: [existingElement] }, { existingValue: [nonExistingElement] });
        expect(result).toEqual({
          existingValue: [existingElement, nonExistingElement]
        });
      });
    });

    it('reorderValuesByKeys returns the sorted values followed by the unsorted values in their original order', () => {
      const objectsToSort = [{ name: '4' }, { name: '3' }, { name: '2' }, { name: '1' }];
      expect(Utils.reorderValuesByKeys(objectsToSort, ['2', '3'], obj => obj.name)).toEqual([
        objectsToSort[2],
        objectsToSort[1],
        objectsToSort[0],
        objectsToSort[3]
      ]);
    });

    describe('stringStartsWith', () => {
      it('returns true when string starts with value', () => {
        expect(Utils.stringStartsWith('valid value', 'valid')).toBe(true);
      });

      it('returns true when string starts with value', () => {
        expect(Utils.stringStartsWith('invalid value', 'valid')).toBe(false);
      });
    });

    describe('stringEndsWith', () => {
      it('returns true when string ends with value', () => {
        expect(Utils.stringEndsWith('value is good', 'good')).toBe(true);
      });

      it('returns false when string ends with value', () => {
        expect(Utils.stringEndsWith('value is bad', 'good')).toBe(false);
      });
    });
  });
}
