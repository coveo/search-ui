import * as Mock from '../MockEnvironment';
import { ResultsPerPage } from '../../src/ui/ResultsPerPage/ResultsPerPage';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IResultsPerPageOptions } from '../../src/ui/ResultsPerPage/ResultsPerPage';
import { Simulate } from '../Simulate';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';

export function ResultsPerPageTest() {
  describe('ResultsPerPage', function() {
    let test: Mock.IBasicComponentSetup<ResultsPerPage>;

    beforeEach(function() {
      test = Mock.basicComponentSetup<ResultsPerPage>(ResultsPerPage);
      test.env.queryController.options = {};
      test.env.queryController.options.resultsPerPage = 10;
    });

    afterEach(function() {
      test = null;
    });

    it('should trigger a query when the number of results per page changes', function() {
      test.cmp.setResultsPerPage(50);
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    describe('analytics', function() {
      it('should log the proper event when changing the number of results per page', function() {
        test.cmp.setResultsPerPage(50);
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerResize,
          { currentResultsPerPage: 50 },
          test.cmp.element
        );
      });
    });

    describe('exposes options', function() {
      it('choicesDisplayed allows to choose the number of results per page options', function() {
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          choicesDisplayed: [15, 25, 35, 75]
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('a.coveo-results-per-page-list-item-text').length).toBe(4);
        expect(test.env.queryController.options.resultsPerPage).toBe(15);
      });

      it('initialChoice allows to choose the first choice of the number of results per page options', function() {
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          initialChoice: 13,
          choicesDisplayed: [3, 5, 7, 13]
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect(test.env.queryController.options.resultsPerPage).toBe(13);
      });

      it('initialChoice allows to be undefined to set the first of the choicesDisplayed as default', function() {
        let firstChoice = 3;
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          initialChoice: undefined,
          choicesDisplayed: [firstChoice, 5, 7, 13]
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect(test.env.queryController.options.resultsPerPage).toBe(firstChoice);
      });

      it('initialChoice set as a choice not displayed uses the first choice instead', function() {
        let aChoiceNotDisplayed = 15;
        let firstChoice = 3;
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          initialChoice: aChoiceNotDisplayed,
          choicesDisplayed: [firstChoice, 5, 7, 13]
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect(test.env.queryController.options.resultsPerPage).toBe(firstChoice);
      });
    });
  });
}
