import { IFacetValueSuggestionsOptions, FacetValueSuggestions } from '../../src/ui/FacetValueSuggestions/FacetValueSuggestions';
import * as Mock from '../MockEnvironment';
import { IFieldOption } from '../../src/ui/Base/ComponentOptions';
import { $$, OmniboxEvents, QueryStateModel } from '../Test';
import { Omnibox, IOmniboxSuggestion } from '../../src/ui/Omnibox/Omnibox';
import { IPopulateOmniboxSuggestionsEventArgs } from '../../src/events/OmniboxEvents';
import { IFacetValueSuggestionsProvider, IFacetValueSuggestionRow } from '../../src/ui/FacetValueSuggestions/FacetValueSuggestionsProvider';
import { QuerySuggestAddon } from '../../src/ui/Omnibox/QuerySuggestAddon';

export function FacetValueSuggestionsTest() {
  describe('FacetValueSuggestions', () => {
    let test: Mock.IBasicComponentSetup<FacetValueSuggestions>;
    let facetValueSuggestionsProvider: IFacetValueSuggestionsProvider;
    let omniboxInstance: Omnibox;
    const aKeyword = 'bloup';
    const someSuggestionValue = 'wowow';
    const anOmniboxSuggestionKeyword = 'fish';
    const getSuggestionValue = () => {
      return <IFacetValueSuggestionRow>{
        keyword: aKeyword,
        numberOfResults: 10,
        score: {
          distanceFromTotalForField: 100
        },
        value: someSuggestionValue
      };
    };
    const getOmniboxSuggestionValue = () => {
      return <IOmniboxSuggestion>{
        text: anOmniboxSuggestionKeyword
      };
    };
    const someField: string = '@bloupbloup';

    const triggerPopulateOmniboxEvent = async () => {
      const args: IPopulateOmniboxSuggestionsEventArgs = {
        suggestions: [],
        omnibox: omniboxInstance
      };
      $$(test.cmp.root).trigger(OmniboxEvents.populateOmniboxSuggestions, args);
      await Promise.all(args.suggestions);
      return args;
    };

    const setUpSuggestionsFromProviderToReturn = (suggestions: IFacetValueSuggestionRow[]) => {
      (<jasmine.Spy>facetValueSuggestionsProvider.getSuggestions).and.returnValue(Promise.resolve(suggestions));
    };

    const setUpOmniboxSuggestionsToReturn = (suggestions: IOmniboxSuggestion[]) => {
      (<jasmine.Spy>omniboxInstance.suggestionAddon.getSuggestion).and.returnValue(Promise.resolve(suggestions));
    };

    const firstSuggestion = (args: IPopulateOmniboxSuggestionsEventArgs) => {
      return <Promise<Coveo.MagicBox.Suggestion[]>>args.suggestions[0];
    };

    const setUpKeywordInOmnibox = (keyword: string) => {
      omniboxInstance.getText = () => keyword;
    };

    beforeEach(() => {
      facetValueSuggestionsProvider = <IFacetValueSuggestionsProvider>{
        getSuggestions: jasmine.createSpy('getSuggestions')
      };
      setUpSuggestionsFromProviderToReturn([]);
      omniboxInstance = Mock.mock(Omnibox);
      omniboxInstance.suggestionAddon = Mock.mock(QuerySuggestAddon);
      omniboxInstance.suggestionAddon.getSuggestion = jasmine.createSpy('getSuggestions');
      setUpKeywordInOmnibox(aKeyword);
      setUpOmniboxSuggestionsToReturn([]);
      test = Mock.basicComponentSetup<FacetValueSuggestions>(FacetValueSuggestions, <IFacetValueSuggestionsOptions>{
        field: <IFieldOption>someField
      });
      test.cmp.facetValueSuggestionsProvider = facetValueSuggestionsProvider;
    });

    afterEach(() => {
      test = null;
    });

    it('does not populate suggestions when there are no suggestions', async done => {
      const resultingArgs = await triggerPopulateOmniboxEvent();

      firstSuggestion(resultingArgs).then(result => {
        expect(result.length).toBe(0);
        done();
      });
    });

    describe('when the provider resolves suggestions', () => {
      beforeEach(() => {
        setUpSuggestionsFromProviderToReturn([getSuggestionValue()]);
      });

      it('populates suggestions', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        firstSuggestion(resultingArgs).then(result => {
          expect(result.length).toBe(1);
          done();
        });
      });

      it('changes the omnibox text to the suggestion keyword', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        firstSuggestion(resultingArgs).then(result => {
          result[0].onSelect();
          expect(omniboxInstance.setText).toHaveBeenCalledWith(aKeyword);
          done();
        });
      });

      it('changes the fv state when clicking on a suggestion', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        firstSuggestion(resultingArgs).then(result => {
          result[0].onSelect();
          expect(test.env.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.fv, {
            [someField]: [someSuggestionValue]
          });
          done();
        });
      });

      it('merges the original fv state when clicking on a suggestion', async done => {
        test.env.queryStateModel.get = () => {
          return {
            wow: 'existingvalue'
          };
        };

        const resultingArgs = await triggerPopulateOmniboxEvent();

        firstSuggestion(resultingArgs).then(result => {
          result[0].onSelect();
          expect(test.env.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.fv, {
            wow: 'existingvalue',
            [someField]: [someSuggestionValue]
          });
          done();
        });
      });

      it('executes a query and log usage analytics when clicking on a suggestion', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        firstSuggestion(resultingArgs).then(result => {
          result[0].onSelect();
          expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalled();
          expect(test.env.queryController.executeQuery).toHaveBeenCalled();
          done();
        });
      });
    });

    it('calls suggestions without the omnibox keyword when the useValueFromSearchbox options is false', async done => {
      test.cmp.options.useValueFromSearchbox = false;

      await triggerPopulateOmniboxEvent();

      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledTimes(1);
      expect(facetValueSuggestionsProvider.getSuggestions).not.toHaveBeenCalledWith([aKeyword]);
      done();
    });

    it('calls suggestions with the omnibox keyword when the useValueFromSearchbox options is true', async done => {
      test.cmp.options.useValueFromSearchbox = true;

      await triggerPopulateOmniboxEvent();

      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledTimes(1);
      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledWith([aKeyword]);
      done();
    });

    describe('when the omnibox has suggestions', () => {
      beforeEach(() => {
        setUpOmniboxSuggestionsToReturn([getOmniboxSuggestionValue()]);
      });

      it('calls suggestions with the shown omnibox suggestions keyword when the useQuerySuggestions options is true', async done => {
        test.cmp.options.useQuerySuggestions = true;

        await triggerPopulateOmniboxEvent();

        expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledTimes(1);
        expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledWith([anOmniboxSuggestionKeyword]);
        done();
      });

      it('calls suggestions without the shown omnibox suggestions keyword when the useQuerySuggestions options is false', async done => {
        test.cmp.options.useQuerySuggestions = false;

        await triggerPopulateOmniboxEvent();

        expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledTimes(1);
        expect(facetValueSuggestionsProvider.getSuggestions).not.toHaveBeenCalledWith([anOmniboxSuggestionKeyword]);
        done();
      });
    });

    it('filters suggestions that are the same keywords', async done => {
      setUpOmniboxSuggestionsToReturn([getOmniboxSuggestionValue(), getOmniboxSuggestionValue()]);

      await triggerPopulateOmniboxEvent();

      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledTimes(1);
      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledWith([anOmniboxSuggestionKeyword]);
      done();
    });

    it('caches results by keywords', async done => {
      test.cmp.options.useValueFromSearchbox = true;

      const anotherKeyword = 'anotherkeyword';
      await triggerPopulateOmniboxEvent();
      await triggerPopulateOmniboxEvent();

      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledTimes(1);
      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledWith([aKeyword]);

      setUpKeywordInOmnibox(anotherKeyword);
      await triggerPopulateOmniboxEvent();

      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledTimes(2);
      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledWith([anotherKeyword]);

      done();
    });
  });
}
