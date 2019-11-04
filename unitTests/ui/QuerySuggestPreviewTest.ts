import * as Mock from '../MockEnvironment';
import { IBasicComponentSetup } from '../MockEnvironment';
import { QuerySuggestPreview, IQuerySuggestPreview } from '../../src/ui/QuerySuggestPreview/QuerySuggestPreview';
import { IOmniboxAnalytics } from '../../src/ui/Omnibox/OmniboxAnalytics';
import { $$, HtmlTemplate, Component } from '../../src/Core';
import { FakeResults } from '../Fake';
import { IAnalyticsOmniboxSuggestionMeta, analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IQueryResults } from '../../src/rest/QueryResults';
import { last } from 'underscore';
import { IPopulateSearchResultPreviewsEventArgs, ResultPreviewsManagerEvents } from '../../src/events/ResultPreviewsManagerEvents';

export function initOmniboxAnalyticsMock(omniboxAnalytics: IOmniboxAnalytics) {
  const partialQueries: string[] = [];
  let suggestionRanking: number;
  const suggestions: string[] = [];
  let partialQuery: string;
  const buildCustomDataForPartialQueries = (): IAnalyticsOmniboxSuggestionMeta => {
    return getMetadata(omniboxAnalytics);
  };
  return (omniboxAnalytics = {
    partialQueries,
    suggestionRanking,
    suggestions,
    partialQuery,
    buildCustomDataForPartialQueries
  });
}

function getMetadata(omniboxAnalytics: IOmniboxAnalytics) {
  return {
    suggestionRanking: omniboxAnalytics.suggestionRanking,
    suggestions: omniboxAnalytics.suggestions.join(';'),
    partialQueries: omniboxAnalytics.partialQueries.join(';'),
    partialQuery: last(omniboxAnalytics.partialQuery)
  };
}

export function QuerySuggestPreviewTest() {
  describe('QuerySuggestPreview', () => {
    let test: IBasicComponentSetup<QuerySuggestPreview>;
    let testEnv: Mock.MockEnvironmentBuilder;
    let omniboxAnalytics: IOmniboxAnalytics;

    function setupQuerySuggestPreview(options: IQuerySuggestPreview = {}) {
      const tmpl: HtmlTemplate = Mock.mock<HtmlTemplate>(HtmlTemplate);
      (tmpl.instantiateToElement as jasmine.Spy).and.returnValue(Promise.resolve($$('div').el));
      options['resultTemplate'] = tmpl;

      test = Mock.advancedComponentSetup<QuerySuggestPreview>(
        QuerySuggestPreview,
        new Mock.AdvancedComponentSetupOptions(null, options, env => testEnv)
      );
      spyOn(Component, 'resolveRoot').and.returnValue(testEnv.root);
    }

    function triggerPopulateSearchResultPreviews(suggestionText: string = 'test', fakeResults?: IQueryResults) {
      fakeResults = fakeResults || FakeResults.createFakeResults(test.cmp.options.numberOfPreviewResults);
      (test.env.searchEndpoint.search as jasmine.Spy).and.returnValue(Promise.resolve(fakeResults));
      const event: IPopulateSearchResultPreviewsEventArgs = { suggestionText, previewsQuery: null };
      $$(testEnv.root).trigger(ResultPreviewsManagerEvents.PopulateSearchResultPreviews, event);
      return event.previewsQuery;
    }

    function triggerPopulateSearchResultPreviewsAndPassTime(suggestion: string = 'test', fakeResults?: IQueryResults) {
      const query = triggerPopulateSearchResultPreviews(suggestion);
      jasmine.clock().tick(test.cmp.options.executeQueryDelay);
      return query;
    }

    beforeEach(() => {
      testEnv = new Mock.MockEnvironmentBuilder();
      omniboxAnalytics = this.initOmniboxAnalyticsMock(omniboxAnalytics);
      testEnv.searchInterface.getOmniboxAnalytics = jasmine.createSpy('omniboxAnalytics').and.returnValue(omniboxAnalytics) as any;
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    describe('expose options', () => {
      it('numberOfPreviewResults set the number of results to query', async done => {
        const numberOfPreviewResults = 5;
        setupQuerySuggestPreview({ numberOfPreviewResults });
        await triggerPopulateSearchResultPreviewsAndPassTime();
        expect(test.cmp.queryController.getLastQuery().numberOfResults).toBe(numberOfPreviewResults);
        done();
      });

      it('hoverTime set the time before the query is executed', async done => {
        const executeQueryDelay = 200;
        setupQuerySuggestPreview({ executeQueryDelay });
        expect(test.cmp.queryController.getLastQuery).not.toHaveBeenCalled();
        await triggerPopulateSearchResultPreviewsAndPassTime();
        expect(test.cmp.queryController.getLastQuery).toHaveBeenCalledTimes(1);
        done();
      });
    });

    describe('When we hover', () => {
      it(`on the same Suggestion multiple times before the time in the option hoverTime has passed,
      the query is is executed only once`, async done => {
        setupQuerySuggestPreview();
        test.cmp.queryController.getEndpoint().search = jasmine.createSpy('execQuery');
        triggerPopulateSearchResultPreviews();
        triggerPopulateSearchResultPreviews();
        await triggerPopulateSearchResultPreviewsAndPassTime();
        expect(test.cmp.queryController.getEndpoint().search).toHaveBeenCalledTimes(1);
        done();
      });

      it(`on multiple suggestion before the time in the option hoverTime has passed,
      the query is is executed only once with the last Suggestion we hovered on`, async done => {
        const realQuery = 'testing3';
        setupQuerySuggestPreview();
        test.cmp.queryController.getEndpoint().search = jasmine.createSpy('execQuery');
        triggerPopulateSearchResultPreviews('testing');
        triggerPopulateSearchResultPreviews('testing2');
        await triggerPopulateSearchResultPreviewsAndPassTime(realQuery);
        expect(test.cmp.queryController.getEndpoint().search).toHaveBeenCalledTimes(1);
        expect(test.cmp.queryController.getLastQuery().q).toBe(realQuery);
        done();
      });

      it(`and the query get executed, 
      it logs an analytics search event`, async done => {
        setupQuerySuggestPreview();
        await triggerPopulateSearchResultPreviewsAndPassTime();

        expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.showQuerySuggestPreview,
          jasmine.objectContaining(getMetadata(omniboxAnalytics))
        );
        done();
      });
    });

    describe('Analytics', () => {
      function getAnalyticsMetadata(suggestion: string) {
        return jasmine.objectContaining({
          suggestion,
          displayedRank: 0
        });
      }

      it('it log an analytics with the appropriate event', async done => {
        const suggestion = 'test';
        setupQuerySuggestPreview();
        const result = (await triggerPopulateSearchResultPreviewsAndPassTime(suggestion))[0];
        result.onSelect();
        expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.clickQuerySuggestPreview,
          getAnalyticsMetadata(suggestion),
          result.element
        );
        done();
      });

      it(`it log an analytics with the appropriate event,
      even if we hover on another suggestion before clicking`, async done => {
        const suggestion = 'test';
        setupQuerySuggestPreview();
        const result = (await triggerPopulateSearchResultPreviewsAndPassTime(suggestion))[0];
        await triggerPopulateSearchResultPreviewsAndPassTime(`bad ${suggestion}`);
        result.onSelect();
        expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.clickQuerySuggestPreview,
          getAnalyticsMetadata(suggestion),
          result.element
        );
        done();
      });
    });
  });
}
