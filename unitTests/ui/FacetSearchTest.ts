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

      it('should hide facet search results', done => {
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
          facetSearch.dismissSearchResults();
          expect(allSearchResults().length).toBe(0);
          expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
          done();
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

          beforeEach(() => {
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
          });

          afterEach(() => {
            searchPromise = null;
          });

          it('arrow navigation', done => {
            searchPromise.then(() => {
              expect(getSearchResult(0).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(0).hasClass('coveo-facet-value-will-exclude')).toBe(false);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.DOWN_ARROW);
              expect(getSearchResult(0).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(0).hasClass('coveo-facet-value-will-exclude')).toBe(true);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.DOWN_ARROW);
              expect(getSearchResult(1).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(1).hasClass('coveo-facet-value-will-exclude')).toBe(false);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.DOWN_ARROW);
              expect(getSearchResult(1).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(1).hasClass('coveo-facet-value-will-exclude')).toBe(true);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.DOWN_ARROW);
              expect(getSearchResult(2).hasClass('coveo-facet-search-current-result')).toBe(true);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect(getSearchResult(1).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(1).hasClass('coveo-facet-value-will-exclude')).toBe(true);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect(getSearchResult(1).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(1).hasClass('coveo-facet-value-will-exclude')).toBe(false);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect(getSearchResult(0).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(0).hasClass('coveo-facet-value-will-exclude')).toBe(true);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect(getSearchResult(0).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(0).hasClass('coveo-facet-value-will-exclude')).toBe(false);

              // loop around !
              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect(getSearchResult(9).hasClass('coveo-facet-search-current-result')).toBe(true);
              expect(getSearchResult(9).hasClass('coveo-facet-value-will-exclude')).toBe(true);
              done();
            });
          });

          it(`when the first result is currently selected,
          when triggering the enter key,
          it triggers the checkbox #onChange handler`, done => {
            searchPromise.then(() => {
              const checkbox = spyOnAndReturnFirstCheckbox();
              const excludeIcon = spyOnAndReturnFirstExcludeIcon();

              triggerKeyboardEnter();

              expect(checkbox.onchange).toHaveBeenCalledTimes(1);
              expect(excludeIcon.click).not.toHaveBeenCalled();
              done();
            });
          });

          it(`when the first result is currently selected,
          when the first result is primed to be excluded (i.e. it has the class coveo-facet-value-will-exclude)
          when triggering the enter key,
          it triggers the excludeIcon #click handler`, done => {
            searchPromise.then(() => {
              getSearchResult(0).addClass('coveo-facet-value-will-exclude');

              const checkbox = spyOnAndReturnFirstCheckbox();
              const excludeIcon = spyOnAndReturnFirstExcludeIcon();

              triggerKeyboardEnter();

              expect(checkbox.onchange).not.toHaveBeenCalled();
              expect(excludeIcon.click).toHaveBeenCalledTimes(1);
              done();
            });
          });

          it('escape close results', done => {
            searchPromise.then(() => {
              expect(facetSearch.currentlyDisplayedResults.length).toBe(10);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.ESCAPE);

              expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
              done();
            });
          });

          it('other key should start a search', done => {
            Simulate.keyUp($$(built).find('input'), KEYBOARD.CTRL);
            setTimeout(() => {
              expect(facetSearch.facet.facetQueryController.search).toHaveBeenCalled();
              done();
            }, 55);
          });
        });
      }
    });
  });
}
