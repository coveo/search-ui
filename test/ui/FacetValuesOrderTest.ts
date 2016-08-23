import {FacetValuesOrder} from "../../src/ui/Facet/FacetValuesOrder";
import {Facet} from '../../src/ui/Facet/Facet';
import {FacetSort} from '../../src/ui/Facet/FacetSort';
import * as Mock from '../MockEnvironment';
import {FacetValue} from '../../src/ui/Facet/FacetValues';
import {IFacetSortDescription} from '../../src/ui/Facet/FacetSort';

export function FacetValuesOrderTest() {
  describe('FacetValuesOrder', () => {
    let test: FacetValuesOrder;
    let mockFacet: Facet;
    let mockFacetSort: FacetSort;

    beforeEach(() => {
      mockFacet = Mock.mock<Facet>(Facet);
      mockFacet.options = {};

      mockFacetSort = Mock.mock<FacetSort>(FacetSort);
      mockFacetSort.activeSort = <IFacetSortDescription>{};

      test = new FacetValuesOrder(mockFacet, mockFacetSort);
    })

    afterEach(() => {
      test = null;
      mockFacet = null;
      mockFacetSort = null;
    })

    it('should allow to sort facet values correctly with custom sort', () => {

      mockFacetSort.activeSort.name = 'custom';
      mockFacetSort.customSortDirection = 'ascending';

      mockFacet.options.customSort = ['c', 'a', 'b'];
      let reordered = test.reorderValues([FacetValue.create('a'), FacetValue.create('b'), FacetValue.create('c')]);
      expect(reordered[0]).toEqual(jasmine.objectContaining({ value: 'c' }));
      expect(reordered[1]).toEqual(jasmine.objectContaining({ value: 'a' }));
      expect(reordered[2]).toEqual(jasmine.objectContaining({ value: 'b' }));

      mockFacetSort.customSortDirection = 'descending';
      reordered = test.reorderValues([FacetValue.create('a'), FacetValue.create('b'), FacetValue.create('c')]);
      expect(reordered[0]).toEqual(jasmine.objectContaining({ value: 'b' }));
      expect(reordered[1]).toEqual(jasmine.objectContaining({ value: 'a' }));
      expect(reordered[2]).toEqual(jasmine.objectContaining({ value: 'c' }));
    })

    it('should allow to sort facet values correctly with alpha sort and a value caption', () => {
      mockFacetSort.activeSort.name = 'alphaascending';
      mockFacet.options.valueCaption = {
        'a': 'z',
        'c': 'w'
      }
      mockFacet.getValueCaption = (facetValue: any) => {
        return mockFacet.options.valueCaption[facetValue.value] || facetValue.value;
      }

      let reordered = test.reorderValues([FacetValue.create('a'), FacetValue.create('b'), FacetValue.create('c')]);
      expect(reordered[0]).toEqual(jasmine.objectContaining({ value: 'b' }));
      expect(reordered[1]).toEqual(jasmine.objectContaining({ value: 'c' }));
      expect(reordered[2]).toEqual(jasmine.objectContaining({ value: 'a' }));

      mockFacetSort.activeSort.name = 'alphadescending';
      reordered = test.reorderValues([FacetValue.create('a'), FacetValue.create('b'), FacetValue.create('c')]);
      expect(reordered[0]).toEqual(jasmine.objectContaining({ value: 'a' }));
      expect(reordered[1]).toEqual(jasmine.objectContaining({ value: 'c' }));
      expect(reordered[2]).toEqual(jasmine.objectContaining({ value: 'b' }));
    })
  })
}
