import * as Mock from '../MockEnvironment';
import { QuerySuggestPreview, IQuerySuggestPreview } from '../../src/ui/QuerySuggestPreview/QuerySuggestPreview';
import { IBasicComponentSetup } from '../MockEnvironment';
import { $$, OmniboxEvents, Dom, HtmlTemplate } from '../../src/Core';
import { FakeResults } from '../Fake';
import { SuggestionsManager, Suggestion } from '../../src/magicbox/SuggestionsManager';
import { InputManager } from '../../src/magicbox/InputManager';
import { MagicBoxInstance } from '../../src/magicbox/MagicBox';
import { IQueryResults } from '../../src/rest/QueryResults';
import { OmniboxAnalytics } from '../../src/ui/Omnibox/OmniboxAnalytics';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { last } from 'underscore';

export function QuerySuggestPreviewTest() {
  describe('QuerySuggestPreview', () => {
    let test: IBasicComponentSetup<QuerySuggestPreview>;
    let testEnv: Mock.MockEnvironmentBuilder;
    let container: Dom;
    let suggestionContainer: Dom;
    let suggestionManager: SuggestionsManager;
    let suggestion: Dom;
    let elementInsideSuggestion: Dom;

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
      buildSuggestion();
      const inputManager = new InputManager(document.createElement('div'), () => {}, {} as MagicBoxInstance);

      suggestionManager = new SuggestionsManager(suggestionContainer.el, document.createElement('div'), testEnv.root, inputManager);
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

    beforeEach(() => {
      testEnv = new Mock.MockEnvironmentBuilder();
      testEnv.searchInterface.getOmniboxAnalytics = jasmine.createSpy('omniboxAnalytics').and.returnValue(new OmniboxAnalytics()) as any;
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

      it('it set the attribute coveo-preview-rank with the rank of the preview', done => {
        setupQuerySuggestPreview();
        setupSuggestion();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.coveo-preview-results > .CoveoResult');
          expect(previewContainer.getAttribute('coveo-preview-rank')).toBe('0');
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
      an analytics get logs`, () => {
        const partialQueries = ['t', 'te', 'tes', 'test'];
        const suggestionRanking = 3;
        const suggestions = ['test', 'test2', 'test3'];
        testEnv.searchInterface.getOmniboxAnalytics = jasmine.createSpy('omniboxAnalytics').and.callFake(() => {
          const omniboxAnalytics = new OmniboxAnalytics();
          omniboxAnalytics.partialQueries = partialQueries;
          omniboxAnalytics.suggestionRanking = suggestionRanking;
          omniboxAnalytics.suggestions = suggestions;
          return omniboxAnalytics;
        });
        setupQuerySuggestPreview();
        setupSuggestion();
        triggerQuerySuggestHoverAndPassTime();
        expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.showQuerySuggestPreview,
          jasmine.objectContaining({
            partialQuery: last(partialQueries),
            suggestionRanking,
            partialQueries: partialQueries.join(';'),
            suggestions: suggestions.join(';')
          })
        );
      });
    });

    describe('currentlyDisplayedResults', () => {
      it('currentlyDisplayedResults get populated by rendered results', done => {
        setupQuerySuggestPreview();
        const fakeResults = FakeResults.createFakeResults(test.cmp.options.numberOfPreviewResults);
        setupSuggestion();
        triggerQuerySuggestHover('test', fakeResults);
        setTimeout(() => {
          expect(test.cmp.displayedResults).toEqual(fakeResults.results);
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it('currentlyDisplayedResults get emptied when they aare no result to be rendered', done => {
        setupQuerySuggestPreview();
        const fakeResults = FakeResults.createFakeResults(0);
        setupSuggestion();
        triggerQuerySuggestHover('test', fakeResults);
        setTimeout(() => {
          expect(test.cmp.displayedResults).toEqual([]);
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it('currentlyDisplayedResults get emptied when a querySuggest loose focus', done => {
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

    describe('when we click a rendered preview,', () => {
      function getAResult(done) {
        const previewContainer = $$(suggestionContainer.el).find('.coveo-preview-results > .CoveoResult');
        if (!previewContainer) {
          done.fail('No result to click. Impossible validate the analytics');
        }
        return previewContainer;
      }

      const suggestion = 'test';
      beforeEach(() => {
        setupQuerySuggestPreview();
        setupSuggestion();
        triggerQuerySuggestHover(suggestion);
      });

      it('it log an analytics with the appropriate event', done => {
        setTimeout(() => {
          const previewContainer = getAResult(done);
          previewContainer.click();
          expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
            analyticsActionCauseList.clickQuerySuggestPreview,
            jasmine.objectContaining({
              suggestion,
              displayedRank: 0
            }),
            previewContainer
          );
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it(`it log an analytics with the appropriate event,
      even if we hover on another suggestion before clicking`, done => {
        setTimeout(() => {
          triggerQuerySuggestHover(`bad ${suggestion}`);
          setTimeout(() => {
            const previewContainer = getAResult(done);
            previewContainer.click();
            expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
              analyticsActionCauseList.clickQuerySuggestPreview,
              jasmine.objectContaining({
                suggestion,
                displayedRank: 0
              }),
              previewContainer
            );
            done();
          }, test.cmp.options.executeQueryDelay - 100);
        }, test.cmp.options.executeQueryDelay);
      });
    });
  });
}
