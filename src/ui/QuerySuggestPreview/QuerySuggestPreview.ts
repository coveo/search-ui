import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { ComponentOptions, OmniboxEvents, Initialization, $$, Component, Assert, QueryUtils, Dom } from '../../Core';
import { IQuerySuggestSelection } from '../../events/OmniboxEvents';
import { IQueryResults } from '../../rest/QueryResults';
import 'styling/_QuerySuggestPreview';
import { ResultListRenderer } from '../ResultList/ResultListRenderer';
import { IInitializationParameters, IInitResult } from '../Base/Initialization';
import { IResultListOptions } from '../ResultList/ResultListOptions';
import { Template } from '../Templates/Template';
import { TemplateComponentOptions } from '../Base/TemplateComponentOptions';
import { IQueryResult } from '../../rest/QueryResult';
import { pluck, sortBy, map } from 'underscore';
import { ResultListTableRenderer } from '../ResultList/ResultListTableRenderer';

export interface IQuerySuggestPreview {
  numberOfPreviewResults?: number;
  previewWidth?: number;
  suggestionWidth?: string;
  resultTemplate?: Template;
  headerText?: string;
  hoverTime?: number;
}

/**
 * This component need [`querySuggest`]{@link Omnibox.options.enableQuerySuggestAddon} to work.
 *
 *  It allows you to preview the top recommendation when hovering on a Query suggest
 *
 *  A [Result Templates](https://developers.coveo.com/x/aIGfAQ) is required for this component to work.
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
     *  Width in `pixels` that the preview container will take
     *
     * The default behavior is to take 100% of the remaining place shared by the suggestion
     */
    previewWidth: ComponentOptions.buildNumberOption(),
    /**
     *  Width in `pixels` or `pourcentages` that the suggestion container will take
     *
     * **Default value:** `33%`
     */
    suggestionWidth: ComponentOptions.buildStringOption({ defaultValue: '33%' }),
    /**
     *  The text displayed at the top of the preview.
     *
     *  After this text, the suggestion will be surrounded in quotes
     *
     * **Default value:** `Product recommandation for`
     */
    headerText: ComponentOptions.buildLocalizedStringOption({ defaultValue: 'ProductRecommandation' }),
    /**
     *  The time in millisecond that a end user have to hover on a query suggest before a request is sent.
     */
    hoverTime: ComponentOptions.buildNumberOption({ defaultValue: 200 })
  };

  private previousSuggestionHovered: string;
  private renderer: ResultListRenderer;
  private timer;

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

    this.bind.onRootElement(OmniboxEvents.querySuggestGetFocus, (args: IQuerySuggestSelection) => this.querySuggestGetFocus(args));
  }

  /**
   * Builds and returns an array of HTMLElement with the given result set.
   * @param results the result set to build an array of HTMLElement from.
   */
  public buildResults(results: IQueryResults): Promise<HTMLElement[]> {
    const res: { elem: HTMLElement; idx: number }[] = [];
    const resultsPromises = map(results.results, (result: IQueryResult, index: number) => {
      return this.buildResult(result).then((resultElement: HTMLElement) => {
        if (resultElement != null) {
          res.push({ elem: resultElement, idx: index });
        }
        return resultElement;
      });
    });

    // We need to sort by the original index order, because in lazy loading mode, it's possible that results does not gets rendered
    // in the correct order returned by the index, depending on the time it takes to load all the results component for a given result template
    return Promise.all(resultsPromises).then(() => {
      return pluck(sortBy(res, 'idx'), 'elem');
    });
  }

  /**
   * Builds and returns an HTMLElement for the given result.
   * @param result the result to build an HTMLElement from.
   * @returns {HTMLElement}
   */
  public buildResult(result: IQueryResult): Promise<HTMLElement> {
    Assert.exists(result);
    QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), result);
    QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, result);
    return this.options.resultTemplate
      .instantiateToElement(result, {
        wrapInDiv: true,
        checkCondition: true,
        currentLayout: 'preview',
        responsiveComponents: this.searchInterface.responsiveComponents
      })
      .then((resultElement: HTMLElement) => {
        if (resultElement != null) {
          Component.bindResultToElement(resultElement, result);
        }
        return this.autoCreateComponentsInsideResult(resultElement, result).initResult.then(() => {
          return resultElement;
        });
      });
  }

  /**
   * Reset the component when no suggestion are displayed
   */
  public handleNoSuggestion() {
    clearTimeout(this.timer);
    this.previousSuggestionHovered = null;
  }

  /**
   * Create the container which the results preview will render
   */
  public buildPreviewContainer() {
    const container = $$('div', { className: 'coveo-preview-container' }).el;
    if (!this.options.previewWidth) {
      return container;
    }

    container.style.width = `${this.options.previewWidth}px`;
    container.style.maxWidth = `${this.options.previewWidth}px`;
    return container;
  }

  /**
   * Resize the width of the suggestion container
   */
  public updateWidthOfSuggestionContainer(container: Dom) {
    if (!this.options.suggestionWidth) {
      return;
    }
    container.el.style.minWidth = this.options.suggestionWidth;
    container.el.style.maxWidth = this.options.suggestionWidth;
  }

  private autoCreateComponentsInsideResult(element: HTMLElement, result: IQueryResult): IInitResult {
    Assert.exists(element);
    return Initialization.automaticallyCreateComponentsInsideResult(element, result);
  }

  private buildPreviewHeader(suggestion: string) {
    const text = $$('span', {}, `${this.options.headerText} "${suggestion}"`).el;
    const header = $$('div', { className: 'coveo-preview-header' }, text).el;
    this.previewContainer.appendChild(header);
  }

  private buildResultsContainer() {
    const resultsContainer = $$('div', { className: 'coveo-preview-results' }).el;
    if (!this.options.previewWidth) {
      return resultsContainer;
    }

    resultsContainer.style.width = `${this.options.previewWidth}px`;
    return resultsContainer;
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
    }, this.options.hoverTime);
  }

  private executeQueryHover(suggestion: string) {
    const previousQueryOptions = this.queryController.getLastQuery();
    previousQueryOptions.q = suggestion;
    previousQueryOptions.numberOfResults = this.options.numberOfPreviewResults;
    this.queryController
      .getEndpoint()
      .search(previousQueryOptions)
      .then(results => {
        $$(this.previewContainer).empty();
        if (!results) {
          return;
        }
        this.addImage(results);
        this.buildPreviewHeader(suggestion);
        this.buildResultsPreview(results);
      });
  }

  private buildResultsPreview(results: IQueryResults): Promise<HTMLElement[]> {
    const resultsContainer = this.buildResultsContainer();
    this.previewContainer.appendChild(resultsContainer);
    this.setupRenderer(resultsContainer);
    this.buildResults(results).then(HTMLResult => {
      if (!(HTMLResult.length > 0)) {
        return;
      }
      this.updateResultPerRow(HTMLResult);
      this.renderer.renderResults(HTMLResult, true, result => {});
    });
    return;
  }

  private updateResultPerRow(HTMLElements: HTMLElement[]) {
    let size = HTMLElements.length == 4 ? 50 : Math.max(33, ~~(100 / HTMLElements.length));
    HTMLElements.forEach(element => {
      this.updateFlexCSS(element, size);
    });
  }

  private updateFlexCSS(element: HTMLElement, value: number) {
    element.style.flex = `0 0 ${value}%`;
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
