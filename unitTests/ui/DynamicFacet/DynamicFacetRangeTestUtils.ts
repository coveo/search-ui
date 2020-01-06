import { IRangeValue } from '../../../src/rest/RangeValue';
import * as Mock from '../../MockEnvironment';
import { DynamicFacetRange } from '../../../src/ui/DynamicFacet/DynamicFacetRange';
import { DynamicFacetValues } from '../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValues';
import { DynamicFacetRangeValueCreator } from '../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetRangeValueCreator';
import { $$, Logger } from '../../../src/Core';
import { IFacetResponse, IFacetResponseValue } from '../../../src/rest/Facet/FacetResponse';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import { IDynamicFacetRangeOptions, DynamicFacetRangeValueFormat } from '../../../src/ui/DynamicFacet/IDynamicFacetRange';

export class DynamicFacetRangeTestUtils {
  static allOptions(options?: IDynamicFacetRangeOptions) {
    return {
      field: '@dummy',
      ...options
    };
  }

  static createFakeFacet(options?: IDynamicFacetRangeOptions) {
    const facet = Mock.mockComponent<DynamicFacetRange>(DynamicFacetRange);
    facet.logger = Mock.mock(Logger);
    facet.options = this.allOptions({
      valueFormat: DynamicFacetRangeValueFormat.number,
      valueSeparator: 'to',
      ...options
    });
    facet.values = new DynamicFacetValues(facet, DynamicFacetRangeValueCreator);
    facet.element = $$('div').el;
    facet.searchInterface = Mock.mockSearchInterface();

    return facet;
  }

  static createAdvancedFakeFacet(options?: IDynamicFacetRangeOptions, withQSM = true) {
    return Mock.advancedComponentSetup<DynamicFacetRange>(DynamicFacetRange, <Mock.AdvancedComponentSetupOptions>{
      modifyBuilder: builder => {
        return withQSM ? builder.withLiveQueryStateModel() : builder;
      },
      cmpOptions: this.allOptions(options)
    });
  }

  static createFakeRanges(count = 8, step = 100, endInclusive = false) {
    const ranges: IRangeValue[] = [];
    for (let index = 0; index < count; index++) {
      ranges.push({
        start: step * index,
        end: step * (index + 1),
        endInclusive
      });
    }

    return ranges;
  }

  static getCompleteFacetResponse(facet: DynamicFacetRange, partialResponse?: Partial<IFacetResponse>): IFacetResponse {
    const facetValues: IFacetResponseValue[] = this.createFakeRanges().map(facetValue => ({
      ...facetValue,
      state: FacetValueState.idle,
      numberOfResults: 10
    }));

    return {
      facetId: facet.options.id,
      field: facet.fieldName,
      values: facetValues,
      moreValuesAvailable: false,
      ...partialResponse
    };
  }
}
