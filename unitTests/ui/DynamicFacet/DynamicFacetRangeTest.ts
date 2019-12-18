import * as Mock from '../../MockEnvironment';
import { DynamicFacetRange } from '../../../src/ui/DynamicFacet/DynamicFacetRange';
import { DynamicFacetRangeTestUtils } from './DynamicFacetRangeTestUtils';
import { FacetType } from '../../../src/rest/Facet/FacetRequest';
import { QueryStateModel } from '../../../src/Core';
import { RangeEndScope } from '../../../src/rest/RangeValue';
import { FacetSortCriteria } from '../../../src/rest/Facet/FacetSortCriteria';
import { IDynamicFacetRangeOptions, DynamicFacetRangeValueFormat } from '../../../src/ui/DynamicFacet/IDynamicFacetRange';

export function DynamicFacetRangeTest() {
  describe('DynamicFacetRange', () => {
    let test: Mock.IBasicComponentSetup<DynamicFacetRange>;
    let options: IDynamicFacetRangeOptions;

    beforeEach(() => {
      options = { field: '@field', ranges: [] };
      initializeComponent();
    });

    function initializeComponent() {
      test = DynamicFacetRangeTestUtils.createAdvancedFakeFacet(options);
      spyOn(test.cmp.logger, 'error');
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

    it('valueCaption option should be disabled', () => {
      options.valueCaption = { hello: 'bonjour' };
      initializeComponent();
      expect(test.cmp.options.valueCaption).toEqual({});
    });

    it('sortCriteria option should be disabled', () => {
      options.sortCriteria = FacetSortCriteria.score;
      initializeComponent();
      expect(test.cmp.options.sortCriteria).toBeUndefined();
    });

    it(`when the ranges option is not defined
      should not have values`, () => {
      expect(test.cmp.values.hasValues).toBe(false);
    });

    it(`when the ranges option is defined
      should have the right number of values`, () => {
      options.ranges = DynamicFacetRangeTestUtils.createFakeRanges();
      initializeComponent();
      expect(test.cmp.values.allFacetValues.length).toBe(options.ranges.length);
    });

    it(`when the valueFormat is date
      the facetType should be dateRange`, () => {
      options.valueFormat = DynamicFacetRangeValueFormat.date;
      initializeComponent();
      expect(test.cmp.facetType).toBe(FacetType.dateRange);
    });

    it(`when the valueFormat is number
      the facetType should be numericalRange`, () => {
      expect(test.cmp.facetType).toBe(FacetType.numericalRange);
    });

    it(`when the valueFormat is currency
      the facetType should be numericalRange`, () => {
      options.valueFormat = DynamicFacetRangeValueFormat.currency;
      initializeComponent();
      expect(test.cmp.facetType).toBe(FacetType.numericalRange);
    });

    it(`when not setting a valueFormat option
      should set it number`, () => {
      expect(test.cmp.options.valueFormat).toBe(DynamicFacetRangeValueFormat.number);
    });

    it(`when not setting an invalid valueFormat option
      should set it number`, () => {
      options.valueFormat = 'hello' as DynamicFacetRangeValueFormat;
      initializeComponent();
      expect(test.cmp.options.valueFormat).toBe(DynamicFacetRangeValueFormat.number);
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

    function updateQSM(value: string) {
      const id = QueryStateModel.getFacetId(test.cmp.options.id);
      test.cmp.queryStateModel.set(id, [value]);
    }

    describe('when updating directly the QSM', () => {
      it(`when using a valid range value
      should not throw an error`, () => {
        updateQSM(`1..10${RangeEndScope.Inclusive}`);
        expect(test.cmp.logger.error).not.toHaveBeenCalled();
      });

      it(`when not using a range value
      should throw an error`, () => {
        updateQSM('notARange');
        expect(test.cmp.logger.error).toHaveBeenCalled();
      });

      it(`when using a bad start value
      should throw an error`, () => {
        updateQSM(`yes..10${RangeEndScope.Inclusive}`);
        expect(test.cmp.logger.error).toHaveBeenCalled();
      });

      it(`when using a bad start end value
      should throw an error`, () => {
        updateQSM(`1..no${RangeEndScope.Inclusive}`);
        expect(test.cmp.logger.error).toHaveBeenCalled();
      });

      it(`when using a bad start endInclusive value
      should throw an error`, () => {
        updateQSM(`1..10out`);
        expect(test.cmp.logger.error).toHaveBeenCalled();
      });
    });
  });
}
