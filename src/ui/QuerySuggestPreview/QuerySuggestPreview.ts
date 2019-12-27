import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { ComponentOptions, Initialization, $$, Component, HtmlTemplate } from '../../Core';
import { IQueryResults } from '../../rest/QueryResults';
import 'styling/_QuerySuggestPreview';
import { Template } from '../Templates/Template';
import { TemplateComponentOptions } from '../Base/TemplateComponentOptions';
import { ITemplateToHtml, TemplateToHtml } from '../Templates/TemplateToHtml';
import { ResultLink } from '../ResultLink/ResultLink';
import { OmniboxAnalytics } from '../Omnibox/OmniboxAnalytics';
import {
  IAnalyticsOmniboxSuggestionMeta,
  analyticsActionCauseList,
  IAnalyticsClickQuerySuggestPreviewMeta
} from '../Analytics/AnalyticsActionListMeta';
import { ISearchResultPreview } from '../../magicbox/ResultPreviewsManager';
import { ImageFieldValue } from '../FieldImage/ImageFieldValue';
import {
  ResultPreviewsManagerEvents,
  IPopulateSearchResultPreviewsEventArgs,
  IUpdateResultPreviewsManagerOptionsEventArgs
} from '../../events/ResultPreviewsManagerEvents';
import { IQuery } from '../../rest/Query';
import { Suggestion } from '../../magicbox/SuggestionsManager';

export interface IQuerySuggestPreview {
  numberOfPreviewResults?: number;
  resultTemplate?: Template;
  executeQueryDelay?: number;
}

