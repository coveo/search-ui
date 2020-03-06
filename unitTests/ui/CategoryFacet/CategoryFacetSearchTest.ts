import { CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import { mock, basicComponentSetup } from '../../MockEnvironment';
import { FakeResults } from '../../Fake';
import { CategoryFacetSearch } from '../../../src/ui/CategoryFacet/CategoryFacetSearch';
import { CategoryFacetQueryController } from '../../../src/controllers/CategoryFacetQueryController';
import _ = require('underscore');
import { IGroupByValue } from '../../../src/rest/GroupByValue';
import { $$ } from '../../../src/Core';
import { KEYBOARD } from '../../../src/utils/KeyboardUtils';
import { analyticsActionCauseList } from '../../../src/ui/Analytics/AnalyticsActionListMeta';

export function CategoryFacetSearchTest() {
  describe('CategoryFacetSearch', () => {
    const noResultsClass = 'coveo-no-results';
    const facetSearchNoResultsClass = 'coveo-facet-search-no-results';
    const categoryFacetTitle = 'abcdef';
    let categoryFacetMock: CategoryFacet;
    let categoryFacetSearch: CategoryFacetSearch;
    let realDebounce;
    let fakeGroupByValues: IGroupByValue[];

    function getInputHandler() {
      return categoryFacetSearch.facetSearchElement.facetSearchUserInputHandler;
    }

    function getInput() {
      return categoryFacetSearch.facetSearchElement.input;
    }

    function getSearchResults() {
      return categoryFacetSearch.facetSearchElement.searchResults;
    }

    function getSearchElement() {
      return categoryFacetSearch.facetSearchElement.search;
    }

    function getFacetSearchValues() {
      return $$(getSearchResults()).findAll('.coveo-category-facet-search-value');
    }

    function expectNoResults() {
      expect($$(categoryFacetMock.element).hasClass(noResultsClass)).toBe(true);
      expect($$(getSearchElement()).hasClass(facetSearchNoResultsClass)).toBe(true);
    }

    function expectResults() {
      expect($$(categoryFacetMock.element).hasClass(noResultsClass)).toBe(false);
      expect($$(getSearchElement()).hasClass(facetSearchNoResultsClass)).toBe(false);
    }

    function searchWithValues(values: IGroupByValue[]) {
      return (categoryFacetMock.categoryFacetQueryController.searchFacetValues = () => Promise.resolve(fakeGroupByValues));
    }

    function searchWithNoValues() {
      categoryFacetMock.categoryFacetQueryController.searchFacetValues = () => Promise.resolve([]);
    }

    beforeEach(() => {
      realDebounce = _.debounce;
      spyOn(_, 'debounce').and.callFake(function(func) {
        return function() {
          func.apply(this, arguments);
        };
      });
      categoryFacetMock = basicComponentSetup<CategoryFacet>(CategoryFacet, {
        field: '@field',
        title: categoryFacetTitle
      }).cmp;
      fakeGroupByValues = FakeResults.createFakeGroupByResult('@field', 'value', 10).values;
      categoryFacetMock.categoryFacetQueryController = mock(CategoryFacetQueryController);
      categoryFacetMock.categoryFacetQueryController.searchFacetValues = () => new Promise(resolve => resolve(fakeGroupByValues));
      categoryFacetSearch = new CategoryFacetSearch(categoryFacetMock);
      categoryFacetSearch.build();
    });

    afterEach(() => {
      _.debounce = realDebounce;
    });

    it('when building returns a container', () => {
      const container = categoryFacetSearch.build();
      expect(container.hasClass('coveo-category-facet-search-container')).toBe(true);
    });

    it('builds a container with the button role', () => {
      const container = categoryFacetSearch.build();
      expect(container.getAttribute('role')).toEqual('button');
    });

    it("builds a container with the category facet's title in the label", () => {
      const container = categoryFacetSearch.build();
      expect(container.getAttribute('aria-label')).toContain(categoryFacetTitle);
    });

    it('focus moves the focus to the input element', () => {
      spyOn(getInput(), 'focus');

      categoryFacetSearch.focus();

      expect(getInput().focus).toHaveBeenCalled();
    });

    it('renders values on focus', done => {
      categoryFacetSearch.focus();
      setTimeout(() => {
        expect(getSearchResults().innerHTML).not.toEqual('');
        done();
      });
    });

    it('renders values correctly', done => {
      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        const searchResults = getSearchResults();
        const valueCaptions = $$(searchResults).findAll('.coveo-category-facet-search-value-caption');
        const pathValues = $$(searchResults).findAll('.coveo-category-facet-search-path');
        const valueCounts = $$(searchResults).findAll('.coveo-category-facet-search-value-number');
        for (const i of _.range(fakeGroupByValues.length)) {
          expect($$(valueCaptions[i]).text()).toEqual(`value${i}`);
          expect($$(pathValues[i]).text()).toEqual('');
          expect($$(valueCounts[i]).text()).toEqual((i + 1).toString());
        }
        done();
      });
    });

    it('renders the path correctly', done => {
      fakeGroupByValues = FakeResults.createFakeGroupByResult('@field', 'a|b|c', 10).values;
      searchWithValues(fakeGroupByValues);

      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        const pathCaption = $$(getSearchResults()).find('.coveo-category-facet-search-path');
        expect($$(pathCaption).text()).toEqual('a/b/');
        done();
      });
    });

    it('sets the correct classes when there is no results', done => {
      searchWithNoValues();

      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        expectNoResults();
        done();
      });
    });

    it('removes no results classes when there are results', done => {
      $$(categoryFacetMock.element).addClass(noResultsClass);
      $$(getSearchElement()).addClass(facetSearchNoResultsClass);

      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        expectResults();
        done();
      });
    });

    it('selects the first results when displaying new values', done => {
      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        expect($$(getFacetSearchValues()[0]).hasClass('coveo-facet-search-current-result')).toBe(true);
        done();
      });
    });

    it('sends an analytics event on selection', done => {
      spyOn(categoryFacetMock, 'logAnalyticsEvent');
      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        $$(getFacetSearchValues()[0]).trigger('click');
        expect(categoryFacetMock.logAnalyticsEvent).toHaveBeenCalledWith(analyticsActionCauseList.categoryFacetSelect, ['value0']);
        done();
      });
    });

    it('it scrolls to top', done => {
      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        spyOn(categoryFacetMock, 'scrollToTop');
        $$(getFacetSearchValues()[0]).trigger('click');
        expect(categoryFacetMock.scrollToTop).toHaveBeenCalled();
        done();
      });
    });

    describe('when selecting with the keyboard (using ENTER)', () => {
      let keyboardEvent: KeyboardEvent;

      beforeEach(() => {
        keyboardEvent = { which: KEYBOARD.ENTER } as KeyboardEvent;
        spyOn(categoryFacetMock, 'changeActivePath');
        spyOn(categoryFacetMock, 'logAnalyticsEvent');
        spyOn(categoryFacetMock, 'scrollToTop');
        categoryFacetSearch.displayNewValues();
      });

      it('it selects the current result', done => {
        setTimeout(() => {
          getInputHandler().handleKeyboardEvent(keyboardEvent);
          expect(categoryFacetMock.changeActivePath).toHaveBeenCalledWith(['value0']);
          done();
        });
      });

      it('it scrolls to top', done => {
        setTimeout(() => {
          getInputHandler().handleKeyboardEvent(keyboardEvent);
          expect(categoryFacetMock.scrollToTop).toHaveBeenCalled();
          done();
        });
      });

      it('it sends an analytics event', done => {
        setTimeout(() => {
          getInputHandler().handleKeyboardEvent(keyboardEvent);
          expect(categoryFacetMock.logAnalyticsEvent).toHaveBeenCalledWith(analyticsActionCauseList.categoryFacetSelect, ['value0']);
          done();
        });
      });
    });

    it('pressing down arrow moves current result down', done => {
      const keyboardEvent = { which: KEYBOARD.DOWN_ARROW } as KeyboardEvent;
      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        getInputHandler().handleKeyboardEvent(keyboardEvent);
        expect($$(getFacetSearchValues()[1]).hasClass('coveo-facet-search-current-result')).toBe(true);
        done();
      });
    });

    it('pressing up arrow moves current result up', done => {
      const keyboardEvent = { which: KEYBOARD.UP_ARROW } as KeyboardEvent;
      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        getInputHandler().handleKeyboardEvent(keyboardEvent);
        expect($$(getFacetSearchValues().slice(-1)[0]).hasClass('coveo-facet-search-current-result')).toBe(true);
        done();
      });
    });

    it('pressing escape closes the search input', done => {
      const keyboardEvent = { which: KEYBOARD.ESCAPE } as KeyboardEvent;
      spyOn(categoryFacetSearch.facetSearchElement, 'clearSearchInput');
      categoryFacetSearch.displayNewValues();

      setTimeout(() => {
        getInputHandler().handleKeyboardEvent(keyboardEvent);
        expect(categoryFacetSearch.facetSearchElement.clearSearchInput).toHaveBeenCalled();
        done();
      });
    });

    it('pressing any other key displays new values', done => {
      const keyboardEvent = { which: 1337 } as KeyboardEvent;
      getInputHandler().handleKeyboardEvent(keyboardEvent);
      setTimeout(() => {
        expect(getSearchResults().innerHTML).not.toEqual('');
        done();
      });
    });
  });
}
