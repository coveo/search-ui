import { NoNameFacet } from '../../../src/ui/NoNameFacet/NoNameFacet';
import { INoNameFacetOptions } from '../../../src/ui/NoNameFacet/NoNameFacetOptions';
import { INoNameFacetValue } from '../../../src/ui/NoNameFacet/NoNameFacetValues/NoNameFacetValue';
import * as Mock from '../../MockEnvironment';

export class NoNameFacetTestUtils {
  static createFakeFacet(options?: INoNameFacetOptions) {
    const facet = Mock.mockComponent<NoNameFacet>(NoNameFacet);
    facet.options = {
      field: '@dummy',
      ...options
    };

    return facet;
  }

  static createFakeFacetValues(count = 5): INoNameFacetValue[] {
    const fakeValues = [];

    for (let index = 0; index < count; index++) {
      const fakeValue: INoNameFacetValue = {
        value: `fake value ${index}`,
        numberOfResults: Math.ceil(Math.random() * 1000),
        selected: false
      };

      fakeValues.push(fakeValue);
    }

    return fakeValues;
  }
}
