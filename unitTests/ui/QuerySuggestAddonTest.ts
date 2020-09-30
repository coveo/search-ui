import { Omnibox } from '../../src/ui/Omnibox/Omnibox';
import * as Mock from '../MockEnvironment';
import { QuerySuggestAddon } from '../../src/ui/Omnibox/QuerySuggestAddon';
import { IQuerySuggestResponse } from '../../src/rest/QuerySuggest';
import { QUERY_STATE_ATTRIBUTES } from '../../src/models/QueryStateModel';
import { $$, OmniboxEvents } from '../../src/Core';
import { IBuildingQuerySuggestArgs, IQuerySuggestSuccessArgs } from '../../src/events/OmniboxEvents';
import { buildHistoryStore } from '../../src/utils/HistoryStore';

export function QuerySuggestAddonTest() {
  describe('QuerySuggest', () => {
    let omnibox: Mock.IBasicComponentSetup<Omnibox>;
    let querySuggest: QuerySuggestAddon;

    const simulateFakeSuggestions = (suggestions: IQuerySuggestResponse) => {
      (omnibox.env.searchEndpoint.getQuerySuggest as jasmine.Spy).and.returnValue(suggestions);
    };

    beforeEach(() => {
      omnibox = Mock.basicComponentSetup<Omnibox>(Omnibox);
    });

    afterEach(() => {
      omnibox = null;
    });

    describe('should call the query suggest service', () => {
      beforeEach(() => {
        simulateFakeSuggestions({ completions: [{ executableConfidence: 1, expression: 'foo', highlighted: 'foo', score: 1 }] });
      });

      const spyShouldHaveBeenCalledWith = (paramName: string, paramValue: any) => {
        expect(omnibox.env.searchEndpoint.getQuerySuggest).toHaveBeenCalledWith(jasmine.objectContaining({ [paramName]: paramValue }));
      };

      it('with the locale', async done => {
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('locale', jasmine.any(String));
        done();
      });

      it('with the search hub', async done => {
        (omnibox.env.componentOptionsModel.get as jasmine.Spy).and.returnValue('a search hub');
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('searchHub', 'a search hub');
        done();
      });

      it('with the pipeline', async done => {
        omnibox.env.searchInterface.options.pipeline = 'a pipeline';
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('pipeline', 'a pipeline');
        done();
      });

      it('with the context', async done => {
        const fakeContext = { 'context key': 'context value' };
        (omnibox.env.searchInterface.getQueryContext as jasmine.Spy).and.returnValue(fakeContext);
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('context', fakeContext);
        done();
      });

      it('with the tab', async done => {
        (omnibox.env.queryStateModel.get as jasmine.Spy).and.callFake(
          (param: string) => (param == QUERY_STATE_ATTRIBUTES.T ? 'a tab' : 'something else')
        );
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('tab', 'a tab');
        done();
      });

      it("without the tab if it's empty", async done => {
        (omnibox.env.queryStateModel.get as jasmine.Spy).and.callFake(
          (param: string) => (param == QUERY_STATE_ATTRIBUTES.T ? '' : 'something else')
        );
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('tab', undefined);
        done();
      });

      it('with enableWordCompletion', async done => {
        omnibox.cmp.options.enableSearchAsYouType = true;
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('enableWordCompletion', true);
        done();
      });

      it('with count', async done => {
        omnibox.cmp.options.numberOfSuggestions = 123;
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('count', 123);
        done();
      });

      it('with actionsHistory', async done => {
        const fakeStoreEntry = { name: 'foo', value: 'foo', time: new Date().toString() };
        const store = buildHistoryStore();
        store.addElement({ ...fakeStoreEntry });
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('actionsHistory', jasmine.arrayContaining([fakeStoreEntry]));
        store.clear();
        done();
      });

      it('with timezone', async done => {
        omnibox.env.searchInterface.options.timezone = 'foo';
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('timezone', 'foo');
        done();
      });

      it('with isGuestUser', async done => {
        omnibox.env.searchEndpoint.options.isGuestUser = true;
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('isGuestUser', true);
        done();
      });

      it('with referrer', async done => {
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('referrer', document.referrer);
        done();
      });

      it('should trigger an event before sending the payload', async done => {
        const spyOnEvent = jasmine.createSpy('spyOnEvent');

        $$(omnibox.env.root).on(OmniboxEvents.buildingQuerySuggest, () => spyOnEvent());
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        expect(spyOnEvent).toHaveBeenCalled();
        done();
      });

      it('should trigger an event after suggestions are returned', async done => {
        const spyOnEvent = jasmine.createSpy('spyOnEvent');

        $$(omnibox.env.root).on(OmniboxEvents.querySuggestSuccess, () => spyOnEvent());
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        expect(spyOnEvent).toHaveBeenCalled();
        done();
      });

      it('should allow to modify the query suggestion payload', async done => {
        $$(omnibox.env.root).on(OmniboxEvents.buildingQuerySuggest, (e, args: IBuildingQuerySuggestArgs) => {
          args.payload.timezone = 'bababa';
          args.payload.locale = 'gegegege';
        });

        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        await querySuggest.getSuggestion();
        spyShouldHaveBeenCalledWith('timezone', 'bababa');
        spyShouldHaveBeenCalledWith('locale', 'gegegege');
        done();
      });

      it('should allow to modify query suggestions when they return', async done => {
        $$(omnibox.env.root).on(OmniboxEvents.querySuggestSuccess, (e, args: IQuerySuggestSuccessArgs) => {
          args.completions[0].expression = 'something different';
          args.completions[0].executableConfidence = 999;
        });

        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        const suggestions = await querySuggest.getSuggestion();
        expect(suggestions[0].text).toBe('something different');
        expect(suggestions[0].executableConfidence).toBe(999);
        done();
      });

      it('should contain the HTML version of the suggestions', async done => {
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        const suggestions = await querySuggest.getSuggestion();
        expect(suggestions[0].html).toBeDefined();
        done();
      });
    });

    describe('when the querySuggestCharacterThreshold option is set to a value', () => {
      let magicBoxText;
      let querySuggestSuccessSpy;
      beforeEach(() => {
        simulateFakeSuggestions({ completions: [{ executableConfidence: 1, expression: 'foo', highlighted: 'foo', score: 1 }] });
        magicBoxText = jasmine.createSpy('magicBoxText');
        querySuggestSuccessSpy = jasmine.createSpy('querySuggestSuccessSpy');
        omnibox.cmp.options.querySuggestCharacterThreshold = 3;
        omnibox.cmp.magicBox.getText = magicBoxText;
        $$(omnibox.env.root).on(OmniboxEvents.querySuggestSuccess, () => querySuggestSuccessSpy());
      });

      it('when the magic box text length is equal to the querySuggestCharacterThreshold option should trigger query suggestion', async done => {
        magicBoxText.and.returnValue('foo');
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        const suggestionReturned = await querySuggest.getSuggestion();
        expect(suggestionReturned.length).toBe(1);
        done();
      });

      it('when the magic box text length is greater than the querySuggestCharacterThreshold option should trigger query suggestion', async done => {
        magicBoxText.and.returnValue('fooo');
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        const suggestionReturned = await querySuggest.getSuggestion();
        expect(suggestionReturned.length).toBe(1);
        done();
      });

      it('when the magic box text length is less than the querySuggestCharacterThreshold option should not trigger query suggestion', async done => {
        magicBoxText.and.returnValue('');
        querySuggest = new QuerySuggestAddon(omnibox.cmp);
        const suggestionReturned = await querySuggest.getSuggestion();
        expect(suggestionReturned.length).toBe(0);
        done();
      });
    });
  });
}
