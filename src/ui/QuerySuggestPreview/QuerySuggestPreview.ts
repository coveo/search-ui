import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { ComponentOptions, OmniboxEvents, Initialization, $$, Component } from '../../Core';
import { IQuerySuggestSelection } from '../../events/OmniboxEvents';
import { IQueryResults } from '../../rest/QueryResults';
import 'styling/_QuerySuggestPreview';
import { ResultListRenderer } from '../ResultList/ResultListRenderer';
import { IInitializationParameters } from '../Base/Initialization';
import { IResultListOptions } from '../ResultList/ResultListOptions';
import { Template } from '../Templates/Template';
import { TemplateComponentOptions } from '../Base/TemplateComponentOptions';
import { ResultListTableRenderer } from '../ResultList/ResultListTableRenderer';
import { ITemplateToHtml, TemplateToHtml } from '../Templates/TemplateToHtml';
import { IQueryResult } from '../../rest/QueryResult';

export interface IQuerySuggestPreview {
  numberOfPreviewResults?: number;
  previewWidth?: number;
  suggestionWidth?: number;
  resultTemplate?: Template;
  headerText?: string;
  executeQueryDelay?: number;
}

/**
 * This component renders a preview of the top query results matching the currently focused query suggestion in the search box.
 *
 * As such, this component only works when an [`Omnibox`]{@link Omnibox} whose [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon} option is set to `true` is present in the search interface.
 *
 * Moreover, this component requires at least one [result template](https://docs.coveo.com/en/413/) in its markup configuration to be able to render previews.
 *
 * **Exemple**
 * ```
 *   <div class="CoveoQuerySuggestPreview">
 *    <script class="result-template" type="text/html">
 *      <div class="coveo-result-frame">
 *        <a class="CoveoResultLink"></a>
 *      </div>
 *    </script>
 *   </div>
 * ```
 *
 * See [Providing Query Suggestion Result Previews](https://docs.coveo.com/en/340/#providing-query-suggestion-result-previews).
 */
export class QuerySuggestPreview extends Component implements IComponentBindings {
  static ID = 'QuerySuggestPreview';

