import * as Mock from '../MockEnvironment';
import { QuerySuggestPreview, IQuerySuggestPreview } from '../../src/ui/QuerySuggestPreview/QuerySuggestPreview';
import { IBasicComponentSetup } from '../MockEnvironment';
import { $$, OmniboxEvents, Dom, HtmlTemplate } from '../../src/Core';
import { FakeResults } from '../Fake';
import { SuggestionsManager, Suggestion } from '../../src/magicbox/SuggestionsManager';
import { InputManager } from '../../src/magicbox/InputManager';
import { MagicBoxInstance } from '../../src/magicbox/MagicBox';

export function QuerySuggestPreviewTest() {
  describe('QuerySuggestPreview', () => {
    let test: IBasicComponentSetup<QuerySuggestPreview>;
    let testEnv: Mock.MockEnvironmentBuilder;
    let container: Dom;
    let suggestionContainer: Dom;
    let suggestionManager: SuggestionsManager;
    let suggestion: Dom;
    let elementInsideSuggestion: Dom;
    let selectableClass = 'selectable';
    let selectedClass = 'selected';
    function setupQuerySuggestPreview(options: IQuerySuggestPreview = {}) {
      const tmpl: HtmlTemplate = Mock.mock<HtmlTemplate>(HtmlTemplate);
      options['resultTemplate'] = tmpl;
      test = Mock.advancedComponentSetup<QuerySuggestPreview>(
        QuerySuggestPreview,
        new Mock.AdvancedComponentSetupOptions(null, options, env => testEnv)
      );
    }

    function triggerQuerySuggestHover(suggestion: string = 'test') {
      (test.env.searchEndpoint.search as jasmine.Spy).and.returnValue(
        Promise.resolve(FakeResults.createFakeResults(test.cmp.options.numberOfPreviewResults))
      );
      $$(testEnv.root).trigger(OmniboxEvents.querySuggestGetFocus, { suggestion });
    }

    function buildContainer() {
      container = $$(document.createElement('div'));
      suggestionContainer = $$(document.createElement('div'));
      suggestion = $$(document.createElement('div'));
      elementInsideSuggestion = $$(document.createElement('div'));

      suggestion.addClass(selectableClass);
      suggestion.setAttribute('aria-selected', 'false');
      suggestion.el.appendChild(elementInsideSuggestion.el);
      suggestionContainer.el.appendChild(suggestion.el);
      container.el.appendChild(suggestionContainer.el);
    }

    function setupSuggestionManager() {
      buildContainer();
      const inputManager = new InputManager(document.createElement('div'), () => {}, {} as MagicBoxInstance);

      suggestionManager = new SuggestionsManager(suggestionContainer.el, document.createElement('div'), testEnv.root, inputManager, {
        selectedClass,
        selectableClass
      });
    }

    function setupRenderPreview() {
      test.env.root.appendChild(suggestionContainer.el);
      (test.cmp.options.resultTemplate.instantiateToElement as jasmine.Spy).and.returnValue(Promise.resolve($$('div').el));
    }

    function setupPreview(suggestions: Suggestion[] = [{ text: 'test' }]) {
      setupSuggestionManager();
      suggestionManager.updateSuggestions(suggestions);
      setupRenderPreview();
    }

    beforeEach(() => {
      testEnv = new Mock.MockEnvironmentBuilder();
    });

    describe('expose options', () => {
      it('numberOfPreviewResults set the number of results to query', done => {
        const numberOfPreviewResults = 5;
        setupQuerySuggestPreview({ numberOfPreviewResults });
        setupPreview();
        triggerQuerySuggestHover();
        setTimeout(() => {
          expect(test.cmp.queryController.getLastQuery().numberOfResults).toBe(numberOfPreviewResults);
          done();
        }, test.cmp.options.hoverTime);
      });

      it('hoverTime set the time before the query is executed', done => {
        const hoverTime = 200;
        setupQuerySuggestPreview({ hoverTime });
        setupPreview();
        triggerQuerySuggestHover();
        expect(test.cmp.queryController.getLastQuery).not.toHaveBeenCalled();
        setTimeout(() => {
          expect(test.cmp.queryController.getLastQuery).toHaveBeenCalledTimes(1);
          done();
        }, hoverTime);
      });

      it('previewWidth change the witdh of the preview container', done => {
        const width = 500;
        setupQuerySuggestPreview({ previewWidth: width });
        setupPreview();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.coveo-preview-container');
          expect(previewContainer.style.width).toEqual(`${width}px`);
          expect(previewContainer.style.maxWidth).toEqual(`${width}px`);
          done();
        }, test.cmp.options.hoverTime);
      });

      it('headerText change the text in the header of the preview', done => {
        const headerText = 'Super Header';
        setupQuerySuggestPreview({ headerText });
        setupPreview();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.coveo-preview-header > span');
          expect(previewContainer.innerText).toBe(`${headerText} "test"`);
          done();
        }, test.cmp.options.hoverTime);
      });
    });

    describe('when the previews are rendered,', () => {
      it(`if we have one element,
      it take 100% of the available space`, done => {
        setupQuerySuggestPreview({ numberOfPreviewResults: 1 });
        setupPreview();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.CoveoResult');
          expect(previewContainer.style.flex).toBe('0 0 100%');
          done();
        }, test.cmp.options.hoverTime);
      });

      it(`if we have two element,
      each take 50% of the available space`, done => {
        setupQuerySuggestPreview({ numberOfPreviewResults: 2 });
        setupPreview();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.CoveoResult');
          expect(previewContainer.style.flex).toBe('0 0 50%');
          done();
        }, test.cmp.options.hoverTime);
      });

      it(`if we have three element,
      each take 33% of the available space`, done => {
        setupQuerySuggestPreview({ numberOfPreviewResults: 3 });
        setupPreview();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.CoveoResult');
          expect(previewContainer.style.flex).toBe('0 0 33%');
          done();
        }, test.cmp.options.hoverTime);
      });

      it(`if we have four element,
      each take 50% of the available space`, done => {
        setupQuerySuggestPreview({ numberOfPreviewResults: 4 });
        setupPreview();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.CoveoResult');
          expect(previewContainer.style.flex).toBe('0 0 50%');
          done();
        }, test.cmp.options.hoverTime);
      });

      it(`if we have five elements or more,
      each take 33% of the available space`, done => {
        setupQuerySuggestPreview({ numberOfPreviewResults: 6 });
        setupPreview();
        triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(suggestionContainer.el).find('.CoveoResult');
          expect(previewContainer.style.flex).toBe('0 0 33%');
          done();
        }, test.cmp.options.hoverTime);
      });
    });

    describe('When we hover', () => {
      it(`on the same Suggestion multiple times,
      the query is is executed only once`, done => {
        setupQuerySuggestPreview();
        test.cmp.queryController.getEndpoint().search = jasmine.createSpy('execQuery');
        setupPreview();
        triggerQuerySuggestHover();
        triggerQuerySuggestHover();
        triggerQuerySuggestHover();
        setTimeout(() => {
          expect(test.cmp.queryController.getEndpoint().search).toHaveBeenCalledTimes(1);
          done();
        }, test.cmp.options.hoverTime);
      });

      it(`on multiple suggestion before the time in the option hoverTime,
      the query is is executed only once with the last Suggestion we hover hover`, done => {
        const realQuery = 'testing3';
        setupQuerySuggestPreview();
        test.cmp.queryController.getEndpoint().search = jasmine.createSpy('execQuery');
        setupPreview();
        triggerQuerySuggestHover('testing');
        triggerQuerySuggestHover('testing2');
        triggerQuerySuggestHover(realQuery);
        setTimeout(() => {
          expect(test.cmp.queryController.getEndpoint().search).toHaveBeenCalledTimes(1);
          expect(test.cmp.queryController.getLastQuery().q).toBe(realQuery);
          done();
        }, test.cmp.options.hoverTime);
      });
    });

    it(`When there is no Suggestion,
    it call handleNoSuggestion`, () => {
      setupQuerySuggestPreview();
      spyOn(test.cmp, 'handleNoSuggestion');
      expect(test.cmp.handleNoSuggestion).not.toHaveBeenCalled();
      setupPreview([]);
      expect(test.cmp.handleNoSuggestion).toHaveBeenCalled();
    });
  });
}
