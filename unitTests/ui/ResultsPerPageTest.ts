import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IResultsPerPageOptions, ResultsPerPage } from '../../src/ui/ResultsPerPage/ResultsPerPage';
import { $$ } from '../../src/utils/Dom';
import { FakeResults, Mock, Simulate } from '../../testsFramework/TestsFramework';

export function ResultsPerPageTest() {
  describe('ResultsPerPage', () => {
    let test: Mock.IBasicComponentSetup<ResultsPerPage>;

    beforeEach(() => {
      test = Mock.basicComponentSetup<ResultsPerPage>(ResultsPerPage);
      test.env.queryController.options = {};
      test.env.queryController.options.resultsPerPage = 10;
    });

    afterEach(() => {
      test = null;
    });

    it('should trigger a query when the number of results per page changes', () => {
      test.cmp.setResultsPerPage(50);
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    describe('should be able to activate and deactivate', () => {
      const isActivated = (test: Mock.IBasicComponentSetup<ResultsPerPage>) => {
        return $$(test.cmp.element).find('.coveo-results-per-page-no-results') == null;
      };

      it('if the results per page parameter is overwritten in the backend (query pipeline)', () => {
        test.env.searchInterface.isResultsPerPageModifiedByPipeline = false;
        Simulate.query(test.env);
        expect(isActivated(test)).toBeTruthy();

        test.env.searchInterface.isResultsPerPageModifiedByPipeline = true;
        Simulate.query(test.env);
        expect(isActivated(test)).toBeFalsy();
      });

      it('on query success and query error', () => {
        Simulate.query(test.env);
        expect(isActivated(test)).toBeTruthy();

        Simulate.queryError(test.env);
        expect(isActivated(test)).toBeFalsy();
      });

      it('when there are results and when there are no results', () => {
        let results = FakeResults.createFakeResults(10);
        Simulate.query(test.env, {
          results
        });
        expect(isActivated(test)).toBeTruthy();

        results = FakeResults.createFakeResults(0);
        Simulate.query(test.env, {
          results
        });
        expect(isActivated(test)).toBeFalsy();
      });
    });

    describe('analytics', () => {
      it('should log the proper event when changing the number of results per page', () => {
        test.cmp.setResultsPerPage(50);
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerResize,
          { currentResultsPerPage: 50 },
          test.cmp.element
        );
      });
    });

    describe('exposes options', () => {
      it('choicesDisplayed allows to choose the number of results per page options', () => {
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          choicesDisplayed: [15, 25, 35, 75]
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('a.coveo-results-per-page-list-item-text').length).toBe(4);
        expect(test.env.queryController.options.resultsPerPage).toBe(15);
      });

      it('initialChoice allows to choose the first choice of the number of results per page options', () => {
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          initialChoice: 13,
          choicesDisplayed: [3, 5, 7, 13]
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect(test.env.queryController.options.resultsPerPage).toBe(13);
      });

      it('initialChoice allows to be undefined to set the first of the choicesDisplayed as default', () => {
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

      it('initialChoice set as a choice not displayed uses the first choice instead', () => {
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
