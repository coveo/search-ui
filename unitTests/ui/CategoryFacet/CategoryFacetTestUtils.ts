import { ICategoryFacetValue } from '../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValue';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import { ICategoryFacetOptions, CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import * as Mock from '../../MockEnvironment';
import { $$ } from '../../../src/Core';
import { CategoryFacetValues } from '../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValues';

export class CategoryFacetTestUtils {
  static allOptions(options?: ICategoryFacetOptions) {
    return {
      field: '@dummy',
      ...options
    };
  }

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

  static createFakeFacet(options?: ICategoryFacetOptions) {
    const facet = Mock.mockComponent<CategoryFacet>(CategoryFacet);
    facet.options = this.allOptions(options);
    facet.values = new CategoryFacetValues(facet);
    facet.element = $$('div').el;
    facet.searchInterface = Mock.mockSearchInterface();

    return facet;
  }

  static createAdvancedFakeFacet(options?: ICategoryFacetOptions, env?: Mock.IMockEnvironment) {
    return Mock.advancedComponentSetup<CategoryFacet>(CategoryFacet, <Mock.AdvancedComponentSetupOptions>{
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

}