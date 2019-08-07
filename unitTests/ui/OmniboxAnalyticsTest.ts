import * as Mock from '../MockEnvironment';
import { Omnibox } from '../../src/ui/Omnibox/Omnibox';
import { IOmniboxAnalytics } from '../../src/ui/Omnibox/OmniboxAnalytics';
import { IAnalyticsOmniboxSuggestionMeta, analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { Suggestion } from '../../src/magicbox/SuggestionsManager';

export function OmniboxAnalyticsTest() {
  let omniboxAnalytics: IOmniboxAnalytics;

  describe('omniboxAnalyticsTest', () => {
    let testEnv: Mock.MockEnvironmentBuilder;

    function setupEnv() {
      testEnv = new Mock.MockEnvironmentBuilder();
      testEnv.searchInterface.getOmniboxAnalytics = jasmine.createSpy('omniboxAnalytics').and.returnValue(setupOmniboxAnalytics()) as any;
    }

    function setupOmniboxAnalytics(): IOmniboxAnalytics {
      const partialQueries: string[] = [];
      let suggestionRanking: number;
      const suggestions: string[] = [];
      let partialQuery: string;
      const buildCustomDataForPartialQueries = (): IAnalyticsOmniboxSuggestionMeta => {
        const partialQueries = omniboxAnalytics.partialQueries.length !== 0 ? undefined : omniboxAnalytics.partialQueries.join(';');
        const suggestions = omniboxAnalytics.suggestions.length !== 0 ? undefined : omniboxAnalytics.suggestions.join(';');
        return {
          partialQueries,
          suggestionRanking: omniboxAnalytics.suggestionRanking,
          suggestions,
          partialQuery: omniboxAnalytics.partialQuery
        };
      };
      return (omniboxAnalytics = {
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

      it('enableSearchAsYouType + enableQuerySuggestAddon should send correct analytics events', () => {
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
  });
}
