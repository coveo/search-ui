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
  suggestionWidth?: string;
  resultTemplate?: Template;
  headerText?: string;
  executeQueryDelay?: number;
}

/**
 * The `QuerySuggestPreview` component allows you to preview the top query result items of hovered query suggestions.
 *
 * This component requires a working [`querySuggest`]{@link Omnibox.options.enableQuerySuggestAddon} component in the corresponding search box,
 * and you need to provide a [result template](https://developers.coveo.com/x/aIGfAQ) for the preview.
 *
 * **Exemple**
 * ```
 *  <div class="CoveoQuerySuggestPreview">
 *    <script class="result-template" type="text/x-underscore">
 *      <span>
 *        <a class='CoveoResultLink'></a>
 *      </span>
 *    </script>
 *  </div>
 * ```
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
     * **Minimum value:** `1`
     * **Maximum value:** `6`
     * **Default value:** `3`
     */
    numberOfPreviewResults: ComponentOptions.buildNumberOption({
      defaultValue: 3,
      min: 1,
      max: 6
    }),
    /**
     * Width of the preview container (in pixels).
     *
     * If this option is `undefined` or lower than the remaning space left by the suggestion,
     * the component takes all the space left over by the query suggestions.
     */
    previewWidth: ComponentOptions.buildNumberOption(),
    /**
     *  Width of the suggestion container (in pixels or percentage).
     *
     * **Default value:** `33%`
     */
    suggestionWidth: ComponentOptions.buildStringOption({ defaultValue: '33%' }),
    /**
     *  The text to display at the top of the preview, which is followed by "`<SUGGESTION>`", where `<SUGGESTION>` is the hovered query suggestion.
     *
     * **Default value:** `Query result items for`
     */
    headerText: ComponentOptions.buildLocalizedStringOption({ defaultValue: 'QuerySuggestPreview' }),
    /**
     *  The hovering time (in ms) required on a query suggestion before requesting preview items.
     *
     * **Default value:** `200`
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
        `Option "resultTemplate" is *REQUIRED* on the component "QuerySuggestPreview". The component or the search page might *NOT WORK PROPERLY*`,
        `Check the following URL to create your result template`,
        `https://developers.coveo.com/x/aIGfAQ`
      );
    }

    this.bind.onRootElement(OmniboxEvents.querySuggestGetFocus, (args: IQuerySuggestSelection) => this.querySuggestGetFocus(args));
    this.bind.onRootElement(OmniboxEvents.querySuggestRendered, () => {
      this.handleAfterComponentInit();
    });
    this.bind.onRootElement(OmniboxEvents.querySuggestLooseFocus, () => {
      this.handleQuerySuggestLooseFocus();
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

  private handleQuerySuggestLooseFocus() {
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
    container.style.minWidth = this.options.suggestionWidth;
    container.style.maxWidth = this.options.suggestionWidth;
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
    const text = $$('span', {}, `${this.options.headerText} "${suggestion}"`).el;
    const header = $$('div', { className: 'coveo-preview-header' }, text).el;
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
    var results = await this.queryController.getEndpoint().search(previousQueryOptions);
    $$(this.previewContainer).empty();
    this.currentlyDisplayedResults = [];
    if (!results) {
      return;
    }
    this.addImage(results);
    this.buildPreviewHeader(suggestion);
    this.buildResultsPreview(results);
  }

  private async buildResultsPreview(results: IQueryResults) {
    const resultsContainer = this.buildResultsContainer();
    this.previewContainer.appendChild(resultsContainer);
    this.setupRenderer(resultsContainer);
    const HTMLResult = await this.templateToHtml.buildResults(results, 'preview', this.currentlyDisplayedResults);
    if (!(HTMLResult.length > 0)) {
      return;
    }
    this.updateResultPerRow(HTMLResult);
    this.renderer.renderResults(HTMLResult, true, result => {});
  }

  private updateResultPerRow(elements: HTMLElement[]) {
    let resultAvailibleSpace = '33%';
    if (elements.length === 4) {
      resultAvailibleSpace = '50%';
    }
    elements.forEach(element => {
      this.updateFlexCSS(element, resultAvailibleSpace);
    });
  }

  private updateFlexCSS(element: HTMLElement, value: string) {
    element.style.flex = `0 0 ${value}`;
  }

  //Delete when creating the PR
  private addImage(results: IQueryResults) {
    results.results.forEach(result => {
      result.raw['ccimage'] = 'https://img.bbystatic.com/BestBuy_US/images/products/5410/5410701_sa.jpg';
    });
  }

  private setupRenderer(resultsContainer: HTMLElement) {
    const rendererOption: IResultListOptions = {
      resultContainer: resultsContainer
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
