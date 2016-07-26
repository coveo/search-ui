import * as Mock from '../MockEnvironment';
import {Pager} from '../../src/ui/Pager/Pager';
import {registerCustomMatcher} from '../CustomMatchers';
import {$$} from '../../src/utils/Dom';
import {IBuildingQueryEventArgs} from '../../src/events/QueryEvents';
import {Simulate} from '../Simulate';
import {FakeResults} from '../Fake';
import {QueryBuilder} from '../../src/ui/Base/QueryBuilder';
import {QueryEvents} from '../../src/events/QueryEvents';
import {analyticsActionCauseList} from '../../src/ui/Analytics/AnalyticsActionListMeta';
import {IPagerOptions} from '../../src/ui/Pager/Pager';

export function PagerTest() {
  describe('Pager', function () {
    var test: Mock.IBasicComponentSetup<Pager>;

    beforeEach(function () {
      registerCustomMatcher();
      test = Mock.basicComponentSetup<Pager>(Pager);
      test.env.queryController.options = {};
      test.env.queryController.options.resultsPerPage = 10;
    })

    afterEach(function () {
      test = null;
    })

    it('should set the correct result number when changing page', function () {
      var currentPage = 1;
      $$(test.env.root).on('buildingQuery', (e, args: IBuildingQueryEventArgs) => {
        expect(args.queryBuilder.build().firstResult).toBe(currentPage * 10);
      })
      test.cmp.setPage(++currentPage);
      test.cmp.setPage(++currentPage);
      currentPage--;
      test.cmp.previousPage();
      currentPage++;
      test.cmp.nextPage();
      expect(test.env.queryController.executeQuery).toHaveBeenCalledTimes(4);
    })

    it('should update the state when changing page', function () {
      var currentPage = 1;
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
    })

    it('should update page when state is changed', function () {
      test = Mock.advancedComponentSetup<Pager>(Pager, new Mock.AdvancedComponentSetupOptions(undefined, undefined, (env) => {
        return env.withLiveQueryStateModel();
      }))
      test.cmp.setPage(7);
      expect(test.cmp.currentPage).toBe(7);
      test.env.queryStateModel.set('first', 30)
      expect(test.cmp.currentPage).toBe(4);
    })

    it('should not render anything if only one page of result is returned', function () {
      Simulate.query(test.env, { results: FakeResults.createFakeResults(5) });
      expect(test.cmp.element.querySelectorAll('li').length).toBe(0);
    })

    it('should render the pager boundary correctly', function () {
      // First results start at 70.
      // Pager displays 10 pages by default, and 10 results per page.
      // So the total range should be from results 20 to results 110 (page #3 to page #12)

      var builder = new QueryBuilder();
      builder.firstResult = 70;

      Simulate.query(test.env, {
        query: builder.build(),
        results: FakeResults.createFakeResults(1000)
      })

      var anchors = $$(test.cmp.element).findAll('a.coveo-pager-anchor');

      expect($$(anchors[0]).text()).toBe('3');
      expect($$(anchors[anchors.length - 1]).text()).toBe('12');
    })

    it('should reset page number on a new query if the origin is not a pager', function () {
      // origin not available -> reset
      test.cmp.setPage(5);
      expect(test.cmp.currentPage).toBe(5);
      $$(test.env.root).trigger(QueryEvents.newQuery, {});
      expect(test.cmp.currentPage).toBe(1);

      // origin not the pager -> reset
      test.cmp.setPage(10);
      expect(test.cmp.currentPage).toBe(10);
      $$(test.env.root).trigger(QueryEvents.newQuery, {
        origin: 'nope not the pager'
      })
      expect(test.cmp.currentPage).toBe(1);

      // origin is pager -> no reset
      test.cmp.setPage(6);
      expect(test.cmp.currentPage).toBe(6);
      $$(test.env.root).trigger(QueryEvents.newQuery, {
        origin: test.cmp
      })
      expect(test.cmp.currentPage).toBe(6);
    })

    describe('analytics', function () {

      it('should log the proper event when selecting a page directly', function () {
        test.cmp.setPage(15);
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(analyticsActionCauseList.pagerNumber, { pagerNumber: 15 }, test.cmp.element);
      })

      it('should log the proper event when hitting next page', function () {
        test.cmp.nextPage();
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(analyticsActionCauseList.pagerNext, { pagerNumber: 2 }, test.cmp.element);
      })

      it('should log the proper event when hitting previous page', function () {
        test.cmp.setPage(3);
        test.cmp.previousPage();
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(analyticsActionCauseList.pagerPrevious, { pagerNumber: 2 }, test.cmp.element);
      })
    })

    describe('exposes options', function () {

      it('numberOfPages allow to specify the number of pages to render', function () {
        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, {
          numberOfPages: 22
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('a.coveo-pager-anchor').length).toBe(22);
      })

      it('enableNavigationButton can enable or disable nav buttons', function () {
        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, {
          enableNavigationButton: true
        })
        var builder = new QueryBuilder();
        builder.firstResult = 70;

        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(1000)
        })
        expect($$(test.cmp.element).findAll('.coveo-pager-previous').length).toBe(1);
        expect($$(test.cmp.element).findAll('.coveo-pager-next').length).toBe(1);

        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, {
          enableNavigationButton: false
        })

        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(1000)
        })
        expect($$(test.cmp.element).findAll('.coveo-pager-previous').length).toBe(0);
        expect($$(test.cmp.element).findAll('.coveo-pager-next').length).toBe(0);
      })

      it('maxNumberOfPages allow to specify the max page to render', function () {
        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, {
          maxNumberOfPages: 5
        })
        var builder = new QueryBuilder();
        builder.firstResult = 70;

        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(1000)
        })

        var anchors = $$(test.cmp.element).findAll('a.coveo-pager-anchor')
        expect($$(anchors[anchors.length - 1]).text()).toBe('5');
      })
    })
  })
}
