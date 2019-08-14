import { CategoryFacetValuesTree } from '../../../src/ui/CategoryFacet/CategoryFacetValuesTree';
import { ICategoryFacetValue } from '../../../src/rest/CategoryFacetValue';
import { ICategoryFacetResult } from '../../../src/rest/CategoryFacetResult';

function buildCategoryFacetValue(config: Partial<ICategoryFacetValue> = {}): ICategoryFacetValue {
  return {
    numberOfResults: 0,
    value: '',
    ...config
  };
}

function buildCategoryFacetResult(config: Partial<ICategoryFacetResult> = {}): ICategoryFacetResult {
  return {
    field: '',
    notImplemented: false,
    parentValues: [],
    values: [],
    ...config
  };
}

export function CategoryFacetValuesTreeTest() {
  describe('CategoryFacetValuesTree', () => {
    let klass: CategoryFacetValuesTree;

    beforeEach(() => (klass = new CategoryFacetValuesTree()));

    describe(`when the category facet result has no parents but has values, calling #storeNewValues`, () => {
      const value1 = buildCategoryFacetValue({ value: 'hello' });
      const value2 = buildCategoryFacetValue({ value: 'world' });
      const result = buildCategoryFacetResult({ parentValues: [], values: [value1, value2] });

      beforeEach(() => klass.storeNewValues(result));

      it(`adds the values to base level of #seenValues`, () => {
        const [firstSeenValue, secondSeenValue] = klass.seenValues;
        expect(firstSeenValue.result).toEqual(value1);
        expect(secondSeenValue.result).toEqual(value2);
      });

      it(`calling #storeNewValues a second time with the same values does not add the values again`, () => {
        klass.storeNewValues(result);
        expect(klass.seenValues.length).toBe(result.values.length);
      });
    });

    describe(`when the category facet result has a parent value and no values, calling #storeNewValues`, () => {
      const parentValue = buildCategoryFacetValue({ value: 'parent' });
      const result = buildCategoryFacetResult({ parentValues: [parentValue], values: [] });

      beforeEach(() => klass.storeNewValues(result));

      it(`adds the parent value to base level of #seenValues`, () => {
        const [firstSeenValue] = klass.seenValues;
        expect(firstSeenValue.result).toEqual(parentValue);
      });

      it(`calling #storeNewValues a second time with the same parent value does not add the parent value again`, () => {
        klass.storeNewValues(result);
        expect(klass.seenValues.length).toBe(result.parentValues.length);
      });
    });

    it(`when the category facet result has two parent values and no values,
    calling #storeNewValues adds the first parent value to base level of #seenValues,
    and the second parent value as a child of the first parent value`, () => {
      const parentValue1 = buildCategoryFacetValue({ value: 'parent1' });
      const parentValue2 = buildCategoryFacetValue({ value: 'parent2' });
      const result = buildCategoryFacetResult({ parentValues: [parentValue1, parentValue2], values: [] });

      klass.storeNewValues(result);

      const [firstSeenValue] = klass.seenValues;
      expect(firstSeenValue.result).toEqual(parentValue1);
      expect(firstSeenValue.children[0].result).toEqual(parentValue2);
    });

    it(`when the category facet result has one parent value and one value,
    calling #storeNewValues adds the value as a child of the parent value`, () => {
      const parentValue = buildCategoryFacetValue({ value: 'parent' });
      const childValue = buildCategoryFacetValue({ value: 'child' });
      const result = buildCategoryFacetResult({ parentValues: [parentValue], values: [childValue] });

      klass.storeNewValues(result);

      const [firstSeenValue] = klass.seenValues;
      expect(firstSeenValue.result).toEqual(parentValue);
      expect(firstSeenValue.children[0].result).toEqual(childValue);
    });

    it(`when calling #getValueForLastPartInPath with an empty array,
    it returns a an object with #value that is an empty string`, () => {
      const result = klass.getValueForLastPartInPath([]);
      expect(result.value).toBe('');
    });

    it(`when calling #getValueForLastPartInPath with an array with a value that has not been seen,
    it returns an object with #value that is an empty string`, () => {
      const result = klass.getValueForLastPartInPath(['newValue']);
      expect(result.value).toBe('');
    });

    describe(`when calling #storeNewValues with two parent values`, () => {
      const parent1 = buildCategoryFacetValue({ value: 'parent1' });
      const parent2 = buildCategoryFacetValue({ value: 'parent2' });

      beforeEach(() => {
        const result = buildCategoryFacetResult({ parentValues: [parent1, parent2] });
        klass.storeNewValues(result);
      });

      it(`when calling #getValueForLastPartInPath with the names of the parent values in the correct order,
      it returns the second parent`, () => {
        const path = [parent1.value, parent2.value];
        const lastParent = klass.getValueForLastPartInPath(path);

        expect(lastParent.value).toBe(parent2.value);
      });

      it(`when calling #getValueForLastPartInPath with the names of the parent values in reverse order,
      it returns an object with #value that is an empty string`, () => {
        const path = [parent2.value, parent1.value];
        const lastParent = klass.getValueForLastPartInPath(path);

        expect(lastParent.value).toBe('');
      });
    });
  });
}
