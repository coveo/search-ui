import * as Mock from '../MockEnvironment';
import { IOmniboxAnalytics } from '../../src/ui/Omnibox/OmniboxAnalytics';
import { IAnalyticsOmniboxSuggestionMeta, analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { last } from 'underscore';
import { Omnibox } from '../../src/ui/Omnibox/Omnibox';
import { Suggestion } from '../../src/magicbox/SuggestionsManager';
import { QuerySuggestPreview } from '../../src/ui/QuerySuggestPreview/QuerySuggestPreview';
import { QuerySuggestPreviewTestUtils } from './QuerySuggestPreviewTestUtils';
import { $$ } from '../../src/Core';

export function OmniboxAnalyticsTest() {
  describe('omniboxAnalyticsTest', () => {
    let omniboxAnalytics: IOmniboxAnalytics;
    let testEnv: Mock.MockEnvironmentBuilder;
    let partialQueries: string[] = [];
    let suggestionRanking: number;
    let suggestions: string[] = [];
    let partialQuery: string;

    function setupEnv() {
      testEnv = new Mock.MockEnvironmentBuilder();
      testEnv.searchInterface.getOmniboxAnalytics = jasmine.createSpy('omniboxAnalytics').and.returnValue(setupOmniboxAnalytics()) as any;
    }

    function setupOmniboxAnalytics(): IOmniboxAnalytics {
      const buildCustomDataForPartialQueries = (): IAnalyticsOmniboxSuggestionMeta => {
        const partialQueries = omniboxAnalytics.partialQueries.join(';');
        const suggestions = omniboxAnalytics.suggestions.join(';');
        const partialQuery = last(omniboxAnalytics.partialQueries);
        return {
          partialQueries,
          suggestionRanking: omniboxAnalytics.suggestionRanking,
          suggestions,
          partialQuery: partialQuery
        } as IAnalyticsOmniboxSuggestionMeta;
      };
      return (omniboxAnalytics = omniboxAnalytics = {
        partialQueries,
        suggestionRanking,
        suggestions,
        partialQuery,
        buildCustomDataForPartialQueries
      });
    }

    describe('in the omnibox', () => {
      let testOmnibox: Mock.IBasicComponentSetup<Omnibox>;

      beforeEach(() => {
        setupEnv();
        testOmnibox = Mock.advancedComponentSetup<Omnibox>(Omnibox, new Mock.AdvancedComponentSetupOptions(null, {}, env => testEnv));
      });

      it('when the option enableSearchAsYouType + enableQuerySuggestAddon should send correct analytics events', () => {
        testOmnibox = Mock.advancedComponentSetup<Omnibox>(
          Omnibox,
          new Mock.AdvancedComponentSetupOptions(
            null,
            {
              enableQuerySuggestAddon: true,
              enableSearchAsYouType: true
            },
            env => testEnv
          )
        );

        let spy = jasmine.createSpy('spy');
        testOmnibox.env.searchEndpoint.getQuerySuggest = spy;

        spy.and.returnValue({
          completions: [
            {
              expression: 'a'
            },
            {
              expression: 'b'
            },
            {
              expression: 'c'
            },
            {
              expression: 'd'
            },
            {
              expression: 'e'
            }
          ]
        });

        testOmnibox.cmp.setText('foobar');
        expect(testOmnibox.cmp.magicBox.onchange).toBeDefined();
        testOmnibox.cmp.magicBox.onchange();
        testOmnibox.cmp.magicBox.onselect(<Suggestion>['a']);
        expect(testOmnibox.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.omniboxAnalytics,
          jasmine.objectContaining({
            partialQuery: undefined,
            suggestionRanking: jasmine.any(Number),
            partialQueries: ''
          })
        );
      });
    });

    describe('in the querySuggestPreview', () => {
      let testQuerySuggestPreview: Mock.IBasicComponentSetup<QuerySuggestPreview>;
      let utils: QuerySuggestPreviewTestUtils;

      function getAResult(done) {
        const previewContainer = $$(utils.suggestionContainer.el).find('.coveo-preview-results > .CoveoResult');
        if (!previewContainer) {
          done.fail('No result to click. Impossible validate the analytics');
        }
        return previewContainer;
      }

      beforeEach(() => {
        setupEnv();
        utils = new QuerySuggestPreviewTestUtils(testEnv);
        testQuerySuggestPreview = utils.setupQuerySuggestPreview();
        utils.setupSuggestion();
      });

      it(`and the query get executed, 
      an analytics get logs`, () => {
        jasmine.clock().install();
        partialQueries = ['t', 'te', 'tes', 'test'];
        suggestionRanking = 3;
        suggestions = ['test', 'test2', 'test3'];
        testEnv.searchInterface.getOmniboxAnalytics = jasmine.createSpy('omniboxAnalytics').and.returnValue(setupOmniboxAnalytics()) as any;
        utils.triggerQuerySuggestHoverAndPassTime();
        expect(testQuerySuggestPreview.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.showQuerySuggestPreview,
          jasmine.objectContaining({
            partialQuery: last(partialQueries),
            suggestionRanking,
            partialQueries: partialQueries.join(';'),
            suggestions: suggestions.join(';')
          })
        );
        jasmine.clock().uninstall();
      });

      it('it log an analytics with the appropriate event', done => {
        const suggestion = 'test';
        utils.triggerQuerySuggestHover(suggestion);
        setTimeout(() => {
          const previewContainer = getAResult(done);
          previewContainer.click();
          expect(testQuerySuggestPreview.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
            analyticsActionCauseList.clickQuerySuggestPreview,
            jasmine.objectContaining({
              suggestion,
              displayedRank: 0
            }),
            previewContainer
          );
          done();
        }, testQuerySuggestPreview.cmp.options.executeQueryDelay);
      });

      it(`it log an analytics with the appropriate event,
      even if we hover on another suggestion before clicking`, done => {
        const suggestion = 'test';
        utils.triggerQuerySuggestHover(suggestion);
        setTimeout(() => {
          utils.triggerQuerySuggestHover(`bad ${suggestion}`);
          setTimeout(() => {
            const previewContainer = getAResult(done);
            previewContainer.click();
            expect(testQuerySuggestPreview.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
              analyticsActionCauseList.clickQuerySuggestPreview,
              jasmine.objectContaining({
                suggestion,
                displayedRank: 0
              }),
              previewContainer
            );
            done();
          }, testQuerySuggestPreview.cmp.options.executeQueryDelay - 100);
        }, testQuerySuggestPreview.cmp.options.executeQueryDelay);
      });
    });
  });
}
