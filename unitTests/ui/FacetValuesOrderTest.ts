import { FacetValuesOrder } from '../../src/ui/Facet/FacetValuesOrder';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetSort } from '../../src/ui/Facet/FacetSort';
import * as Mock from '../MockEnvironment';
import { FacetValue } from '../../src/ui/Facet/FacetValue';
import { IFacetSortDescription } from '../../src/ui/Facet/FacetSort';
import _ = require('underscore');

export function FacetValuesOrderTest() {
  describe('FacetValuesOrder', () => {
    let test: FacetValuesOrder;
    let mockFacet: Facet;
    let mockFacetSort: FacetSort;

    const expectEqualOrder = (ordered: FacetValue[], expecteds: string[]) => {
      _.each(expecteds, (expected, i) => {
        expect(ordered[i]).toEqual(jasmine.objectContaining({ value: expected }));
      });
    };

    beforeEach(() => {
      mockFacet = Mock.mock<Facet>(Facet);
      mockFacet.options = {};

      mockFacetSort = Mock.mock<FacetSort>(FacetSort);
      mockFacetSort.activeSort = <IFacetSortDescription>{};

      test = new FacetValuesOrder(mockFacet, mockFacetSort);
    });

    afterEach(() => {
      test = null;
      mockFacet = null;
      mockFacetSort = null;
    });

    it('should allow to sort facet values correctly with custom sort', () => {
      mockFacetSort.activeSort.name = 'custom';
      mockFacetSort.customSortDirection = 'ascending';

      mockFacet.options.customSort = ['c', 'a', 'b'];
      const original = ['a', 'b', 'c'].map(FacetValue.create);
      let reordered = test.reorderValues(original);
      expectEqualOrder(reordered, ['c', 'a', 'b']);

      mockFacetSort.customSortDirection = 'descending';
      reordered = test.reorderValues(original);
      expectEqualOrder(reordered, ['b', 'a', 'c']);
    });

    it('should allow to sort facet values correctly with alpha sort and a value caption', () => {
      mockFacetSort.activeSort.name = 'alphaascending';
      mockFacet.options.valueCaption = {
        a: 'z',
        c: 'w'
      };
      mockFacet.getValueCaption = (facetValue: FacetValue) => {
        return mockFacet.options.valueCaption[facetValue.value] || facetValue.value;
      };

      const original = ['a', 'b', 'c'].map(FacetValue.create);
      let reordered = test.reorderValues(original);
      expectEqualOrder(reordered, ['b', 'c', 'a']);

      mockFacetSort.activeSort.name = 'alphadescending';
      reordered = test.reorderValues(original);
      expectEqualOrder(reordered, ['a', 'c', 'b']);
    });

    it('should allow to sort facet values correctly with alpha sort using locale compare', () => {
      const originalLocale = String['locale'];
      String['locale'] = 'fr';
      mockFacetSort.activeSort.name = 'alphaascending';
      mockFacet.options.valueCaption = {
        one: 'e',
        two: 'z',
        three: 'é'
      };
      mockFacet.getValueCaption = (facetValue: FacetValue) => {
        return mockFacet.options.valueCaption[facetValue.value] || facetValue.value;
      };

      const original = ['one', 'two', 'three'].map(FacetValue.create);
      let reordered = test.reorderValues(original);
      expectEqualOrder(reordered, ['one', 'three', 'two']);

      mockFacetSort.activeSort.name = 'alphadescending';
      reordered = test.reorderValues(original);
      expectEqualOrder(reordered, ['two', 'three', 'one']);
      String['locale'] = originalLocale;
    });

    it(`when the activeSort name is 'custom' and the customSort facet option is defined,
    reorderValuesIfUsingCustomSort changes the order`, () => {
      mockFacetSort.activeSort.name = 'custom';
      mockFacetSort.customSortDirection = 'ascending';
      mockFacet.options.customSort = ['b'];

      const original = ['a', 'b'].map(FacetValue.create);
      const reordered = test.reorderValuesIfUsingCustomSort(original);

      expectEqualOrder(reordered, ['b', 'a']);
    });

    it(`when the activeSort name is 'custom' and the customSort facet option is undefined,
    reorderValuesIfUsingCustomSort does not change the order`, () => {
      mockFacetSort.activeSort.name = 'custom';

      const original = ['a', 'b'];
      const values = original.map(FacetValue.create);
      const reordered = test.reorderValuesIfUsingCustomSort(values);

      expectEqualOrder(reordered, original);
    });

    it(`when the activeSort name is not 'custom' and the customSort facet option is defined,
    reorderValuesIfUsingCustomSort does not change the order`, () => {
      mockFacetSort.activeSort.name = 'occurences';
      mockFacet.options.customSort = ['b'];

      const original = ['a', 'b'];
      const values = original.map(FacetValue.create);
      const reordered = test.reorderValuesIfUsingCustomSort(values);

      expectEqualOrder(reordered, original);
    });

    it(`when the activeSort name contains 'alpha',
    reorderValuesIfUsingAlphabeticalSort changes the order`, () => {
      mockFacetSort.activeSort.name = 'alphaascending';
      mockFacet.getValueCaption = (fv: FacetValue) => fv.value;

      const original = ['b', 'a'];
      const values = original.map(FacetValue.create);
      const reordered = test.reorderValuesIfUsingAlphabeticalSort(values);

      expectEqualOrder(reordered, ['a', 'b']);
    });

    it(`when the activeSort name does not contain 'alpha',
    reorderValuesIfUsingAlphabeticalSort does not change the order`, () => {
      mockFacetSort.activeSort.name = 'ascending';

      const original = ['b', 'a'];
      const values = original.map(FacetValue.create);
      const reordered = test.reorderValuesIfUsingAlphabeticalSort(values);

      expectEqualOrder(reordered, original);
    });
  });
}
