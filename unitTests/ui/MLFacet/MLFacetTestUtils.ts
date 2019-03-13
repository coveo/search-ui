import { MLFacet } from '../../../src/ui/MLFacet/MLFacet';
import { IMLFacetOptions } from '../../../src/ui/MLFacet/MLFacetOptions';
import { IMLFacetValue } from '../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import * as Mock from '../../MockEnvironment';

export class MLFacetTestUtils {
  static createFakeFacet(options?: IMLFacetOptions) {
    const facet = Mock.mockComponent<MLFacet>(MLFacet);
    facet.options = {
      field: '@dummy',
      ...options
    };

    return facet;
  }

  static createFakeFacetValues(count = 5): IMLFacetValue[] {
    const fakeValues = [];

    for (let index = 0; index < count; index++) {
      const fakeValue: IMLFacetValue = {
        value: `fake value ${index}`,
        numberOfResults: Math.ceil(Math.random() * 100000),
        selected: false
      };

      fakeValues.push(fakeValue);
    }

    return fakeValues;
  }
}
