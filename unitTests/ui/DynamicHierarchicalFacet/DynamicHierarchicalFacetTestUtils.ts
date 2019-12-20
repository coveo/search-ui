import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import * as Mock from '../../MockEnvironment';
import { $$ } from '../../../src/Core';
import { DynamicHierarchicalFacetValues } from '../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetValues/DynamicHierarchicalFacetValues';
import { IFacetResponse, IFacetResponseValue } from '../../../src/rest/Facet/FacetResponse';
import { DynamicHierarchicalFacet } from '../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacet';
import {
  IDynamicHierarchicalFacet,
  IDynamicHierarchicalFacetOptions,
  IDynamicHierarchicalFacetValueProperties
} from '../../../src/ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { DynamicFacetHeader } from '../../../src/ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeader';

export class DynamicHierarchicalFacetTestUtils {
  static allOptions(options?: IDynamicHierarchicalFacetOptions) {
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

  static createFakeFacetValue(): IDynamicHierarchicalFacetValueProperties {
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

  static createFakeFacet(options?: IDynamicHierarchicalFacetOptions) {
    const facet = Mock.mockComponent<IDynamicHierarchicalFacet>(DynamicHierarchicalFacet);
    facet.options = this.allOptions(options);
    facet.values = new DynamicHierarchicalFacetValues(facet);
    facet.element = $$('div').el;
    facet.searchInterface = Mock.mockSearchInterface();
    facet.header = Mock.mock(DynamicFacetHeader);
    facet.header.options = {
      clear: () => {},
      collapse: () => {},
      expand: () => {},
      toggleCollapse: () => {},
      enableCollapse: facet.options.enableCollapse,
      title: facet.options.title
    };

    return facet;
  }

  static createAdvancedFakeFacet(options?: IDynamicHierarchicalFacetOptions, env?: Mock.IMockEnvironment) {
    return Mock.advancedComponentSetup<DynamicHierarchicalFacet>(DynamicHierarchicalFacet, <Mock.AdvancedComponentSetupOptions>{
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

  static getCompleteFacetResponse(facet: IDynamicHierarchicalFacet, partialResponse?: Partial<IFacetResponse>): IFacetResponse {
    return {
      facetId: facet.options.id,
      field: facet.fieldName,
      values: DynamicHierarchicalFacetTestUtils.createFakeFacetResponseValues(),
      moreValuesAvailable: false,
      ...partialResponse
    };
  }
}
