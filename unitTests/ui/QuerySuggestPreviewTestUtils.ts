import * as Mock from '../MockEnvironment';
import { Dom, HtmlTemplate, $$, OmniboxEvents } from '../../src/Core';
import { SuggestionsManager, Suggestion } from '../../src/magicbox/SuggestionsManager';
import { IQuerySuggestPreview, QuerySuggestPreview } from '../../src/ui/QuerySuggestPreview/QuerySuggestPreview';
import { InputManager } from '../../src/magicbox/InputManager';
import { MagicBoxInstance } from '../../src/magicbox/MagicBox';
import { IQueryResults } from '../../src/rest/QueryResults';
import { FakeResults } from '../Fake';
import { IBasicComponentSetup } from '../MockEnvironment';

export class QuerySuggestPreviewTestUtils {
  public container: Dom;
  public suggestionContainer: Dom;
  public suggestionManager: SuggestionsManager;
  public suggestion: Dom;
  public elementInsideSuggestion: Dom;
  private test: IBasicComponentSetup<QuerySuggestPreview>;
  constructor(private testEnv) {}

  public setupQuerySuggestPreview(options: IQuerySuggestPreview = {}) {
    const tmpl: HtmlTemplate = Mock.mock<HtmlTemplate>(HtmlTemplate);
    options['resultTemplate'] = tmpl;

    return (this.test = Mock.advancedComponentSetup<QuerySuggestPreview>(
      QuerySuggestPreview,
      new Mock.AdvancedComponentSetupOptions(null, options, env => this.testEnv)
    ));
  }

  public triggerQuerySuggestHover(suggestion: string = 'test', fakeResults?: IQueryResults) {
    fakeResults = fakeResults || FakeResults.createFakeResults(this.test.cmp.options.numberOfPreviewResults);
    (this.test.env.searchEndpoint.search as jasmine.Spy).and.returnValue(Promise.resolve(fakeResults));
    $$(this.testEnv.root).trigger(OmniboxEvents.querySuggestGetFocus, { suggestion });
  }

  public triggerQuerySuggestHoverAndPassTime(suggestion: string = 'test', fakeResults?: IQueryResults) {
    this.triggerQuerySuggestHover(suggestion);
    jasmine.clock().tick(this.test.cmp.options.executeQueryDelay);
  }

  public buildSuggestion() {
    this.container = $$(document.createElement('div'));
    this.suggestionContainer = $$(document.createElement('div'));
    this.suggestion = $$(document.createElement('div'));
    this.elementInsideSuggestion = $$(document.createElement('div'));

    this.suggestion.el.appendChild(this.elementInsideSuggestion.el);
    this.suggestionContainer.el.appendChild(this.suggestion.el);
    this.container.el.appendChild(this.suggestionContainer.el);
  }

  public setupSuggestionManager() {
    this.buildSuggestion();
    const inputManager = new InputManager(document.createElement('div'), () => {}, {} as MagicBoxInstance);

    this.suggestionManager = new SuggestionsManager(
      this.suggestionContainer.el,
      document.createElement('div'),
      this.testEnv.root,
      inputManager
    );
  }

  public setupRenderPreview() {
    this.test.env.root.appendChild(this.suggestionContainer.el);
    (this.test.cmp.options.resultTemplate.instantiateToElement as jasmine.Spy).and.returnValue(Promise.resolve($$('div').el));
  }

  public setupSuggestion(suggestions: Suggestion[] = [{ text: 'test' }]) {
    this.setupSuggestionManager();
    this.setupRenderPreview();
    this.suggestionManager.updateSuggestions(suggestions);
  }
}
