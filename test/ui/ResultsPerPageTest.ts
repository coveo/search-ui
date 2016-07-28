import * as Mock from '../MockEnvironment';
import {ResultsPerPage} from '../../src/ui/Pager/ResultsPerPage';
import {analyticsActionCauseList} from '../../src/ui/Analytics/AnalyticsActionListMeta';
import {IResultsPerPageOptions} from '../../src/ui/Pager/ResultsPerPage';
import {Simulate} from '../Simulate';
import {FakeResults} from '../Fake';
import {$$} from '../../src/utils/Dom';

export function ResultsPerPageTest() {
  describe('ResultsPerPage', function () {
    let test: Mock.IBasicComponentSetup<ResultsPerPage>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<ResultsPerPage>(ResultsPerPage);
      test.env.queryController.options = {};
      test.env.queryController.options.resultsPerPage = 10;
    });

    afterEach(function () {
      test = null;
    });

    it('should trigger a query when the number of results per page changes', function () {
      test.cmp.setResultsPerPage(50);
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    describe('analytics', function () {
      it('should log the proper event when changing the number of results per page', function () {
        test.cmp.setResultsPerPage(50);
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(analyticsActionCauseList.pagerResize, {currentResultsPerPage: 50}, test.cmp.element);
      });
    });

    describe('exposes options', function () {
      it('numberOfResults allows to choose the number of results per page options', function () {
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          choicesDisplayed: [15, 25, 35, 75]
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('a.coveo-results-per-page-list-item-text').length).toBe(4);
        expect(test.env.queryController.options.resultsPerPage).toBe(15);
      });
    });
  })
}
