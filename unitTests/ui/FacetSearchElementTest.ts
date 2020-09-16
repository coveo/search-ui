import { FacetSearchElement } from '../../src/ui/Facet/FacetSearchElement';
import { mock } from '../MockEnvironment';
import { FacetSearch } from '../../src/ui/Facet/FacetSearch';
import { $$ } from '../../src/utils/Dom';
import { l } from '../../src/Core';

export function FacetSearchElementTest() {
  describe('FacetSearchElement', () => {
    let facetSearch: FacetSearch;
    let facetSearchElement: FacetSearchElement;
    beforeEach(() => {
      facetSearch = mock(FacetSearch);
      facetSearchElement = new FacetSearchElement(facetSearch);
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
        expect($$(noResultsElement).hasClass('coveo-facet-value-not-found')).toBeTruthy();
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

      it(`should update AriaLive with the text: "No values found"`, () => {
        expect(facetSearch.updateAriaLive).toHaveBeenCalledWith(l('NoValuesFound'));
      });
    });

    describe('when calling updateAriaLiveWithResults', () => {
      it(`when there is a non empty query
      should update AriaLive with the text: "{X} result(s) for {query}..."`, () => {
        facetSearchElement.updateAriaLiveWithResults('query', 10, false);
        expect(facetSearch.updateAriaLive).toHaveBeenCalledWith(l('ShowingResultsWithQuery', 10, 'query', 10));
      });

      it(`when there is an empty query
      should update AriaLive with the text: "{X} result(s)..."`, () => {
        facetSearchElement.updateAriaLiveWithResults('', 10, false);
        expect(facetSearch.updateAriaLive).toHaveBeenCalledWith(l('ShowingResults', 10, 10));
      });

      it(`when there are more values to fetch
      should update AriaLive with the text "More values are available." appended`, () => {
        facetSearchElement.updateAriaLiveWithResults('', 10, true);
        expect(facetSearch.updateAriaLive).toHaveBeenCalledWith(`${l('ShowingResults', 10, 10)}. ${l('MoreValuesAvailable')}`);
      });
    });
  });
}
