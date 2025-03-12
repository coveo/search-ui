import * as Mock from '../MockEnvironment';
import { IBasicComponentSetup } from '../MockEnvironment';
import { QuerySuggestPreview, IQuerySuggestPreview } from '../../src/ui/QuerySuggestPreview/QuerySuggestPreview';
import { IOmniboxAnalytics } from '../../src/ui/Omnibox/OmniboxAnalytics';
import { $$, HtmlTemplate, Component } from '../../src/Core';
import { FakeResults } from '../Fake';
import { IAnalyticsOmniboxSuggestionMeta } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IQueryResults } from '../../src/rest/QueryResults';
import { last } from 'underscore';
import {
  IBuildingResultPreviewsQueryEventArgs,
  IPopulateSearchResultPreviewsEventArgs,
  ResultPreviewsManagerEvents
} from '../../src/events/ResultPreviewsManagerEvents';
import { IQuery } from '../../src/rest/Query';
import { ResultLink } from '../../src/ui/ResultLink/ResultLink';

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
    const templateClassName = 'test-template';
    let test: IBasicComponentSetup<QuerySuggestPreview>;
    let testEnv: Mock.MockEnvironmentBuilder;
    let omniboxAnalytics: IOmniboxAnalytics;
    let fakeResults: IQueryResults;

    function setupQuerySuggestPreview(options: IQuerySuggestPreview = {}, useCustomTemplate = true) {
      if (useCustomTemplate) {
        options.resultTemplate = HtmlTemplate.create(
          $$('script', { className: 'result-template', type: 'text/html' }, $$('div', { className: templateClassName })).el
        );
      }

      test = Mock.advancedComponentSetup<QuerySuggestPreview>(
        QuerySuggestPreview,
        new Mock.AdvancedComponentSetupOptions(null, options, env => testEnv)
      );
      spyOn(Component, 'resolveRoot').and.returnValue(testEnv.root);

      createDefaultFakeResults();
    }

    function createDefaultFakeResults() {
      fakeResults = FakeResults.createFakeResults(test.cmp.options.numberOfPreviewResults);
    }

    function triggerPopulateSearchResultPreviews(suggestionText: string = 'test') {
      (test.env.searchEndpoint.search as jasmine.Spy).and.returnValue(Promise.resolve(fakeResults));
      const event: IPopulateSearchResultPreviewsEventArgs = { suggestion: { text: suggestionText }, previewsQueries: [] };
      $$(testEnv.root).trigger(ResultPreviewsManagerEvents.populateSearchResultPreviews, event);
      return event.previewsQueries[0];
    }

    function triggerPopulateSearchResultPreviewsAndPassTime(suggestion: string = 'test') {
      const query = triggerPopulateSearchResultPreviews(suggestion);
      if (query instanceof Promise) {
        return query;
      }
      return Promise.resolve(query);
    }

    function getLastQuery() {
      return (test.cmp.queryController.getEndpoint().search as jasmine.Spy).calls.mostRecent().args[0] as IQuery;
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

    it('uses some options from the last query', async done => {
      const optionsToTest: Partial<IQuery> = {
        firstResult: 0,
        searchHub: 'some search hub',
        pipeline: 'a pipeline',
        tab: 'one tab',
        locale: 'some locale',
        timezone: 'a timezone',
        context: {
          'the first key': 'the first value',
          'the second key': 'the second value'
        },
        cq: 'some constant query'
      };
      setupQuerySuggestPreview();
      (test.cmp.queryController.getLastQuery as jasmine.Spy).and.returnValue(optionsToTest);
      await triggerPopulateSearchResultPreviewsAndPassTime();
      const lastSearchQuery = getLastQuery();
      for (let optionName of Object.keys(optionsToTest)) {
        expect(lastSearchQuery[optionName]).toEqual(optionsToTest[optionName]);
      }
      done();
    });

    it('uses the suggestion text in its search', async done => {
      setupQuerySuggestPreview();
      const suggestionText = 'Hello, World!';
      await triggerPopulateSearchResultPreviewsAndPassTime(suggestionText);
      const lastSearchQuery = (test.cmp.queryController.getEndpoint().search as jasmine.Spy).calls.mostRecent().args[0] as IQuery;
      expect(lastSearchQuery.q).toEqual(suggestionText);
      done();
    });

    it('builds a default template with a div tag', () => {
      const template = test.cmp['buildDefaultSearchResultPreviewTemplate']();
      // A div tag is used instead of a script tag because Firefox doesn't support appending elements to a script tag.
      expect(template.element.tagName.toLowerCase()).toEqual('div');
    });

    it('triggers a building query event immediately when populating', async done => {
      const onBuildingQuery = jasmine.createSpy(ResultPreviewsManagerEvents.buildingResultPreviewsQuery);
      $$(testEnv.root).on(ResultPreviewsManagerEvents.buildingResultPreviewsQuery, onBuildingQuery);
      setupQuerySuggestPreview();
      await triggerPopulateSearchResultPreviewsAndPassTime();
      expect(onBuildingQuery).toHaveBeenCalledTimes(1);
      done();
    });

    it('allows the query to be changed with the building query event', async done => {
      const testQuery = 'abc';
      $$(testEnv.root).on(ResultPreviewsManagerEvents.buildingResultPreviewsQuery, (_, data: IBuildingResultPreviewsQueryEventArgs) => {
        data.query.q = testQuery;
      });
      setupQuerySuggestPreview();
      await triggerPopulateSearchResultPreviewsAndPassTime();
      expect(getLastQuery().q).toEqual(testQuery);
      done();
    });

    it('triggers the building query event with the same query used for search', async done => {
      let builtQuery: IQuery;
      $$(testEnv.root).on(ResultPreviewsManagerEvents.buildingResultPreviewsQuery, (_, data: IBuildingResultPreviewsQueryEventArgs) => {
        builtQuery = data.query;
      });
      setupQuerySuggestPreview();
      await triggerPopulateSearchResultPreviewsAndPassTime();
      expect(getLastQuery()).toEqual(builtQuery);
      done();
    });

    describe('with accessibility', () => {
      describe('with a ResultLink in the template', () => {
        beforeEach(() => {
          setupQuerySuggestPreview({}, false);
        });

        it('sets the aria-label of previews to their title', async done => {
          const previews = await triggerPopulateSearchResultPreviewsAndPassTime();
          previews.forEach((preview, i) => expect(preview.element.getAttribute('aria-label')).toEqual(fakeResults.results[i].title));
          done();
        });

        it('sets the role of the link to "link"', async done => {
          const resultLinks = (await triggerPopulateSearchResultPreviewsAndPassTime()).map(preview =>
            preview.element.querySelector(Component.computeSelectorForType(ResultLink.ID))
          );
          resultLinks.forEach(resultLink => expect(resultLink.getAttribute('role')).toEqual('link'));
          done();
        });

        it('has no "aria-level" on the link', async done => {
          const resultLinks = (await triggerPopulateSearchResultPreviewsAndPassTime()).map(preview =>
            preview.element.querySelector(Component.computeSelectorForType(ResultLink.ID))
          );
          resultLinks.forEach(resultLink => expect(resultLink.getAttribute('aria-level')).toBeFalsy());
          done();
        });
      });
    });

    describe('expose options', () => {
      it('resultTemplate sets the template', async done => {
        setupQuerySuggestPreview();
        const previews = await triggerPopulateSearchResultPreviewsAndPassTime();
        expect(previews[0].element.getElementsByClassName(templateClassName).length).toEqual(1);
        done();
      });

      it('resultTemplate has a default template', async done => {
        setupQuerySuggestPreview({}, false);
        const previews = await triggerPopulateSearchResultPreviewsAndPassTime();
        expect(previews[0].element.getElementsByClassName('coveo-default-result-preview').length).toEqual(1);
        done();
      });

      it('numberOfPreviewResults set the number of results to query', async done => {
        const numberOfPreviewResults = 5;
        setupQuerySuggestPreview({ numberOfPreviewResults });
        await triggerPopulateSearchResultPreviewsAndPassTime();
        const lastSearchQuery = (test.cmp.queryController.getEndpoint().search as jasmine.Spy).calls.mostRecent().args[0] as IQuery;
        expect(lastSearchQuery.numberOfResults).toEqual(numberOfPreviewResults);
        done();
      });
    });
  });
}
