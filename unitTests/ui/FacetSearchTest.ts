import * as Mock from '../MockEnvironment';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetSearch } from '../../src/ui/Facet/FacetSearch';
import { FacetSearchValuesList } from '../../src/ui/Facet/FacetSearchValuesList';
import { $$ } from '../../src/utils/Dom';
import { FacetQueryController } from '../../src/controllers/FacetQueryController';
import { FakeResults } from '../Fake';
import { FacetSearchParameters } from '../../src/ui/Facet/FacetSearchParameters';
import { IIndexFieldValue } from '../../src/rest/FieldValue';
import { Simulate } from '../Simulate';
import { KEYBOARD } from '../../src/utils/KeyboardUtils';

export function FacetSearchTest() {
  describe('FacetSearch', () => {
    var mockFacet: Facet;
    var facetSearch: FacetSearch;

    function allSearchResults() {
      return $$(facetSearch.searchResults).findAll('li');
    }

    function getSearchResult(index: number) {
      const listItem = allSearchResults()[index];
      return $$(listItem);
    }

    beforeEach(() => {
      let options = {
        field: '@field'
      };
      Simulate.removeJQuery();
      mockFacet = Mock.basicComponentSetup<Facet>(Facet, options).cmp;
      facetSearch = new FacetSearch(mockFacet, FacetSearchValuesList, mockFacet.root);
    });

    afterEach(() => {
      mockFacet = null;
      facetSearch = null;
    });

    it('input should have correct attributes', () => {
      var built = facetSearch.build();
      expect(
        $$(built)
          .find('input')
          .getAttribute('autocapitalize')
      ).toBe('off');
      expect(
        $$(built)
          .find('input')
          .getAttribute('autocorrect')
      ).toBe('off');
      expect(
        $$(built)
          .find('input')
          .getAttribute('form')
      ).toBe('coveo-dummy-form');
    });

    describe('perform search on the index', () => {
      beforeEach(() => {
        mockFacet.facetQueryController = Mock.mock<FacetQueryController>(FacetQueryController);
        facetSearch.build();
      });

      afterEach(() => {
        mockFacet = null;
        facetSearch = null;
      });

      it('should display facet search results', done => {
        var pr = new Promise((resolve, reject) => {
          var results = FakeResults.createFakeFieldValues('foo', 10);
          resolve(results);
        });

        (<jasmine.Spy>mockFacet.facetQueryController.search).and.returnValue(pr);

        var params = new FacetSearchParameters(mockFacet);
        expect(allSearchResults().length).toBe(0);
        expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
        facetSearch.triggerNewFacetSearch(params);
        pr.then(() => {
          expect(allSearchResults().length).toBe(10);
          expect(facetSearch.currentlyDisplayedResults.length).toBe(10);
          done();
        });
      });

      describe('when calling focus', () => {
        it("should update the accessible element's accessibility properties", () => {
          const setExpandedFacetSearchAccessibilityAttributes = spyOn(facetSearch, 'setExpandedFacetSearchAccessibilityAttributes');
          facetSearch.focus();
          expect(setExpandedFacetSearchAccessibilityAttributes).toHaveBeenCalledTimes(1);
          expect(setExpandedFacetSearchAccessibilityAttributes).toHaveBeenCalledWith(facetSearch.facetSearchElement['searchResults']);
        });
      });

      describe('when triggering a query', () => {
        beforeEach(async done => {
          const pr = new Promise((resolve, reject) => {
            const results = FakeResults.createFakeFieldValues('foo', 10);
            resolve(results);
          });

          (<jasmine.Spy>mockFacet.facetQueryController.search).and.returnValue(pr);

          var params = new FacetSearchParameters(mockFacet);
          expect(allSearchResults().length).toBe(0);
          expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
          facetSearch.triggerNewFacetSearch(params);
          await pr;
          done();
        });

        describe('and calling dismissSearchResults', () => {
          it('should hide facet search results', done => {
            expect(allSearchResults().length).toBe(10);
            expect(facetSearch.currentlyDisplayedResults.length).toBe(10);
            facetSearch.dismissSearchResults();
            expect(allSearchResults().length).toBe(0);
            expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
            done();
          });

          it("should update the accessible element's accessibility properties", () => {
            const setCollapsedFacetSearchAccessibilityAttributes = spyOn(facetSearch, 'setCollapsedFacetSearchAccessibilityAttributes');
            facetSearch.dismissSearchResults();
            expect(setCollapsedFacetSearchAccessibilityAttributes).toHaveBeenCalledTimes(1);
          });
        });
      });

      it('should handle error', done => {
        var pr = new Promise((resolve, reject) => {
          reject(new Error('woops !'));
        });

        (<jasmine.Spy>mockFacet.facetQueryController.search).and.returnValue(pr);

        var params = new FacetSearchParameters(mockFacet);
        facetSearch.triggerNewFacetSearch(params);
        expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
        pr.catch(() => {
          expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
          done();
        });
      });

      // KeyboardEvent simulation does not work well in phantom js
      // The KeyboardEvent constructor is not even defined ...
      if (!Simulate.isPhantomJs()) {
        describe('hook user events', () => {
          let searchPromise: Promise<IIndexFieldValue[]>;
          let built: HTMLElement;

          function spyOnAndReturnFirstCheckbox() {
            const checkbox = $$(facetSearch.searchResults).find('input[type="checkbox"]');
            spyOn(checkbox, 'onchange');
            return checkbox;
          }

          function spyOnAndReturnFirstExcludeIcon() {
            const excludeIcon = $$(facetSearch.searchResults).find('.coveo-facet-value-exclude');
            spyOn(excludeIcon, 'click');
            return excludeIcon;
          }

          function triggerKeyboardEnter() {
            const enterKeyPress = new KeyboardEvent('keypress');
            facetSearch.keyboardNavigationEnterPressed(enterKeyPress);
          }

          beforeEach(async done => {
            Simulate.removeJQuery();
            mockFacet.options.facetSearchDelay = 50;
            searchPromise = new Promise((resolve, reject) => {
              var results = FakeResults.createFakeFieldValues('foo', 10);
              resolve(results);
            });

            (<jasmine.Spy>mockFacet.facetQueryController.search).and.returnValue(searchPromise);

            built = facetSearch.build();
            var params = new FacetSearchParameters(mockFacet);
            facetSearch.triggerNewFacetSearch(params);
            await searchPromise;
            done();
          });

          afterEach(() => (searchPromise = null));

          it('by default, the first result is set as the current result', () => {
            expect(getSearchResult(0).hasClass('coveo-facet-search-current-result')).toBe(true);
            expect(getSearchResult(0).hasClass('coveo-facet-value-will-exclude')).toBe(false);
          });

          it('pressing the down arrow once primes the result to be excluded', () => {
            Simulate.keyUp($$(built).find('input'), KEYBOARD.DOWN_ARROW);
            expect(getSearchResult(0).hasClass('coveo-facet-search-current-result')).toBe(true);
            expect(getSearchResult(0).hasClass('coveo-facet-value-will-exclude')).toBe(true);
          });

          it('pressing the up arrow once loops around and primes the last result to be excluded', () => {
            Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
            expect(getSearchResult(9).hasClass('coveo-facet-search-current-result')).toBe(true);
            expect(getSearchResult(9).hasClass('coveo-facet-value-will-exclude')).toBe(true);
          });

          describe('pressing the down arrow once twice', () => {
            beforeEach(() => {
              Simulate.keyUp($$(built).find('input'), KEYBOARD.DOWN_ARROW);
              Simulate.keyUp($$(built).find('input'), KEYBOARD.DOWN_ARROW);
            });

            it('it sets the second result as the current result', () => {
              expect(getSearchResult(1).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(1).hasClass('coveo-facet-value-will-exclude')).toBe(false);
            });

            it('when pressing the up arrow once, it primes the first result to be excluded', () => {
              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect(getSearchResult(0).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(0).hasClass('coveo-facet-value-will-exclude')).toBe(true);
            });

            it('when pressing the up arrow twice, it primes the first result to be selected', () => {
              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect(getSearchResult(0).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(0).hasClass('coveo-facet-value-will-exclude')).toBe(false);
            });
          });

          it(`when the first result is currently selected,
          when triggering the enter key,
          it triggers the checkbox #onChange handler`, () => {
            const checkbox = spyOnAndReturnFirstCheckbox();
            const excludeIcon = spyOnAndReturnFirstExcludeIcon();

            triggerKeyboardEnter();

            expect(checkbox.onchange).toHaveBeenCalledTimes(1);
            expect(excludeIcon.click).not.toHaveBeenCalled();
          });

          it(`when the first result is currently selected,
          when the first result is primed to be excluded (i.e. it has the class coveo-facet-value-will-exclude)
          when triggering the enter key,
          it triggers the excludeIcon #click handler`, () => {
            getSearchResult(0).addClass('coveo-facet-value-will-exclude');

            const checkbox = spyOnAndReturnFirstCheckbox();
            const excludeIcon = spyOnAndReturnFirstExcludeIcon();

            triggerKeyboardEnter();

            expect(checkbox.onchange).not.toHaveBeenCalled();
            expect(excludeIcon.click).toHaveBeenCalledTimes(1);
          });

          it('escape close results', () => {
            expect(facetSearch.currentlyDisplayedResults.length).toBe(10);

            Simulate.keyUp($$(built).find('input'), KEYBOARD.ESCAPE);

            expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
          });

          it('other key should start a search', () => {
            Simulate.keyUp($$(built).find('input'), KEYBOARD.CTRL);
            expect(facetSearch.facet.facetQueryController.search).toHaveBeenCalled();
          });
        });
      }
    });
  });
}
