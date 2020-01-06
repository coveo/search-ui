import * as Mock from '../MockEnvironment';
import { ResultsPerPage } from '../../src/ui/ResultsPerPage/ResultsPerPage';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IResultsPerPageOptions } from '../../src/ui/ResultsPerPage/ResultsPerPage';
import { Simulate } from '../Simulate';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';
import { QueryStateModel } from '../../src/Core';
import { QUERY_STATE_ATTRIBUTES } from '../../src/models/QueryStateModel';
import { lab } from 'd3';

export function ResultsPerPageTest() {
  describe('ResultsPerPage', () => {
    let test: Mock.IBasicComponentSetup<ResultsPerPage>;

    function buildResultsPerPage() {
      const cmp = Mock.basicComponentSetup<ResultsPerPage>(ResultsPerPage);
      cmp.env.queryController.options = {};
      cmp.env.queryController.options.resultsPerPage = 10;
      return cmp;
    }

    beforeEach(() => (test = buildResultsPerPage()));

    afterEach(() => (test = null));

    it('should be accessible', () => {
      const label = test.cmp['span'];
      const list = test.cmp['list'];

      expect(label.id).toBeTruthy();
      expect(list.getAttribute('aria-labelledby')).toEqual(label.id);
      expect(list.getAttribute('role')).toEqual('group');
    });

    describe('when calling #setResultsPerPage', () => {
      const numOfResults = 50;

      beforeEach(() => test.cmp.setResultsPerPage(numOfResults));

      it('updates the resultsPerPage option in the SearchInterface', () => {
        expect(test.cmp.searchInterface.resultsPerPage).toBe(numOfResults);
      });

      it('sets number if results in the QueryStateModel', () => {
        expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.numberOfResults, numOfResults);
      });

      it('should trigger a query', () => {
        expect(test.env.queryController.executeQuery).toHaveBeenCalled();
      });

      it('should log the proper analytics event', () => {
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerResize,
          { currentResultsPerPage: numOfResults },
          test.cmp.element
        );
      });
    });

    describe('when modifying the query state model', () => {
      const setQueryStateModelValue = (value: any) => {
        test.env.queryStateModel.set(QUERY_STATE_ATTRIBUTES.NUMBER_OF_RESULTS, value);
      };

      const verifyStateForNumberOfResults = (value: any) => {
        expect(test.cmp.resultsPerPage).toBe(value);
        expect(test.env.queryStateModel.get(QUERY_STATE_ATTRIBUTES.NUMBER_OF_RESULTS)).toBe(value);
      };

      beforeEach(() => {
        const advancedOptions = <IResultsPerPageOptions>{
          choicesDisplayed: [10, 25, 50, 100],
          initialChoice: 25
        };

        const advancedSetup = new Mock.AdvancedComponentSetupOptions(null, advancedOptions, builder => {
          return builder.withLiveQueryStateModel();
        });

        test = Mock.advancedComponentSetup<ResultsPerPage>(ResultsPerPage, advancedSetup);
        Simulate.initialization(test.env);
        verifyStateForNumberOfResults(25);
      });

      it('should accept setting the value to the original default 10', () => {
        setQueryStateModelValue(10);
        verifyStateForNumberOfResults(10);
      });

      it('should accept setting the value to the a different value than the original', () => {
        setQueryStateModelValue(50);
        verifyStateForNumberOfResults(50);
      });

      it('should revert to the initial state when setting an invalid value', () => {
        setQueryStateModelValue(123);
        verifyStateForNumberOfResults(25);
      });

      it('should revert to the initial state when setting a NaN', () => {
        setQueryStateModelValue('foo');
        verifyStateForNumberOfResults(25);
      });
    });

    it(`when there are two ResultsPerPage components,
    when calling #setResultsPerPage on one,
    it updates the second component to the same number of results`, () => {
      const numOfResults = 50;
      const bindings = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel().getBindings();

      const firstResultsPerPage = new ResultsPerPage($$('div').el, {}, bindings);
      const secondResultsPerPage = new ResultsPerPage($$('div').el, {}, bindings);

      expect(secondResultsPerPage.resultsPerPage).not.toBe(numOfResults);

      firstResultsPerPage.setResultsPerPage(numOfResults);

      expect(secondResultsPerPage.resultsPerPage).toBe(secondResultsPerPage.resultsPerPage);
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

    describe('exposes options', () => {
      it('choicesDisplayed allows to choose the number of results per page options', () => {
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          choicesDisplayed: [15, 25, 35, 75]
        });
        Simulate.initialization(test.env);
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(100)
        });
        expect($$(test.cmp.element).findAll('a.coveo-results-per-page-list-item-text').length).toBe(4);
        expect(test.env.queryController.options.resultsPerPage).toBe(15);
      });

      it('choicesDisplayed links display the right aria-label', () => {
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          choicesDisplayed: [10, 25, 50]
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(100)
        });

        const anchors = $$(test.cmp.element).findAll('a.coveo-results-per-page-list-item-text');
        expect($$(anchors[0]).text()).toBe('10');
        expect(anchors[0].parentElement.getAttribute('aria-label')).toBe('Display 10 results per page');
      });

      it('initialChoice allows to choose the first choice of the number of results per page options', () => {
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          initialChoice: 13,
          choicesDisplayed: [3, 5, 7, 13]
        });
        Simulate.initialization(test.env);
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(100)
        });
        expect(test.env.queryController.options.resultsPerPage).toBe(13);
      });

      it('initialChoice allows to be undefined to set the first of the choicesDisplayed as default', () => {
        let firstChoice = 3;
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          initialChoice: undefined,
          choicesDisplayed: [firstChoice, 5, 7, 13]
        });
        Simulate.initialization(test.env);
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(100)
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
        Simulate.initialization(test.env);
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(100)
        });
        expect(test.env.queryController.options.resultsPerPage).toBe(firstChoice);
      });

      it(`when the QSM numberOfResults is equal to the default QSM number of results,
      when the initialChoice option is not equal to the default QSM numberOfResults,
      it sets the resultsPerPage to the initialChoice`, () => {
        const initialChoice = 5;
        test = Mock.optionsComponentSetup<ResultsPerPage, IResultsPerPageOptions>(ResultsPerPage, {
          initialChoice: initialChoice,
          choicesDisplayed: [initialChoice, 10, 15, 20]
        });
        Simulate.initialization(test.env);
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(100)
        });
        expect(test.env.queryController.options.resultsPerPage).toBe(initialChoice);
      });
    });
  });
}