/**
 * This component renders previews of the top query results matching the currently focused query suggestion in the search box.
 *
 * As such, this component only works when the search interface can
 * [provide Coveo Machine Learning query suggestions](https://docs.coveo.com/en/340/#providing-coveo-machine-learning-query-suggestions).
 *
 * This component should be initialized on a `div` which can be nested anywhere inside the root element of your search interface.
 *
 * See [Rendering Query Suggestion Result Previews](https://docs.coveo.com/en/340/#rendering-query-suggestion-result-previews).
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
    /**
     * The HTML `id` attribute value, or CSS selector of the previously registered
     * [result template](https://docs.coveo.com/413/) to apply when rendering the
     * query suggestion result previews.
     *
     * **Examples**
     * * Specifying the `id` attribute of the target result template:
     * ```html
     * <div class="CoveoQuerySuggestPreview" data-result-template-id="myTemplateId"></div>
     * ```
     * * Specifying an equivalent CSS selector:
     * ```html
     * <div class="CoveoQuerySuggestPreview" data-result-template-selector="#myTemplateId"></div>
     * ```
     *
     * If you specify no previously registered template through this option, the component uses its default template.
     */
    resultTemplate: TemplateComponentOptions.buildTemplateOption(),
    /**
     * The maximum number of query results to render in the preview.
     */
    numberOfPreviewResults: ComponentOptions.buildNumberOption({
      defaultValue: 4,
      min: 1,
      max: 6
    }),
    /**
     *  The amount of focus time (in milliseconds) required on a query suggestion before requesting a preview of its top results.
     */
    executeQueryDelay: ComponentOptions.buildNumberOption({ defaultValue: 200 })
  };

  private omniboxAnalytics: OmniboxAnalytics;

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
      this.logger.warn(`No template was provided for ${QuerySuggestPreview.ID}, a default template was used instead.`);
      this.options.resultTemplate = this.buildDefaultSearchResultPreviewTemplate();
    }

    this.bind.onRootElement(
      ResultPreviewsManagerEvents.updateResultPreviewsManagerOptions,
      (args: IUpdateResultPreviewsManagerOptionsEventArgs) =>
        (args.displayAfterDuration = Math.max(args.displayAfterDuration || 0, this.options.executeQueryDelay))
    );

    this.bind.onRootElement(ResultPreviewsManagerEvents.populateSearchResultPreviews, (args: IPopulateSearchResultPreviewsEventArgs) =>
      this.populateSearchResultPreviews(args)
    );

    this.omniboxAnalytics = this.searchInterface.getOmniboxAnalytics();
  }

  private buildDefaultSearchResultPreviewTemplate() {
    return HtmlTemplate.create(
      $$(
        'script',
        { className: 'result-template', type: 'text/html' },
        $$(
          'div',
          { className: 'coveo-result-frame coveo-default-result-preview' },
          $$('div', { className: Component.computeCssClassName(ImageFieldValue), 'data-field': '@image' }),
          $$('a', { className: Component.computeCssClassName(ResultLink) })
        )
      ).el
    );
  }

  private get templateToHtml() {
    const templateToHtmlArgs: ITemplateToHtml = {
      searchInterface: this.searchInterface,
      queryStateModel: this.queryStateModel,
      resultTemplate: this.options.resultTemplate
    };
    return new TemplateToHtml(templateToHtmlArgs);
  }

  private populateSearchResultPreviews(args: IPopulateSearchResultPreviewsEventArgs) {
    args.previewsQueries.push(this.fetchSearchResultPreviews(args.suggestion));
  }

  private async fetchSearchResultPreviews(suggestion: Suggestion) {
    const query = this.buildQuery(suggestion);
    this.logShowQuerySuggestPreview();
    const results = await this.queryController.getEndpoint().search(query);
    if (!results) {
      return [];
    }
    return this.buildResultsPreview(suggestion, results);
  }

  private buildQuery(suggestion: Suggestion): IQuery {
    const { searchHub, pipeline, tab, locale, timezone, context } = this.queryController.getLastQuery();
    return {
      firstResult: 0,
      searchHub,
      pipeline,
      tab,
      locale,
      timezone,
      context,
      numberOfResults: this.options.numberOfPreviewResults,
      q: suggestion.text || suggestion.dom.innerText,
      ...(suggestion.advancedQuery && { aq: suggestion.advancedQuery })
    };
  }

  private async buildResultsPreview(suggestion: Suggestion, results: IQueryResults) {
    const buildResults = await this.templateToHtml.buildResults(results, 'preview', []);
    if (!(buildResults.length > 0)) {
      return [];
    }
    return buildResults.map((element, index) => this.buildResultPreview(suggestion, element, index));
  }

  private buildResultPreview(suggestion: Suggestion, element: HTMLElement, rank: number): ISearchResultPreview {
    element.classList.add('coveo-preview-selectable');
    const resultLink = element.querySelector(Component.computeSelectorForType(ResultLink.ID)) as HTMLElement;
    if (resultLink) {
      element.setAttribute('aria-label', resultLink.textContent);
      resultLink.setAttribute('role', 'link');
      resultLink.removeAttribute('aria-level');
    }
    return {
      element,
      onSelect: () => this.handleSelect(suggestion, element, rank)
    };
  }

  private handleSelect(suggestion: Suggestion, element: HTMLElement, rank: number) {
    this.logClickQuerySuggestPreview(suggestion, rank, element);
    const link = $$(element).find(`.${Component.computeCssClassNameForType('ResultLink')}`);
    if (link) {
      const resultLink = <ResultLink>Component.get(link);
      resultLink.openLinkAsConfigured();
      resultLink.openLink();
    }
  }

  private logShowQuerySuggestPreview() {
    this.usageAnalytics.logSearchEvent<IAnalyticsOmniboxSuggestionMeta>(
      analyticsActionCauseList.showQuerySuggestPreview,
      this.omniboxAnalytics.buildCustomDataForPartialQueries()
    );
  }

  private logClickQuerySuggestPreview(suggestion: Suggestion, displayedRank: number, element: HTMLElement) {
    this.usageAnalytics.logCustomEvent<IAnalyticsClickQuerySuggestPreviewMeta>(
      analyticsActionCauseList.clickQuerySuggestPreview,
      {
        suggestion: suggestion.text || suggestion.dom.innerText,
        displayedRank
      },
      element
    );
  }
}

Initialization.registerAutoCreateComponent(QuerySuggestPreview);
