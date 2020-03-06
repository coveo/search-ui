import { $$ } from '../../../src/utils/Dom';
import { DynamicFacet } from '../../../src/ui/DynamicFacet/DynamicFacet';
import { IDynamicFacetOptions } from '../../../src/ui/DynamicFacet/IDynamicFacet';
import { IDynamicFacetValueProperties } from '../../../src/ui/DynamicFacet/IDynamicFacet';
import { DynamicFacetValueCreator } from '../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValueCreator';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import * as Mock from '../../MockEnvironment';
import { IFacetResponse } from '../../../src/rest/Facet/FacetResponse';
import { DynamicFacetValues } from '../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValues';

export class DynamicFacetTestUtils {
  static allOptions(options?: IDynamicFacetOptions) {
    return {
      field: '@dummy',
      valueCaption: {},
      ...options
    };
  }

  static createFakeFacet(options?: IDynamicFacetOptions) {
    const facet = Mock.mockComponent<DynamicFacet>(DynamicFacet);
    facet.options = this.allOptions(options);
    facet.values = new DynamicFacetValues(facet, DynamicFacetValueCreator);
    facet.element = $$('div').el;
    facet.searchInterface = Mock.mockSearchInterface();

    return facet;
  }

  static createAdvancedFakeFacet(options?: IDynamicFacetOptions, env?: Mock.IMockEnvironment) {
    return Mock.advancedComponentSetup<DynamicFacet>(DynamicFacet, <Mock.AdvancedComponentSetupOptions>{
      modifyBuilder: builder => {
        if (!env) {
          builder = builder.withLiveQueryStateModel();
          return builder;
        }

        builder = builder.withRoot(env.root);
        builder = builder.withQueryStateModel(env.queryStateModel);
        return builder;
      },

      cmpOptions: this.allOptions(options)
    });
  }

  static createFakeFacetValues(count = 5, state = FacetValueState.idle): IDynamicFacetValueProperties[] {
    const fakeValues = [];

    for (let index = 0; index < count; index++) {
      const value = `fake value ${index}`;
      const fakeValue: IDynamicFacetValueProperties = {
        displayValue: value,
        numberOfResults: Math.ceil(Math.random() * 100000),
        value,
        state,
        position: index + 1
      };

      fakeValues.push(fakeValue);
    }

    return fakeValues;
  }

  static getCompleteFacetResponse(facet: DynamicFacet, partialResponse?: Partial<IFacetResponse>): IFacetResponse {
    return {
      facetId: facet.options.id,
      field: facet.fieldName,
      values: DynamicFacetTestUtils.createFakeFacetValues(),
      moreValuesAvailable: false,
      ...partialResponse
    };
  }
}
