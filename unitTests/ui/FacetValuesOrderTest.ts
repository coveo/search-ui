import { FacetValuesOrder } from '../../src/ui/Facet/FacetValuesOrder';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetSort } from '../../src/ui/Facet/FacetSort';
import * as Mock from '../MockEnvironment';
import { FacetValue } from '../../src/ui/Facet/FacetValues';
import { IFacetSortDescription } from '../../src/ui/Facet/FacetSort';
import _ = require('underscore');

export function FacetValuesOrderTest() {
  describe('FacetValuesOrder', () => {
    let test: FacetValuesOrder;
    let mockFacet: Facet;
    let mockFacetSort: FacetSort;

    let expectEqualOrder = (ordered: FacetValue[], expecteds: string[]) => {
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
      let reordered = test.reorderValues([FacetValue.create('a'), FacetValue.create('b'), FacetValue.create('c')]);
      expectEqualOrder(reordered, ['c', 'a', 'b']);

      mockFacetSort.customSortDirection = 'descending';
      reordered = test.reorderValues([FacetValue.create('a'), FacetValue.create('b'), FacetValue.create('c')]);
      expectEqualOrder(reordered, ['b', 'a', 'c']);
    });

    it('should allow to sort facet values correctly with alpha sort and a value caption', () => {
      mockFacetSort.activeSort.name = 'alphaascending';
      mockFacet.options.valueCaption = {
        a: 'z',
        c: 'w'
      };
      mockFacet.getValueCaption = (facetValue: any) => {
        return mockFacet.options.valueCaption[facetValue.value] || facetValue.value;
      };

      let reordered = test.reorderValues([FacetValue.create('a'), FacetValue.create('b'), FacetValue.create('c')]);
      expectEqualOrder(reordered, ['b', 'c', 'a']);

      mockFacetSort.activeSort.name = 'alphadescending';
      reordered = test.reorderValues([FacetValue.create('a'), FacetValue.create('b'), FacetValue.create('c')]);
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
      mockFacet.getValueCaption = (facetValue: any) => {
        return mockFacet.options.valueCaption[facetValue.value] || facetValue.value;
      };

      let reordered = test.reorderValues([FacetValue.create('one'), FacetValue.create('two'), FacetValue.create('three')]);
      expectEqualOrder(reordered, ['one', 'three', 'two']);

      mockFacetSort.activeSort.name = 'alphadescending';
      reordered = test.reorderValues([FacetValue.create('one'), FacetValue.create('two'), FacetValue.create('three')]);
      expectEqualOrder(reordered, ['two', 'three', 'one']);
      String['locale'] = originalLocale;
    });
  });
}