  static doExport = () => {
    exportGlobally({
      QuerySuggestPreview: QuerySuggestPreview
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IQuerySuggestPreview = {
    resultTemplate: TemplateComponentOptions.buildTemplateOption(),
    /**
     * The maximum number of query results to render in the preview.
     *
     * **Minimum:** `1`
     * **Maximum:** `6`
     * **Default:** `3`
     */
    numberOfPreviewResults: ComponentOptions.buildNumberOption({
      defaultValue: 3,
      min: 1,
      max: 6
    }),
    /**
     * The width of the preview container (in pixels).
     *
     * If this option is `undefined` or lower than the remaning space left by the suggestion,
     * the component takes all the space left by the query suggestions.
     */
    previewWidth: ComponentOptions.buildNumberOption(),
    /**
     *  The width of the suggestion container (in pixels).
     *
     *  If the value is set to `0`, the width will adjust to the longuest displayed querySuggestion
     *
     * **Default:** `250`
     * **Minimum:** `0`
     */
    suggestionWidth: ComponentOptions.buildNumberOption({ defaultValue: 250, min: 0 }),
    /**
     *  The text to display at the top of the preview, which is followed by "`<SUGGESTION>`", where `<SUGGESTION>` is the hovered query suggestion.
     *
     * **Default:** The localized string `Query result items for`
     */
    headerText: ComponentOptions.buildLocalizedStringOption({ defaultValue: 'QuerySuggestPreview' }),
    /**
     *  The amount of focus time (in milliseconds) required on a query suggestion before requesting a preview of its top results.
     *
     * **Default:** `200`
     */
    executeQueryDelay: ComponentOptions.buildNumberOption({ defaultValue: 200 })
  };

  private previousSuggestionHovered: string;
  private renderer: ResultListRenderer;
  private timer;
  public currentlyDisplayedResults: IQueryResult[] = [];

  /**
   * Creates a new QuerySuggestPreview component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the QuerySuggestPreview component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IQuerySuggestPreview, public bindings?: IComponentBindings) {
    super(element, QuerySuggestPreview.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, QuerySuggestPreview, options);

    if (!this.options.resultTemplate) {
      this.logger.warn(
        `Specifying a result template is required for the 'QuerySuggestPreview' component to work properly. See `,
        `https://docs.coveo.com/340/#providing-query-suggestion-result-previews`
      );
    }

    this.bind.onRootElement(OmniboxEvents.querySuggestGetFocus, (args: IQuerySuggestSelection) => this.querySuggestGetFocus(args));
    this.bind.onRootElement(OmniboxEvents.querySuggestRendered, () => {
      this.handleAfterComponentInit();
    });
    this.bind.onRootElement(OmniboxEvents.querySuggestLoseFocus, () => {
      this.handleFocusOut();
    });
  }

  /**
   * Gets the list of currently displayed result.
   * @returns {IQueryResult[]}
   */
  public get displayedResults(): IQueryResult[] {
    return this.currentlyDisplayedResults;
  }

  private get templateToHtml() {
    const templateToHtmlArgs: ITemplateToHtml = {
      searchInterface: this.searchInterface,
      queryStateModel: this.queryStateModel,
      resultTemplate: this.options.resultTemplate
    };
    return new TemplateToHtml(templateToHtmlArgs);
  }

  private handleFocusOut() {
    clearTimeout(this.timer);
    this.timer = null;
    this.previousSuggestionHovered = null;
    this.currentlyDisplayedResults = [];
  }

  private updatePreviewContainer(container: HTMLElement) {
    if (!this.options.previewWidth) {
      return;
    }
    container.style.width = `${this.options.previewWidth}px`;
  }

  private updateWidthOfSuggestionContainer(container: HTMLElement) {
    if (!this.options.suggestionWidth) {
      return;
    }
    container.style.width = `${this.options.suggestionWidth}px`;
  }

  private handleAfterComponentInit() {
    const suggestionContainer = $$(this.root).find('.coveo-magicbox-suggestions');
    if (suggestionContainer) {
      this.updateWidthOfSuggestionContainer(suggestionContainer);
    }
    const previewContainer = $$(this.root).find('.coveo-preview-container');
    if (previewContainer) {
      this.updatePreviewContainer(previewContainer);
    }
  }

  private buildPreviewHeader(suggestion: string) {
    const text = `${this.options.headerText} "${suggestion}"`;
    const header = $$('h4', { className: 'coveo-preview-header' }, text).el;
    this.previewContainer.appendChild(header);
  }

  private buildResultsContainer() {
    return $$('div', { className: 'coveo-preview-results' }).el;
  }

  private get previewContainer() {
    return $$(this.root).find('.coveo-preview-container');
  }

  private querySuggestGetFocus(args: IQuerySuggestSelection) {
    if (!this.previewContainer) {
      return;
    }

    if (this.previousSuggestionHovered === args.suggestion) {
      return;
    }

    this.previousSuggestionHovered = args.suggestion;
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.executeQueryHover(args.suggestion);
    }, this.options.executeQueryDelay);
  }

  private async executeQueryHover(suggestion: string) {
    const previousQueryOptions = this.queryController.getLastQuery();
    previousQueryOptions.q = suggestion;
    previousQueryOptions.numberOfResults = this.options.numberOfPreviewResults;
    const results = await this.queryController.getEndpoint().search(previousQueryOptions);
    $$(this.previewContainer).empty();
    this.currentlyDisplayedResults = [];
    if (!results) {
      return;
    }
    this.buildPreviewHeader(suggestion);
    this.buildResultsPreview(results);
  }

  private async buildResultsPreview(results: IQueryResults) {
    const resultsContainer = this.buildResultsContainer();
    this.previewContainer.appendChild(resultsContainer);
    this.setupRenderer(resultsContainer);
    const buildResults = await this.templateToHtml.buildResults(results, 'preview', this.currentlyDisplayedResults);
    if (!(buildResults.length > 0)) {
      return;
    }
    this.updateResultPerRow(buildResults);
    this.renderer.renderResults(buildResults, true, result => {});
  }

  private updateResultPerRow(elements: HTMLElement[]) {
    const resultAvailableSpace = elements.length === 4 ? '50%' : '33%';
    elements.forEach(element => {
      this.updateFlexCSS(element, resultAvailableSpace);
    });
  }

  private updateFlexCSS(element: HTMLElement, value: string) {
    element.style.flex = `0 0 ${value}`;
  }

  private setupRenderer(resultsContainer: HTMLElement) {
    const rendererOption: IResultListOptions = {
      resultsContainer
    };
    const initParameters: IInitializationParameters = {
      options: this.searchInterface.options.originalOptionsObject,
      bindings: this.bindings
    };

    const autoCreateComponentsFn = (elem: HTMLElement) => Initialization.automaticallyCreateComponentsInside(elem, initParameters);

    this.renderer = new ResultListTableRenderer(rendererOption, autoCreateComponentsFn);
  }
}

Initialization.registerAutoCreateComponent(QuerySuggestPreview);
