import { FacetSearchElement } from '../../src/ui/Facet/FacetSearchElement';
import { mock } from '../MockEnvironment';
import { FacetSearch } from '../../src/ui/Facet/FacetSearch';
import { $$ } from '../../src/utils/Dom';

export function FacetSearchElementTest() {
  describe('FacetSearchElement', () => {
    let facetSearchElement: FacetSearchElement;
    beforeEach(() => {
      facetSearchElement = new FacetSearchElement(mock(FacetSearch));
      facetSearchElement.build();
    });

    describe('when calling emptyAndShowNoResults', () => {
      let noResultsElement: HTMLElement;
      beforeEach(() => {
        facetSearchElement.emptyAndShowNoResults();
        [noResultsElement] = $$(facetSearchElement.searchResults).children();
      });

      it('searchResults contains a single element', () => {
        expect($$(facetSearchElement.searchResults).children().length).toEqual(1);
      });

      it('renders a noResults element as a HTMLLIElement', () => {
        expect(noResultsElement instanceof HTMLLIElement).toBeTruthy();
      });

      it('renders a noResults element with an id and a class', () => {
        expect($$(noResultsElement).hasClass('coveo-facet-value-not-found'));
        expect(noResultsElement.id.indexOf('coveo-facet-value-not-found')).toEqual(0);
      });

      it('renders an accessible noResults element', () => {
        expect(noResultsElement.getAttribute('role')).toEqual('option');
        expect(noResultsElement.tabIndex).toEqual(0);
      });

      it('selects the noResults element', () => {
        expect(facetSearchElement.input.getAttribute('aria-activedescendant')).toEqual(noResultsElement.id);
        expect(noResultsElement.getAttribute('aria-selected')).toEqual('true');
      });
    });
  });
}
