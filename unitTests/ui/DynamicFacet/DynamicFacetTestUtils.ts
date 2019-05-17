import { $$ } from '../../../src/utils/Dom';
import { DynamicFacet, IDynamicFacetOptions } from '../../../src/ui/DynamicFacet/DynamicFacet';
import { IDynamicFacetValue } from '../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import * as Mock from '../../MockEnvironment';
import { IFacetResponse } from '../../../src/rest/Facet/FacetResponse';

export class DynamicFacetTestUtils {
  static createFakeFacet(options?: IDynamicFacetOptions) {
    const facet = Mock.mockComponent<DynamicFacet>(DynamicFacet);
    facet.options = {
      id: 'dummy',
      field: '@dummy',
      title: 'a title',
      ...options
    };
    facet.element = $$('div').el;

    return facet;
  }

  static createAdvancedFakeFacet(options?: IDynamicFacetOptions, withQSM = true) {
    return Mock.advancedComponentSetup<DynamicFacet>(DynamicFacet, <Mock.AdvancedComponentSetupOptions>{
      modifyBuilder: builder => {
        return withQSM ? builder.withLiveQueryStateModel() : builder;
      },
      cmpOptions: options
    });
  }

  static createFakeFacetValues(count = 5, state = FacetValueState.idle): IDynamicFacetValue[] {
    const fakeValues = [];

    for (let index = 0; index < count; index++) {
      const fakeValue: IDynamicFacetValue = {
        value: `fake value ${index}`,
        numberOfResults: Math.ceil(Math.random() * 100000),
        state
      };

      fakeValues.push(fakeValue);
    }

    return fakeValues;
  }

  static getCompleteFacetResponse(facet: DynamicFacet, partialResponse?: Partial<IFacetResponse>): IFacetResponse {
    return {
      facetId: facet.options.id,
      field: facet.fieldName,
      values: [],
      moreValuesAvailable: false,
      ...partialResponse
    };
  }
}
