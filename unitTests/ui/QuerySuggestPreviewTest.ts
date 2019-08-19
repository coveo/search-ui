import * as Mock from '../MockEnvironment';
import { IBasicComponentSetup } from '../MockEnvironment';
import { QuerySuggestPreview, IQuerySuggestPreview } from '../../src/ui/QuerySuggestPreview/QuerySuggestPreview';
import { IOmniboxAnalytics } from '../../src/ui/Omnibox/OmniboxAnalytics';
import { $$, OmniboxEvents, HtmlTemplate, Dom } from '../../src/Core';
import { FakeResults } from '../Fake';
import { IAnalyticsOmniboxSuggestionMeta, analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { Suggestion, SuggestionsManager } from '../../src/magicbox/SuggestionsManager';
import { InputManager } from '../../src/magicbox/InputManager';
import { MagicBoxInstance } from '../../src/magicbox/MagicBox';
import { IQueryResults } from '../../src/rest/QueryResults';
import { last } from 'underscore';

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
    let container: Dom;
    let suggestionContainer: Dom;
    let suggestionManager: SuggestionsManager;
    let suggestion: Dom;
    let elementInsideSuggestion: Dom;
    let omniboxAnalytics: IOmniboxAnalytics;

    function setupQuerySuggestPreview(options: IQuerySuggestPreview = {}) {
      const tmpl: HtmlTemplate = Mock.mock<HtmlTemplate>(HtmlTemplate);
      options['resultTemplate'] = tmpl;

      test = Mock.advancedComponentSetup<QuerySuggestPreview>(
        QuerySuggestPreview,
        new Mock.AdvancedComponentSetupOptions(null, options, env => testEnv)
      );
    }

    function triggerQuerySuggestHover(suggestion: string = 'test', fakeResults?: IQueryResults) {
      fakeResults = fakeResults || FakeResults.createFakeResults(test.cmp.options.numberOfPreviewResults);
      (test.env.searchEndpoint.search as jasmine.Spy).and.returnValue(Promise.resolve(fakeResults));
      $$(testEnv.root).trigger(OmniboxEvents.querySuggestGetFocus, { suggestion });
    }

    function triggerQuerySuggestHoverAndPassTime(suggestion: string = 'test', fakeResults?: IQueryResults) {
      triggerQuerySuggestHover(suggestion);
      jasmine.clock().tick(test.cmp.options.executeQueryDelay);
    }

    function buildSuggestion() {
      container = $$(document.createElement('div'));
      suggestionContainer = $$(document.createElement('div'));
      suggestion = $$(document.createElement('div'));
      elementInsideSuggestion = $$(document.createElement('div'));

      suggestion.el.appendChild(elementInsideSuggestion.el);
      suggestionContainer.el.appendChild(suggestion.el);
      container.el.appendChild(suggestionContainer.el);
    }

    function setupSuggestionManager() {
      const root = document.createElement('div');
      buildSuggestion();
      const inputManager = new InputManager(document.createElement('div'), () => {}, {} as MagicBoxInstance, root);

      suggestionManager = new SuggestionsManager(suggestionContainer.el, root, testEnv.root, inputManager);
    }

    function setupRenderPreview() {
      test.env.root.appendChild(suggestionContainer.el);
      (test.cmp.options.resultTemplate.instantiateToElement as jasmine.Spy).and.returnValue(Promise.resolve($$('div').el));
    }

    function setupSuggestion(suggestions: Suggestion[] = [{ text: 'test' }]) {
      setupSuggestionManager();
      setupRenderPreview();
      suggestionManager.updateSuggestions(suggestions);
    }

    function waitXms(ms: number) {
      return Promise.resolve(
        setTimeout(() => {
          return;
        }, ms)
      );
    }

    beforeEach(() => {
      testEnv = new Mock.MockEnvironmentBuilder();
      omniboxAnalytics = this.initOmniboxAnalyticsMock(omniboxAnalytics);
      testEnv.searchInterface.getOmniboxAnalytics = jasmine.createSpy('omniboxAnalytics').and.returnValue(omniboxAnalytics) as any;
    });

    describe('expose options', () => {
      beforeEach(() => {
        jasmine.clock().install();
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it('numberOfPreviewResults set the number of results to query', () => {
        const numberOfPreviewResults = 5;
        setupQuerySuggestPreview({ numberOfPreviewResults });
        setupSuggestion();
        triggerQuerySuggestHoverAndPassTime();
        expect(test.cmp.queryController.getLastQuery().numberOfResults).toBe(numberOfPreviewResults);
      });

      it('hoverTime set the time before the query is executed', () => {
        const executeQueryDelay = 200;
        setupQuerySuggestPreview({ executeQueryDelay });
        setupSuggestion();
        expect(test.cmp.queryController.getLastQuery).not.toHaveBeenCalled();
        triggerQuerySuggestHoverAndPassTime();
        expect(test.cmp.queryController.getLastQuery).toHaveBeenCalledTimes(1);
      });

      it('previewWidth change the witdh of the preview container', () => {
        const width = 500;
        setupQuerySuggestPreview({ previewWidth: width });
        setupSuggestion();
        triggerQuerySuggestHoverAndPassTime();
        const previewContainer = $$(suggestionContainer.el).find('.coveo-preview-container');
        expect(previewContainer.style.width).toEqual(`${width}px`);
      });

      it('suggestionWidth change the width of the suggestion container', () => {
        const suggestionWidth = 250;
        setupQuerySuggestPreview({ suggestionWidth });
        setupSuggestion();
        triggerQuerySuggestHoverAndPassTime();
        const suggestionContainerById = $$(suggestionContainer.el).find('.coveo-magicbox-suggestions');
        expect(suggestionContainerById.style.width).toBe(`${suggestionWidth}px`);
      });

      it('headerText change the text in the header of the preview', done => {
        const headerText = 'Super Header';
        const suggestion = 'test';
        //We can't use the clock here because we are validating a DOM element
        //Since we need to wait for some promise to finish and I can't wait for them
        //since they were triggered by an event. Meanwhile, Jasmine will continue to
        //evaluate and would fail the test
        jasmine.clock().uninstall();
        setupQuerySuggestPreview({ headerText });
        setupSuggestion();
        triggerQuerySuggestHover(suggestion);
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.coveo-preview-header');
          expect(previewContainer.innerText).toBe(`${headerText} "${suggestion}"`);
          done();
        }, test.cmp.options.executeQueryDelay);
      });
    });

    describe('when the previews are rendered,', () => {
      it(`if we have four element,
      each take 50% of the remaining available space`, done => {
        setupQuerySuggestPreview({ numberOfPreviewResults: 4 });
        setupSuggestion();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.CoveoResult');
          expect(previewContainer.style.flex).toBe('0 0 50%');
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it(`if we DON'T have 4 htmlElement,
      each take 33% of the remaining available space`, done => {
        setupQuerySuggestPreview({ numberOfPreviewResults: 6 });
        setupSuggestion();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.CoveoResult');
          expect(previewContainer.style.flex).toBe('0 0 33%');
          done();
        }, test.cmp.options.executeQueryDelay);
      });
    });

    describe('When we hover', () => {
      beforeEach(() => {
        jasmine.clock().install();
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it(`on the same Suggestion multiple times before the time in the option hoverTime has passed,
      the query is is executed only once`, done => {
        setupQuerySuggestPreview();
        test.cmp.queryController.getEndpoint().search = jasmine.createSpy('execQuery');
        setupSuggestion();
        triggerQuerySuggestHover();
        triggerQuerySuggestHover();
        triggerQuerySuggestHoverAndPassTime();
        expect(test.cmp.queryController.getEndpoint().search).toHaveBeenCalledTimes(1);
        done();
      });

      it(`on multiple suggestion before the time in the option hoverTime has passed,
      the query is is executed only once with the last Suggestion we hovered on`, done => {
        const realQuery = 'testing3';
        setupQuerySuggestPreview();
        test.cmp.queryController.getEndpoint().search = jasmine.createSpy('execQuery');
        setupSuggestion();
        triggerQuerySuggestHover('testing');
        triggerQuerySuggestHover('testing2');
        triggerQuerySuggestHoverAndPassTime(realQuery);
        expect(test.cmp.queryController.getEndpoint().search).toHaveBeenCalledTimes(1);
        expect(test.cmp.queryController.getLastQuery().q).toBe(realQuery);
        done();
      });

      it(`and the query get executed, 
      it logs an analytics search event`, () => {
        setupQuerySuggestPreview();
        setupSuggestion();
        triggerQuerySuggestHoverAndPassTime();

        expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.showQuerySuggestPreview,
          jasmine.objectContaining(getMetadata(omniboxAnalytics))
        );
      });
    });

    describe('currentlyDisplayedResults', () => {
      it('get populated by rendered results', done => {
        setupQuerySuggestPreview();
        const fakeResults = FakeResults.createFakeResults(test.cmp.options.numberOfPreviewResults);
        setupSuggestion();
        triggerQuerySuggestHover('test', fakeResults);
        setTimeout(() => {
          expect(test.cmp.displayedResults).toEqual(fakeResults.results);
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it('get emptied when they aare no result to be rendered', done => {
        setupQuerySuggestPreview();
        const fakeResults = FakeResults.createFakeResults(0);
        setupSuggestion();
        triggerQuerySuggestHover('test', fakeResults);
        setTimeout(() => {
          expect(test.cmp.displayedResults).toEqual([]);
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it('get emptied when a querySuggest loose focus', done => {
        setupQuerySuggestPreview();
        setupSuggestion();
        triggerQuerySuggestHover('test');
        setTimeout(() => {
          expect(test.cmp.displayedResults.length).toEqual(test.cmp.options.numberOfPreviewResults);
          $$(test.cmp.root).trigger(OmniboxEvents.querySuggestLoseFocus);
          expect(test.cmp.displayedResults).toEqual([]);
          done();
        }, test.cmp.options.executeQueryDelay);
      });
    });

    describe('SuggestionManager', () => {
      it(`when moving right,
      it returns a QuerySuggestPreview`, done => {
        setupQuerySuggestPreview();
        const fakeResults = FakeResults.createFakeResults(test.cmp.options.numberOfPreviewResults);
        setupSuggestion();
        triggerQuerySuggestHover('test', fakeResults);
        setTimeout(() => {
          suggestionManager.moveRight();
          const selectedWithKeyboard = suggestionManager.selectAndReturnKeyboardFocusedElement();
          expect(selectedWithKeyboard.classList).toContain('coveo-preview-selectable');
          expect(selectedWithKeyboard.classList).toContain('magic-box-selected');
          done();
        }, test.cmp.options.executeQueryDelay);
      });
    });

    describe('Analytics', () => {
      function getAResult() {
        const previewContainer = $$(suggestionContainer.el).find('.coveo-preview-results > .CoveoResult');
        return previewContainer;
      }

      function getAnalyticsMetadata(suggestion: string) {
        return jasmine.objectContaining({
          suggestion,
          displayedRank: 0
        });
      }

      it('it log an analytics with the appropriate event', async done => {
        const suggestion = 'test';
        triggerQuerySuggestHover(suggestion);
        await waitXms(test.cmp.options.executeQueryDelay);
        const previewContainer = getAResult();
        previewContainer.click();
        expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.clickQuerySuggestPreview,
          getAnalyticsMetadata(suggestion),
          previewContainer
        );
        done();
      });

      it(`it log an analytics with the appropriate event,
      even if we hover on another suggestion before clicking`, async done => {
        const suggestion = 'test';
        triggerQuerySuggestHover(suggestion);
        await waitXms(test.cmp.options.executeQueryDelay);
        triggerQuerySuggestHover(`bad ${suggestion}`);
        await waitXms(test.cmp.options.executeQueryDelay - 100);
        const previewContainer = getAResult();
        previewContainer.click();
        expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.clickQuerySuggestPreview,
          getAnalyticsMetadata(suggestion),
          previewContainer
        );
        done();
      });
    });
  });
}
