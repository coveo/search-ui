import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import * as Mock from '../../MockEnvironment';
import { $$ } from '../../../src/Core';
import { CategoryFacetValues } from '../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValues';
import { IFacetResponse, IFacetResponseValue } from '../../../src/rest/Facet/FacetResponse';
import { CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import { ICategoryFacet, ICategoryFacetOptions, ICategoryFacetValueProperties } from '../../../src/ui/CategoryFacet/ICategoryFacet';

export class CategoryFacetTestUtils {
  static allOptions(options?: ICategoryFacetOptions) {
    return {
      field: '@dummy',
      valueCaption: {},
      numberOfValues: 5,
      pageSize: 10,
      enableMoreLess: true,
      basePath: [],
      ...options
    };
  }

  static createFakeFacetValue(): ICategoryFacetValueProperties {
    const value = 'facet value';
    return {
      value,
      state: FacetValueState.idle,
      children: [],
      displayValue: value,
      moreValuesAvailable: false,
      numberOfResults: Math.ceil(Math.random() * 100000),
      preventAutoSelect: false,
      path: [value]
    };
  }

  static createFakeSelectedFacetResponseValue(): IFacetResponseValue {
    return {
      value: 'v0',
      state: FacetValueState.selected,
      numberOfResults: 19467,
      children: [
        {
          value: 'v0',
          state: FacetValueState.idle,
          numberOfResults: 981,
          children: []
        },
        {
          value: 'v1',
          state: FacetValueState.idle,
          numberOfResults: 978,
          children: []
        },
        {
          value: 'v2',
          state: FacetValueState.idle,
          numberOfResults: 975,
          children: []
        },
        {
          value: 'v19',
          state: FacetValueState.idle,
          numberOfResults: 972,
          children: []
        },
        {
          value: 'v18',
          state: FacetValueState.idle,
          numberOfResults: 972,
          children: []
        }
      ],
      moreValuesAvailable: true
    };
  }

  static createFakeFacetResponseValues(depth = 1, children = 5) {
    const fakeValues: IFacetResponseValue[] = [];

    for (let index = 0; index < children; index++) {
      const value = `value ${depth}-${index}`;
      const fakeValue: IFacetResponseValue = {
        value,
        state: FacetValueState.idle,
        children: depth > 1 ? this.createFakeFacetResponseValues(depth - 1, children) : [],
        moreValuesAvailable: false,
        numberOfResults: Math.ceil(Math.random() * 100000)
      };

      fakeValues.push(fakeValue);
    }

    return fakeValues;
  }

  static createFakeFacet(options?: ICategoryFacetOptions) {
    const facet = Mock.mockComponent<ICategoryFacet>(CategoryFacet);
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

  static getCompleteFacetResponse(facet: ICategoryFacet, partialResponse?: Partial<IFacetResponse>): IFacetResponse {
    return {
      facetId: facet.options.id,
      field: facet.fieldName,
      values: CategoryFacetTestUtils.createFakeFacetResponseValues(),
      moreValuesAvailable: false,
      ...partialResponse
    };
  }
}
