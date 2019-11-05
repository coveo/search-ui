import { ICategoryFacetValue } from '../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValue';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';

export class CategoryFacetTestUtils {
  static createFakeFacetValues(count = 5, depth = 1, state = FacetValueState.idle): ICategoryFacetValue[] {
    const fakeValues = [];

    for (let index = 0; index < count; index++) {
      const value = `fake value ${index}`;
      const fakeValue: ICategoryFacetValue = {
        value,
        state,
        children: [],
        displayValue: value,
        moreValuesAvailable: false,
        numberOfResults: Math.ceil(Math.random() * 100000),
        preventAutoSelect: false,
        path: [value]
      };

      fakeValues.push(fakeValue);
    }

    return fakeValues;
  }
}