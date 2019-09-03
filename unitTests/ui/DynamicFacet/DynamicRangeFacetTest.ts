import * as Mock from '../../MockEnvironment';
import { DynamicRangeFacet, IDynamicRangeFacetOptions, DynamicRangeFacetValueFormat } from '../../../src/ui/DynamicFacet/DynamicRangeFacet';
import { DynamicRangeFacetTestUtils } from './DynamicRangeFacetTestUtils';
import { FacetType } from '../../../src/rest/Facet/FacetRequest';

export function DynamicRangeFacetTest() {
  describe('DynamicRangeFacet', () => {
    let test: Mock.IBasicComponentSetup<DynamicRangeFacet>;
    let options: IDynamicRangeFacetOptions;

    beforeEach(() => {
      options = { field: '@field' };
      initializeComponent();
    });

    function initializeComponent() {
      test = DynamicRangeFacetTestUtils.createAdvancedFakeFacet(options);
      spyOn(test.cmp.logger, 'warn');
    }

    it('facet search options should be disabled', () => {
      options.enableFacetSearch = true;
      options.useLeadingWildcardInFacetSearch = true;
      initializeComponent();
      expect(test.cmp.options.enableFacetSearch).toBe(false);
      expect(test.cmp.options.useLeadingWildcardInFacetSearch).toBe(false);
    });

    it('enableMoreLess option should be disabled', () => {
      options.enableMoreLess = true;
      initializeComponent();
      expect(test.cmp.options.enableMoreLess).toBe(false);
    });

    it('enableMoreLess option should be disabled', () => {
      options.valueCaption = { hello: 'bonjour' };
      initializeComponent();
      expect(test.cmp.options.valueCaption).toEqual({});
    });

    it(`when the ranges option is not defined
      should not have values`, () => {
      expect(test.cmp.values.isEmpty).toBe(true);
    });

    it(`when the ranges option is defined
      should have the right number of values`, () => {
      options.ranges = DynamicRangeFacetTestUtils.createFakeRanges();
      initializeComponent();
      expect(test.cmp.values.allFacetValues.length).toBe(options.ranges.length);
    });

    it(`when the valueFormat is date
      the facetType should be dateRange`, () => {
      options.valueFormat = DynamicRangeFacetValueFormat.date;
      initializeComponent();
      expect(test.cmp.facetType).toBe(FacetType.dateRange);
    });

    it(`when the valueFormat is number
      the facetType should be numericalRange`, () => {
      expect(test.cmp.facetType).toBe(FacetType.numericalRange);
    });

    it(`when calling showMoreValues
      it should throw a warning`, () => {
      test.cmp.showMoreValues();

      expect(test.cmp.logger.warn).toHaveBeenCalled();
    });

    it(`when calling showLessValues
      it should throw a warning`, () => {
      test.cmp.showLessValues();

      expect(test.cmp.logger.warn).toHaveBeenCalled();
    });

    it(`when calling triggerNewIsolatedQuery
      it should throw a warning`, () => {
      test.cmp.triggerNewIsolatedQuery();

      expect(test.cmp.logger.warn).toHaveBeenCalled();
    });
  });
}
