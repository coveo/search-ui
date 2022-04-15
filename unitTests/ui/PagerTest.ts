import { IBuildingQueryEventArgs, INoResultsEventArgs, QueryEvents } from '../../src/events/QueryEvents';
import { Defer } from '../../src/misc/Defer';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { IPagerOptions, Pager } from '../../src/ui/Pager/Pager';
import { $$ } from '../../src/utils/Dom';
import { registerCustomMatcher } from '../CustomMatchers';
import { FakeResults } from '../Fake';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';
import { l } from '../../src/strings/Strings';
import { find } from 'underscore';

export function PagerTest() {
  describe('Pager', () => {
    let test: Mock.IBasicComponentSetup<Pager>;

    function simulatePageCount(pageCount: number, currentPage = 1) {
      const builder = new QueryBuilder();
      builder.firstResult = (currentPage - 1) * 10;

      Simulate.query(test.env, {
        query: builder.build(),
        results: FakeResults.createFakeResults(pageCount * 10)
      });
    }

    function getRenderedButtonLabels() {
      return $$(test.cmp.element)
        .findAll('a.coveo-pager-list-item-text')
        .map(item => item.innerText);
    }

    beforeEach(() => {
      registerCustomMatcher();
      test = Mock.basicComponentSetup<Pager>(Pager);
    });

    afterEach(() => {
      test = null;
    });

    it('should set the correct result number when changing page', () => {
      let currentPage = 1;
      $$(test.env.root).on('buildingQuery', (e, args: IBuildingQueryEventArgs) => {
        expect(args.queryBuilder.build().firstResult).toBe(currentPage * 10);
      });
      test.cmp.setPage(++currentPage);
      test.cmp.setPage(++currentPage);
      currentPage--;
      test.cmp.previousPage();
      currentPage++;
      test.cmp.nextPage();
      expect(test.env.queryController.executeQuery).toHaveBeenCalledTimes(4);
    });

    it('should not be possible to set current page to an invalid value', () => {
      test.cmp.setPage('a' as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage('1' as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(2 as any);
      expect(test.cmp.currentPage).toBe(2);
      test.cmp.setPage(1.7 as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(1.5 as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(1.499999 as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage('1.599999' as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage('2.00000' as any);
      expect(test.cmp.currentPage).toBe(2);
      test.cmp.setPage({} as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(true as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(false as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(0 as any);
      expect(test.cmp.currentPage).toBe(1);
    });

    it('should update the state when changing page', () => {
      let currentPage = 1;
      test.cmp.setPage(++currentPage);
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('first', (currentPage - 1) * 10);
      test.cmp.setPage(++currentPage);
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('first', (currentPage - 1) * 10);
      currentPage--;
      test.cmp.previousPage();
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('first', (currentPage - 1) * 10);
      currentPage++;
      test.cmp.nextPage();
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('first', (currentPage - 1) * 10);
    });

    describe('when query state model is updated', () => {
      beforeEach(() => {
        test = Mock.advancedComponentSetup<Pager>(
          Pager,
          new Mock.AdvancedComponentSetupOptions(undefined, undefined, env => {
            return env.withLiveQueryStateModel();
          })
        );
      });

      it('should update current page when first result is changed', () => {
        test.env.queryStateModel.set('first', 30);
        expect(test.cmp.currentPage).toBe(4);
      });

      it('should update current page when number of results per page is changed', () => {
        test.env.queryStateModel.set('numberOfResults', 10);
        test.env.queryStateModel.set('first', 49);

        expect(test.cmp.currentPage).toBe(5);

        test.env.queryStateModel.set('numberOfResults', 50);
        expect(test.cmp.currentPage).toBe(1);
      });
    });

    it('should not render anything if only one page of result is returned', () => {
      Simulate.query(test.env, { results: FakeResults.createFakeResults(5) });
      expect(test.cmp.element.querySelectorAll('li').length).toBe(0);
    });

    it('should render the pager boundary correctly', () => {
      simulatePageCount(100, 8);

      const anchors = $$(test.cmp.element).findAll('a.coveo-pager-list-item-text');
      expect($$(anchors[0]).text()).toBe('6');
      expect(anchors[0].parentElement.getAttribute('tabindex')).toBe('0');
      expect($$(anchors[anchors.length - 1]).text()).toBe('10');
    });

    it('should always respect an uneven numberOfPages when enough pages exist', () => {
      test.cmp.options.numberOfPages = 5;

      simulatePageCount(7);
      expect(getRenderedButtonLabels()).toEqual(['1', '2', '3', '4', '5']);

      simulatePageCount(7, 4);
      expect(getRenderedButtonLabels()).toEqual(['2', '3', '4', '5', '6']);

      simulatePageCount(7, 7);
      expect(getRenderedButtonLabels()).toEqual(['3', '4', '5', '6', '7']);
    });

    it('should always respect an even numberOfPages when enough pages exist', () => {
      test.cmp.options.numberOfPages = 4;

      simulatePageCount(7);
      expect(getRenderedButtonLabels()).toEqual(['1', '2', '3', '4']);

      simulatePageCount(7, 4);
      expect(getRenderedButtonLabels()).toEqual(['2', '3', '4', '5']);

      simulatePageCount(7, 7);
      expect(getRenderedButtonLabels()).toEqual(['4', '5', '6', '7']);
    });

    it('should render buttons for every page when the amount is lower than numberOfPages', () => {
      test.cmp.options.numberOfPages = 5;

      simulatePageCount(3);
      expect(getRenderedButtonLabels()).toEqual(['1', '2', '3']);

      simulatePageCount(3, 2);
      expect(getRenderedButtonLabels()).toEqual(['1', '2', '3']);

      simulatePageCount(3, 3);
      expect(getRenderedButtonLabels()).toEqual(['1', '2', '3']);
    });

    it('should render buttons for every page when the amount is equal to numberOfPages', () => {
      test.cmp.options.numberOfPages = 5;

      simulatePageCount(5);
      expect(getRenderedButtonLabels()).toEqual(['1', '2', '3', '4', '5']);

      simulatePageCount(5, 3);
      expect(getRenderedButtonLabels()).toEqual(['1', '2', '3', '4', '5']);

      simulatePageCount(5, 5);
      expect(getRenderedButtonLabels()).toEqual(['1', '2', '3', '4', '5']);
    });

    describe('with 100 fake results', () => {
      let listItems: HTMLElement[];
      beforeEach(() => {
        const builder = new QueryBuilder();
        builder.firstResult = 50;
        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(100)
        });
        listItems = $$(test.cmp.element).findAll('.coveo-pager-list-item');
      });

      it('should set the aria-label on the navigation element', () => {
        expect(test.cmp['list'].getAttribute('aria-label')).toEqual(l('Pagination'));
      });

      it('should set the role on the navigation element', () => {
        expect(test.cmp['list'].getAttribute('role')).toEqual('navigation');
      });

      it('should set the aria-label on elements correctly', () => {
        listItems.forEach((listItem, index) => {
          if (index !== 0 && index !== listItems.length - 1) {
            const pageNumber = parseInt($$(listItem).text());
            expect(listItem.getAttribute('aria-label')).toEqual(l('PageNumber', pageNumber.toString()));
          }
        });
      });

      it('should set the role on elements', () => {
        listItems.forEach(listItem => expect(listItem.getAttribute('role')).toEqual('button'));
      });

      it('should not make the next arrow a toggle', () => {
        expect(test.cmp.element.querySelector('.coveo-pager-next').getAttribute('aria-pressed')).toBeNull();
      });

      it('should not make the previous arrow a toggle', () => {
        expect(test.cmp.element.querySelector('.coveo-pager-previous').getAttribute('aria-pressed')).toBeNull();
      });

      it('should set aria-pressed to true on the active page element', () => {
        const activeElement = find(listItems, listItem => $$(listItem).text() === test.cmp.currentPage.toString());
        expect(activeElement.getAttribute('aria-pressed')).toEqual(true.toString());
      });

      it('should set aria-pressed to false on every inactive page element', () => {
        listItems.forEach((listItem, index) => {
          if (index !== 0 && index !== listItems.length - 1) {
            if ($$(listItem).text() !== test.cmp.currentPage.toString()) {
              expect(listItem.getAttribute('aria-pressed')).toEqual(false.toString());
            }
          }
        });
      });

      it('should set tabindex to -1 on every link element', () => {
        listItems.forEach(listItem => expect(listItem.children.item(0).getAttribute('tabindex')).toEqual('-1'));
      });

      it('should set aria-hidden to true on every link element', () => {
        listItems.forEach(listItem => expect(listItem.children.item(0).getAttribute('aria-hidden')).toEqual('true'));
      });
    });

    it('should not reset page number on a new query if the origin is a pager', () => {
      test.cmp.setPage(6);
      expect(test.cmp.currentPage).toBe(6);
      $$(test.env.root).trigger(QueryEvents.newQuery, {
        origin: test.cmp
      });
      expect(test.cmp.currentPage).toBe(6);
    });

    it('should not reset page number on a new query if the origin is a debug panel', () => {
      test.cmp.setPage(10);
      expect(test.cmp.currentPage).toBe(10);
      $$(test.env.root).trigger(QueryEvents.newQuery, {
        origin: { type: 'Debug' }
      });
      expect(test.cmp.currentPage).toBe(10);
    });

    it('should reset the page number on a new query if the origin is not set', () => {
      test.cmp.setPage(5);
      expect(test.cmp.currentPage).toBe(5);
      $$(test.env.root).trigger(QueryEvents.newQuery, {});
      expect(test.cmp.currentPage).toBe(1);
    });

    it('should reset the page number on a new query if the origin is something not recognized', () => {
      test.cmp.setPage(10);
      expect(test.cmp.currentPage).toBe(10);
      $$(test.env.root).trigger(QueryEvents.newQuery, {
        origin: 'nope not the pager'
      });
      expect(test.cmp.currentPage).toBe(1);
    });

    describe('when queries are performed', () => {
      const execQuery = (
        test: Mock.IBasicComponentSetup<Pager>,
        resultsPerPage: number,
        firstResult: number,
        numberOfResults: number,
        origin?
      ) => {
        test.env.searchInterface.resultsPerPage = resultsPerPage;
        const queryBuilder = new QueryBuilder();
        queryBuilder.numberOfResults = resultsPerPage;
        queryBuilder.firstResult = firstResult;
        const simulation = Simulate.query(test.env, {
          query: queryBuilder.build(),
          queryBuilder,
          results: FakeResults.createFakeResults(numberOfResults),
          origin
        });

        return {
          test,
          simulation
        };
      };

      it('should adapt itself to the number of results on each new query', () => {
        // 10 results per page : show full pager
        // Page 1 to 5
        execQuery(test, 10, 0, 1000);

        let anchors = $$(test.cmp.element).findAll('a.coveo-pager-list-item-text');
        expect($$(anchors[0]).text()).toBe('1');
        expect($$(anchors[anchors.length - 1]).text()).toBe('5');

        // 500 results per page : only 2 page available
        // Page 1 to 2
        execQuery(test, 500, 0, 1000);

        anchors = $$(test.cmp.element).findAll('a.coveo-pager-list-item-text');
        expect($$(anchors[0]).text()).toBe('1');
        expect($$(anchors[anchors.length - 1]).text()).toBe('2');
      });

      it('should return to the last valid page when there is no results and the numberOfResults per page is no standard', () => {
        $$(test.env.root).on(QueryEvents.noResults, (e, args: INoResultsEventArgs) => {
          expect(args.retryTheQuery).toBe(true);
        });
        test.cmp.currentPage = 11;
        execQuery(test, 100, 1000, 0, test.cmp);

        expect(test.cmp.currentPage).toBe(10);
      });

      it('should return to the last valid page when there are less results than expected', done => {
        const { simulation } = execQuery(test, 10, 30, 0, test.cmp);
        simulation.results.totalCountFiltered = 29;
        simulation.results.totalCount = 29;

        Simulate.query(test.env, {
          query: simulation.query,
          queryBuilder: simulation.queryBuilder,
          results: simulation.results,
          origin: test.cmp
        });
        Defer.defer(() => {
          // started at page 4
          // expected to receive more than 30 results in total but received only 29
          // Should go back to last valid page, which is page 3
          expect(test.cmp.currentPage).toBe(3);
          done();
        });
      });

      it(`when having a resultPerPage that is not a divider of maximumNumberOfResultsFromIndex 
      should prevent requesting more result than the maximumNumberOfResultsFromIndex option`, () => {
        const resultsPerPage = 12;
        const pageNumber = Math.ceil(test.cmp.options.maximumNumberOfResultsFromIndex / resultsPerPage);
        const firstResult = (pageNumber - 1) * resultsPerPage;

        test.cmp.setPage(pageNumber);
        const { simulation } = execQuery(test, resultsPerPage, firstResult, 0, test.cmp);

        expect(simulation.queryBuilder.numberOfResults).toBe(test.cmp.options.maximumNumberOfResultsFromIndex - firstResult);
      });
    });

    describe('analytics', () => {
      it('should log the proper event when selecting a page directly', () => {
        test.cmp.setPage(15);
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerNumber,
          { pagerNumber: 15 },
          test.cmp.element
        );
      });

      it('should log the proper event when hitting next page', () => {
        test.cmp.nextPage();
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerNext,
          { pagerNumber: 2 },
          test.cmp.element
        );
      });

      it('should log the proper event when hitting previous page', () => {
        test.cmp.setPage(3);
        test.cmp.previousPage();
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerPrevious,
          { pagerNumber: 2 },
          test.cmp.element
        );
      });
    });

    describe('exposes options', () => {
      it('numberOfPages allow to specify the number of pages to render', () => {
        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, <IPagerOptions>{
          numberOfPages: 22
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('a.coveo-pager-list-item-text').length).toBe(22);
      });

      it('enableNavigationButton can enable or disable nav buttons', () => {
        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, <IPagerOptions>{
          enableNavigationButton: true
        });
        const builder = new QueryBuilder();
        builder.firstResult = 70;

        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('.coveo-pager-previous').length).toBe(1);
        expect($$(test.cmp.element).findAll('.coveo-pager-next').length).toBe(1);

        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, <IPagerOptions>{
          enableNavigationButton: false
        });

        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('.coveo-pager-previous').length).toBe(0);
        expect($$(test.cmp.element).findAll('.coveo-pager-next').length).toBe(0);
      });

      it('maximumNumberOfResultsFromIndex allow to specify the maximum last possible result from the index', () => {
        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, <IPagerOptions>{
          maximumNumberOfResultsFromIndex: 31
        });
        const builder = new QueryBuilder();
        builder.firstResult = 30;

        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(1000) // return much more results than 31, but the option should still work properly
        });

        const anchors = $$(test.cmp.element).findAll('a.coveo-pager-list-item-text');
        // 31 results max from the index
        // divided by 10 results per page
        // means 4 pages
        expect($$(anchors[anchors.length - 1]).text()).toBe('4');
      });
    });
  });
}
