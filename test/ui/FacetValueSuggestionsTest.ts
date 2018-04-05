import { IFacetValueSuggestionsOptions, FacetValueSuggestions } from '../../src/ui/FacetValueSuggestions/FacetValueSuggestions';
import * as Mock from '../MockEnvironment';
import { IFieldOption } from '../../src/ui/Base/ComponentOptions';
import { $$, OmniboxEvents, QueryStateModel, l } from '../Test';
import { Omnibox, IOmniboxSuggestion } from '../../src/ui/Omnibox/Omnibox';
import { IPopulateOmniboxSuggestionsEventArgs } from '../../src/events/OmniboxEvents';
import { IFacetValueSuggestionRow, IFacetValueSuggestionsProvider } from '../../src/ui/FacetValueSuggestions/FacetValueSuggestionsProvider';
import { QuerySuggestAddon } from '../../src/ui/Omnibox/QuerySuggestAddon';

export function FacetValueSuggestionsTest() {
  describe('FacetValueSuggestions', () => {
    let test: Mock.IBasicComponentSetup<FacetValueSuggestions>;
    let facetValueSuggestionsProvider: IFacetValueSuggestionsProvider;
    let omniboxInstance: Omnibox;
    const aKeyword = 'bloup';
    const someSuggestionValue = 'wowow';
    const anOmniboxSuggestionKeyword = 'fish';
    const getSuggestionValue = (): IFacetValueSuggestionRow => {
      return {
        keyword: aKeyword,
        numberOfResults: 10,
        score: {
          distanceFromTotalForField: 100
        },
        value: someSuggestionValue,
        field: someField
      };
    };
    const getOmniboxSuggestionValue = (value?: string): IOmniboxSuggestion => {
      return {
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

    describe('when a template helper is defined', () => {
      let suggestionTemplate: jasmine.Spy;
      beforeEach(() => {
        suggestionTemplate = jasmine.createSpy('suggestionTemplate');
        suggestionTemplate.and.returnValue(someSuggestionValue);
        test.cmp.options.templateHelper = suggestionTemplate;
        setUpSuggestionsFromProviderToReturn([getSuggestionValue()]);
      });

      it('should call the template helper', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        firstSuggestion(resultingArgs).then(result => {
          expect(suggestionTemplate).toHaveBeenCalledTimes(1);
          expect(result[0].html).toBe(someSuggestionValue);
          done();
        });
      });

      it('should fallback to the default template when the template helper throws', async done => {
        suggestionTemplate.and.throwError('my template helper is very bad');
        const resultingArgs = await triggerPopulateOmniboxEvent();

        firstSuggestion(resultingArgs).then(result => {
          expect(suggestionTemplate).toHaveBeenCalledTimes(1);

          expect(result[0].html).toBe(
            l(
              'KeywordInCategory',
              `<span class='coveo-omnibox-hightlight2'>${aKeyword}</span>`,
              `<span class='coveo-omnibox-hightlight'>${someSuggestionValue}</span>`
            )
          );
          done();
        });
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
          expect(result.length).toBe(1);
          result[0].onSelect();
          expect(omniboxInstance.setText).toHaveBeenCalledWith(aKeyword);
          done();
        });
      });

      it('changes the fv state when clicking on a suggestion', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        firstSuggestion(resultingArgs).then(result => {
          expect(result.length).toBe(1);
          result[0].onSelect();
          expect(test.env.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.fv, {
            [someField]: [someSuggestionValue]
          });
          done();
        });
      });

      it('merges the original fv state when clicking on a suggestion', async done => {
        (<jasmine.Spy>test.env.queryStateModel.get).and.callFake((id: string) => {
          return id === 'fv' ? { wow: 'existingvalue' } : '';
        });

        const resultingArgs = await triggerPopulateOmniboxEvent();

        firstSuggestion(resultingArgs).then(result => {
          expect(result.length).toBe(1);
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
          expect(result.length).toBe(1);
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

    it('filters values selected in a facet', async done => {
      const aValueToFilter = 'filterthisplz';
      const suggestionThatShouldBeFiltered: IFacetValueSuggestionRow = {
        keyword: aKeyword,
        numberOfResults: 10,
        score: {
          distanceFromTotalForField: 100
        },
        value: aValueToFilter,
        field: someField
      };
      setUpSuggestionsFromProviderToReturn([suggestionThatShouldBeFiltered, getSuggestionValue()]);
      (<jasmine.Spy>test.env.queryStateModel.get).and.callFake((id: string) => (id === `f:${someField}` ? [aValueToFilter] : []));

      const resultingArgs = await triggerPopulateOmniboxEvent();

      firstSuggestion(resultingArgs).then(result => {
        expect(result.length).toBe(1);
        done();
      });
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
