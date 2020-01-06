import { IPopulateOmniboxSuggestionsEventArgs } from '../../src/events/OmniboxEvents';
import { Suggestion } from '../../src/magicbox/SuggestionsManager';
import { IFieldOption } from '../../src/ui/Base/IComponentOptions';
import {
  FacetValueSuggestions,
  IFacetValueSuggestionsOptions,
  IQuerySuggestionKeyword
} from '../../src/ui/FacetValueSuggestions/FacetValueSuggestions';
import { IFacetValueSuggestionRow, IFacetValueSuggestionsProvider } from '../../src/ui/FacetValueSuggestions/FacetValueSuggestionsProvider';
import { IOmniboxSuggestion, Omnibox } from '../../src/ui/Omnibox/Omnibox';
import { QuerySuggestAddon } from '../../src/ui/Omnibox/QuerySuggestAddon';
import * as Mock from '../MockEnvironment';
import { $$, l, OmniboxEvents, QueryStateModel } from '../Test';

export function FacetValueSuggestionsTest() {
  describe('FacetValueSuggestions', () => {
    let test: Mock.IBasicComponentSetup<FacetValueSuggestions>;
    let facetValueSuggestionsProvider: IFacetValueSuggestionsProvider;
    let omniboxInstance: Omnibox;
    const aKeyword: IQuerySuggestionKeyword = {
      text: 'bloup',
      html: `<span class='coveo-omnibox-hightlight'>bloup</span>`
    };
    const someSuggestionValue = 'wowow';
    const anOmniboxSuggestionKeyword: IQuerySuggestionKeyword = {
      text: 'fish',
      html: `<span class='coveo-omnibox-hightlight'>fish</span>`
    };
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
    const getOmniboxSuggestionValue = (keyword?: IQuerySuggestionKeyword): IOmniboxSuggestion => {
      return keyword || anOmniboxSuggestionKeyword;
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
      return <Promise<Suggestion[]>>args.suggestions[0];
    };

    const setUpKeywordTextInOmnibox = (text: string) => {
      omniboxInstance.getText = () => text;
    };

    beforeEach(() => {
      facetValueSuggestionsProvider = <IFacetValueSuggestionsProvider>{
        getSuggestions: jasmine.createSpy('getSuggestions')
      };
      setUpSuggestionsFromProviderToReturn([]);
      omniboxInstance = Mock.mock(Omnibox);
      omniboxInstance.suggestionAddon = Mock.mock(QuerySuggestAddon);
      omniboxInstance.suggestionAddon.getSuggestion = jasmine.createSpy('getSuggestions');
      omniboxInstance.magicBox = {
        blur: jasmine.createSpy('blur')
      } as any;
      setUpKeywordTextInOmnibox(aKeyword.text);
      setUpOmniboxSuggestionsToReturn([getOmniboxSuggestionValue()]);
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

      const result = await firstSuggestion(resultingArgs);
      expect(result.length).toBe(0);
      done();
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

        const result = await firstSuggestion(resultingArgs);
        expect(suggestionTemplate).toHaveBeenCalledTimes(1);
        expect(result[0].html).toBe(someSuggestionValue);
        done();
      });

      it('should fallback to the default template when the template helper throws', async done => {
        suggestionTemplate.and.throwError('my template helper is very bad');
        const resultingArgs = await triggerPopulateOmniboxEvent();

        const result = await firstSuggestion(resultingArgs);
        expect(suggestionTemplate).toHaveBeenCalledTimes(1);

        expect(result[0].html).toBe(
          l('KeywordInCategory', `${aKeyword.html}`, `<span class='coveo-omnibox-hightlight'>${someSuggestionValue}</span>`)
        );
        done();
      });
    });

    describe('when the field is a category field', () => {
      beforeEach(() => {
        setUpKeywordTextInOmnibox(aKeyword.text);
        setUpOmniboxSuggestionsToReturn([getOmniboxSuggestionValue()]);
        test.cmp.options.isCategoryField = true;
      });

      describe('with standard delimiter', () => {
        beforeEach(() => {
          setUpSuggestionsFromProviderToReturn([
            { field: someField, keyword: aKeyword, numberOfResults: 10, score: { distanceFromTotalForField: 100 }, value: 'a|b|c|d' }
          ]);
        });

        it('should modify the state by correctly splitting the field value', async done => {
          const resultingArgs = await triggerPopulateOmniboxEvent();

          const result = await firstSuggestion(resultingArgs);
          result[0].onSelect();
          expect(test.env.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.fv, {
            [someField]: ['a', 'b', 'c', 'd']
          });
          done();
        });

        it('should set the advanced query to check every field value', async done => {
          const resultingArgs = await triggerPopulateOmniboxEvent();

          const result = await firstSuggestion(resultingArgs);
          expect(result[0].advancedQuery).toEqual(`${someField}=="a" AND ${someField}=="b" AND ${someField}=="c" AND ${someField}=="d"`);
          done();
        });
      });

      describe('with a custom delimiter', () => {
        beforeEach(() => {
          setUpSuggestionsFromProviderToReturn([
            { field: someField, keyword: aKeyword, numberOfResults: 10, score: { distanceFromTotalForField: 100 }, value: 'a>b>c>d' }
          ]);
          test.cmp.options.categoryFieldDelimitingCharacter = '>';
        });

        it('should modify the state by correctly splitting the field value', async done => {
          const resultingArgs = await triggerPopulateOmniboxEvent();

          const result = await firstSuggestion(resultingArgs);
          result[0].onSelect();
          expect(test.env.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.fv, {
            [someField]: ['a', 'b', 'c', 'd']
          });
          done();
        });

        it('should set the advanced query to check every field value', async done => {
          const resultingArgs = await triggerPopulateOmniboxEvent();

          const result = await firstSuggestion(resultingArgs);
          expect(result[0].advancedQuery).toEqual(`${someField}=="a" AND ${someField}=="b" AND ${someField}=="c" AND ${someField}=="d"`);
          done();
        });
      });
    });

    describe('when no keywords are provided', () => {
      beforeEach(() => {
        setUpOmniboxSuggestionsToReturn([]);
        setUpKeywordTextInOmnibox('');
        setUpSuggestionsFromProviderToReturn([getSuggestionValue()]);

        test.cmp.options.useValueFromSearchbox = true;
        test.cmp.options.useQuerySuggestions = true;
      });

      it('should not call the suggestions provider', async done => {
        await triggerPopulateOmniboxEvent();

        expect(facetValueSuggestionsProvider.getSuggestions).not.toHaveBeenCalled();
        done();
      });
    });

    describe('when the provider resolves suggestions', () => {
      beforeEach(() => {
        setUpSuggestionsFromProviderToReturn([getSuggestionValue(), getSuggestionValue(), getSuggestionValue()]);
      });

      it('populates suggestions', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        const result = await firstSuggestion(resultingArgs);
        expect(result.length).toBe(3);
        done();
      });

      it('should respect the numberOfSuggestions option when the value is less than what is returned', async done => {
        test.cmp.options.numberOfSuggestions = 2;
        const resultingArgs = await triggerPopulateOmniboxEvent();
        const result = await firstSuggestion(resultingArgs);
        expect(result.length).toBe(2);
        done();
      });

      it('should respect the numberOfSuggestions option when the value is more than what is returned', async done => {
        test.cmp.options.numberOfSuggestions = 99;
        const resultingArgs = await triggerPopulateOmniboxEvent();
        const result = await firstSuggestion(resultingArgs);
        expect(result.length).toBe(3);
        done();
      });

      it('should respect the numberOfSuggestions option when the value is 0', async done => {
        test.cmp.options.numberOfSuggestions = 0;
        const resultingArgs = await triggerPopulateOmniboxEvent();
        const result = await firstSuggestion(resultingArgs);
        expect(result.length).toBe(0);
        done();
      });

      it('should respect the numberOfSuggestions option when the value is 1', async done => {
        test.cmp.options.numberOfSuggestions = 1;
        const resultingArgs = await triggerPopulateOmniboxEvent();
        const result = await firstSuggestion(resultingArgs);
        expect(result.length).toBe(1);
        done();
      });

      it('changes the omnibox text to the suggestion keyword', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        const result = await firstSuggestion(resultingArgs);
        result[0].onSelect();
        expect(omniboxInstance.setText).toHaveBeenCalledWith(aKeyword.text);
        done();
      });

      it('changes the advanced query of the suggestion', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        const result = await firstSuggestion(resultingArgs);
        expect(result[0].advancedQuery).toEqual(`${someField}=="${someSuggestionValue}"`);
        done();
      });

      it('changes the fv state when clicking on a suggestion', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        const result = await firstSuggestion(resultingArgs);
        result[0].onSelect();
        expect(test.env.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.fv, {
          [someField]: [someSuggestionValue]
        });
        done();
      });

      it('merges the original fv state when clicking on a suggestion', async done => {
        (<jasmine.Spy>test.env.queryStateModel.get).and.callFake((id: string) => {
          return id === 'fv' ? { wow: 'existingvalue' } : '';
        });

        const resultingArgs = await triggerPopulateOmniboxEvent();

        const result = await firstSuggestion(resultingArgs);
        result[0].onSelect();
        expect(test.env.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.fv, {
          wow: 'existingvalue',
          [someField]: [someSuggestionValue]
        });
        done();
      });

      it('executes a query and log usage analytics when clicking on a suggestion', async done => {
        const resultingArgs = await triggerPopulateOmniboxEvent();

        const result = await firstSuggestion(resultingArgs);
        result[0].onSelect();
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalled();
        expect(test.env.queryController.executeQuery).toHaveBeenCalled();
        done();
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
      test.cmp.options.useQuerySuggestions = false;

      await triggerPopulateOmniboxEvent();

      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledTimes(1);
      expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledWith([aKeyword]);
      done();
    });

    describe('when the omnibox has suggestions', () => {
      beforeEach(() => {
        test.cmp.options.useQuerySuggestions = true;
        setUpOmniboxSuggestionsToReturn([getOmniboxSuggestionValue()]);
      });

      it('calls suggestions with the shown omnibox suggestions keyword when the useQuerySuggestions options is true', async done => {
        test.cmp.options.useQuerySuggestions = true;

        await triggerPopulateOmniboxEvent();

        expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledTimes(1);
        expect(facetValueSuggestionsProvider.getSuggestions).toHaveBeenCalledWith([anOmniboxSuggestionKeyword]);
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

      const result = await firstSuggestion(resultingArgs);
      expect(result.length).toBe(1);
      done();
    });

    describe('when only using the search box keywords', () => {
      beforeEach(() => {
        test.cmp.options.useValueFromSearchbox = true;
        test.cmp.options.useQuerySuggestions = false;
      });

      it(`returns no suggestions`, async done => {
        setUpKeywordTextInOmnibox(anOmniboxSuggestionKeyword.text);
        const resultingArgs = await triggerPopulateOmniboxEvent();

        const result = await firstSuggestion(resultingArgs);
        expect(result.length).toBe(0);
        done();
      });

      it('still returns no suggestions if the omnibox is empty', async done => {
        setUpKeywordTextInOmnibox('');
        const resultingArgs = await triggerPopulateOmniboxEvent();

        const result = await firstSuggestion(resultingArgs);
        expect(result.length).toBe(0);
        done();
      });

      it(`calls the provider's getSuggestions with the omnibox's text if it isn't empty`, async done => {
        setUpKeywordTextInOmnibox(anOmniboxSuggestionKeyword.text);
        await triggerPopulateOmniboxEvent();

        expect(facetValueSuggestionsProvider.getSuggestions as jasmine.Spy).toHaveBeenCalledWith([anOmniboxSuggestionKeyword]);
        done();
      });

      it(`doesn't call the provider's getSuggestions if the omnibox is empty`, async done => {
        setUpKeywordTextInOmnibox('');
        await triggerPopulateOmniboxEvent();

        expect(facetValueSuggestionsProvider.getSuggestions as jasmine.Spy).not.toHaveBeenCalled();
        done();
      });
    });
  });
}
