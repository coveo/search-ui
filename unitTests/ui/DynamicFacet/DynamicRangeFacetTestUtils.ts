import { IRangeValue } from '../../../src/rest/RangeValue';
import * as Mock from '../../MockEnvironment';
import { DynamicRangeFacet, IDynamicRangeFacetOptions } from '../../../src/ui/DynamicFacet/DynamicRangeFacet';
import { DynamicFacetValues } from '../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValues';
import { DynamicRangeFacetValueCreator } from '../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicRangeFacetValueCreator';
import { $$ } from '../../../src/Core';

export class DynamicRangeFacetTestUtils {
  static allOptions(options?: IDynamicRangeFacetOptions) {
    return {
      field: '@dummy',
      valueSeparator: 'to',
      ...options
    };
  }

  static createFakeFacet(options?: IDynamicRangeFacetOptions) {
    const facet = Mock.mockComponent<DynamicRangeFacet>(DynamicRangeFacet);
    facet.options = this.allOptions(options);
    facet.values = new DynamicFacetValues(facet, DynamicRangeFacetValueCreator);
    facet.element = $$('div').el;
    facet.searchInterface = Mock.mockSearchInterface();

    return facet;
  }

  static createAdvancedFakeFacet(options?: IDynamicRangeFacetOptions, withQSM = true) {
    return Mock.advancedComponentSetup<DynamicRangeFacet>(DynamicRangeFacet, <Mock.AdvancedComponentSetupOptions>{
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
}
