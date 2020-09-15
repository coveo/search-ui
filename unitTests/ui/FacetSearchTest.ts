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
import { l } from '../../src/strings/Strings';

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

    function searchWithValues(values: IIndexFieldValue[]) {
      const promise = Promise.resolve(values);
      (mockFacet.facetQueryController.search as jasmine.Spy).and.returnValue(promise);
      return promise;
    }

    function searchWithError(error: Error) {
      const promise = Promise.reject(error);
      (mockFacet.facetQueryController.search as jasmine.Spy).and.returnValue(promise);
      return promise;
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
        const pr = searchWithValues(FakeResults.createFakeFieldValues('foo', 10));

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
        let setExpandedFacetSearchAccessibilityAttributes: jasmine.Spy;
        let facetSearchId: string;
        beforeEach(() => {
          setExpandedFacetSearchAccessibilityAttributes = spyOn(facetSearch, 'setExpandedFacetSearchAccessibilityAttributes');
          facetSearchId = facetSearch.facetSearchElement['facetSearchId'];
          facetSearch.focus();
        });

        it("should update the accessible element's accessibility properties", () => {
          expect(setExpandedFacetSearchAccessibilityAttributes).toHaveBeenCalledTimes(1);
          expect(setExpandedFacetSearchAccessibilityAttributes).toHaveBeenCalledWith(facetSearch.facetSearchElement['searchResults']);
        });

        it('should give the "combobox" role to the combobox', () => {
          expect(facetSearch.facetSearchElement.combobox.getAttribute('role')).toEqual('combobox');
        });

        it('should give the combobox the aria-owns attribute', () => {
          expect(facetSearch.facetSearchElement.combobox.getAttribute('aria-owns')).toEqual(facetSearchId);
        });

        it('should give the input the aria-controls attribute', () => {
          expect(facetSearch.facetSearchElement.input.getAttribute('aria-controls')).toEqual(facetSearchId);
        });

        it("should set aria-expanded to true on the input's element", () => {
          expect(facetSearch.facetSearchElement.input.getAttribute('aria-expanded')).toEqual('true');
        });
      });

      describe('when triggering a query', () => {
        beforeEach(async done => {
          const pr = searchWithValues(FakeResults.createFakeFieldValues('foo', 10));

          $$('div').append(facetSearch.search);
          var params = new FacetSearchParameters(mockFacet);
          expect(allSearchResults().length).toBe(0);
          expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
          facetSearch.triggerNewFacetSearch(params);
          await pr;
          done();
        });

        it('should have displayed results', () => {
          expect(allSearchResults().length).toBe(10);
          expect(facetSearch.currentlyDisplayedResults.length).toBe(10);
        });

        it('should append search results immediately after the search box', () => {
          const { search, searchResults } = facetSearch.facetSearchElement;
          expect(search.nextSibling).toBe(searchResults);
        });

        describe('and calling dismissSearchResults', () => {
          let setCollapsedFacetSearchAccessibilityAttributes: jasmine.Spy;
          beforeEach(() => {
            setCollapsedFacetSearchAccessibilityAttributes = spyOn(facetSearch, 'setCollapsedFacetSearchAccessibilityAttributes');
            facetSearch.dismissSearchResults();
          });

          it('should hide facet search results', done => {
            expect(allSearchResults().length).toBe(0);
            expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
            done();
          });

          it("should update the accessible element's accessibility properties", () => {
            expect(setCollapsedFacetSearchAccessibilityAttributes).toHaveBeenCalledTimes(1);
          });

          it("should remove the combobox's aria-owns attribute", () => {
            expect(facetSearch.facetSearchElement.combobox.getAttribute('aria-owns')).toBeNull();
          });

          it("should remove the input's aria-controls attribute", () => {
            expect(facetSearch.facetSearchElement.input.getAttribute('aria-controls')).toBeNull();
          });

          it("should set aria-expanded to false on the input's element", () => {
            expect(facetSearch.facetSearchElement.input.getAttribute('aria-expanded')).toEqual('false');
          });
        });
      });

      describe('when triggering a query with no results', () => {
        beforeEach(async done => {
          const pr = searchWithValues([]);

          $$('div').append(facetSearch.search);
          var params = new FacetSearchParameters(mockFacet);
          expect(allSearchResults().length).toBe(0);
          expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
          facetSearch.triggerNewFacetSearch(params);
          await pr;
          done();
        });

        it("should set aria-expanded to true on the input's element", () => {
          expect(facetSearch.facetSearchElement.input.getAttribute('aria-expanded')).toEqual('true');
        });

        it('should contain only a "no values found" element', () => {
          expect(
            $$(facetSearch.searchResults)
              .children()
              .map(result => result.innerText)
          ).toEqual([l('NoValuesFound')]);
        });
      });

      it('should handle error', done => {
        const pr = searchWithError(new Error('woops !'));

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
