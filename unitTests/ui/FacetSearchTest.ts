import { FacetQueryController } from '../../src/controllers/FacetQueryController';
import { IIndexFieldValue } from '../../src/rest/FieldValue';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetSearch } from '../../src/ui/Facet/FacetSearch';
import { FacetSearchParameters } from '../../src/ui/Facet/FacetSearchParameters';
import { FacetSearchValuesList } from '../../src/ui/Facet/FacetSearchValuesList';
import { $$ } from '../../src/utils/Dom';
import { KEYBOARD } from '../../src/utils/KeyboardUtils';
import { FakeResults, Mock, Simulate } from '../../testsFramework/TestsFramework';

export function FacetSearchTest() {
  describe('FacetSearch', function() {
    let mockFacet: Facet;
    let facetSearch: FacetSearch;

    beforeEach(function() {
      let options = {
        field: '@field'
      };
      Simulate.removeJQuery();
      mockFacet = Mock.basicComponentSetup<Facet>(Facet, options).cmp;
      mockFacet.searchInterface = <any>{};
      facetSearch = new FacetSearch(mockFacet, FacetSearchValuesList, mockFacet.root);
    });

    afterEach(function() {
      mockFacet = null;
      facetSearch = null;
    });

    it('input should have correct attributes', function() {
      const built = facetSearch.build();
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

    describe('perform search on the index', function() {
      beforeEach(function() {
        mockFacet.facetQueryController = Mock.mock<FacetQueryController>(FacetQueryController);
        facetSearch.build();
      });

      afterEach(function() {
        mockFacet = null;
        facetSearch = null;
      });

      it('should display facet search results', function(done) {
        const pr = new Promise((resolve, reject) => {
          const results = FakeResults.createFakeFieldValues('foo', 10);
          resolve(results);
        });

        (<jasmine.Spy>mockFacet.facetQueryController.search).and.returnValue(pr);

        const params = new FacetSearchParameters(mockFacet);
        expect($$(facetSearch.searchResults).findAll('li').length).toBe(0);
        expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
        facetSearch.triggerNewFacetSearch(params);
        pr.then(() => {
          expect($$(facetSearch.searchResults).findAll('li').length).toBe(10);
          expect(facetSearch.currentlyDisplayedResults.length).toBe(10);
          done();
        });
      });

      it('should hide facet search results', function(done) {
        const pr = new Promise((resolve, reject) => {
          const results = FakeResults.createFakeFieldValues('foo', 10);
          resolve(results);
        });

        (<jasmine.Spy>mockFacet.facetQueryController.search).and.returnValue(pr);

        const params = new FacetSearchParameters(mockFacet);
        expect($$(facetSearch.searchResults).findAll('li').length).toBe(0);
        expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
        facetSearch.triggerNewFacetSearch(params);
        pr.then(() => {
          expect($$(facetSearch.searchResults).findAll('li').length).toBe(10);
          expect(facetSearch.currentlyDisplayedResults.length).toBe(10);
          facetSearch.completelyDismissSearch();
          expect($$(facetSearch.searchResults).findAll('li').length).toBe(0);
          expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
          done();
        });
      });

      it('should handle error', function(done) {
        const pr = new Promise((resolve, reject) => {
          reject(new Error('woops !'));
        });

        (<jasmine.Spy>mockFacet.facetQueryController.search).and.returnValue(pr);

        const params = new FacetSearchParameters(mockFacet);
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
        describe('hook user events', function() {
          let searchPromise: Promise<IIndexFieldValue[]>;
          let built: HTMLElement;
          beforeEach(function() {
            Simulate.removeJQuery();
            mockFacet.options.facetSearchDelay = 50;
            searchPromise = new Promise((resolve, reject) => {
              const results = FakeResults.createFakeFieldValues('foo', 10);
              resolve(results);
            });

            (<jasmine.Spy>mockFacet.facetQueryController.search).and.returnValue(searchPromise);

            built = facetSearch.build();
            const params = new FacetSearchParameters(mockFacet);
            facetSearch.triggerNewFacetSearch(params);
          });

          afterEach(function() {
            searchPromise = null;
          });

          it('arrow navigation', function(done) {
            searchPromise.then(() => {
              expect($$($$(facetSearch.searchResults).findAll('li')[0]).hasClass('coveo-current')).toBe(true);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.DOWN_ARROW);
              expect($$($$(facetSearch.searchResults).findAll('li')[1]).hasClass('coveo-current')).toBe(true);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.DOWN_ARROW);
              expect($$($$(facetSearch.searchResults).findAll('li')[2]).hasClass('coveo-current')).toBe(true);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect($$($$(facetSearch.searchResults).findAll('li')[1]).hasClass('coveo-current')).toBe(true);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect($$($$(facetSearch.searchResults).findAll('li')[0]).hasClass('coveo-current')).toBe(true);

              // loop around !
              Simulate.keyUp($$(built).find('input'), KEYBOARD.UP_ARROW);
              expect($$($$(facetSearch.searchResults).findAll('li')[9]).hasClass('coveo-current')).toBe(true);
              done();
            });
          });

          it('escape close results', function(done) {
            searchPromise.then(() => {
              expect(facetSearch.currentlyDisplayedResults.length).toBe(10);

              Simulate.keyUp($$(built).find('input'), KEYBOARD.ESCAPE);

              expect(facetSearch.currentlyDisplayedResults).toBeUndefined();
              done();
            });
          });

          it('other key should start a search', function(done) {
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
