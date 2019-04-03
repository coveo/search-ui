import { MLFacet, IMLFacetOptions } from '../../../src/ui/MLFacet/MLFacet';
import { IMLFacetValue } from '../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import * as Mock from '../../MockEnvironment';
import { IFacetResponse } from '../../../src/rest/Facet/FacetResponse';

export class MLFacetTestUtils {
  static createFakeFacet(options?: IMLFacetOptions) {
    const facet = Mock.mockComponent<MLFacet>(MLFacet);
    facet.options = {
      field: '@dummy',
      ...options
    };

    return facet;
  }

  static createAdvancedFakeFacet(options?: IMLFacetOptions, withQSM = true) {
    return Mock.advancedComponentSetup<MLFacet>(MLFacet, <Mock.AdvancedComponentSetupOptions>{
      modifyBuilder: builder => {
        return withQSM ? builder.withLiveQueryStateModel() : builder;
      },
      cmpOptions: options
    });
  }

  static createFakeFacetValues(count = 5): IMLFacetValue[] {
    const fakeValues = [];

    for (let index = 0; index < count; index++) {
      const fakeValue: IMLFacetValue = {
        value: `fake value ${index}`,
        numberOfResults: Math.ceil(Math.random() * 100000),
        state: FacetValueState.idle
      };

      fakeValues.push(fakeValue);
    }

    return fakeValues;
  }

  static getCompleteFacetResponse(facet: MLFacet, partialResponse?: Partial<IFacetResponse>): IFacetResponse {
    return {
      facetId: facet.options.id,
      field: facet.fieldName,
      values: [],
      moreValuesAvailable: false,
      ...partialResponse
    };
  }
}
