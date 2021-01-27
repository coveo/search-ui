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

    describe('reorderValuesByKeys', () => {
      const objectsToSort = [{ name: 'abc' }, { name: 'def' }, { name: 'ghi' }, { name: 'jkl' }];

      it('when appendRemainingValues is false, returns only the sorted values', () => {
        expect(Utils.reorderValuesByKeys(objectsToSort, ['ghi', 'def'], obj => obj.name, false)).toEqual([
          objectsToSort[2],
          objectsToSort[1]
        ]);
      });

      it('when appendRemainingValues is true, returns the sorted values followed by the unsorted values in their original order', () => {
        expect(Utils.reorderValuesByKeys(objectsToSort, ['ghi', 'def'], obj => obj.name, true)).toEqual([
          objectsToSort[2],
          objectsToSort[1],
          objectsToSort[0],
          objectsToSort[3]
        ]);
      });
    });
  });
}
