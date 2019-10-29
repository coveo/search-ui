import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { ComponentOptions, Initialization, $$, Component, Utils } from '../../Core';
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
import { SuggestionsManagerEvents, IPopulateSearchResultPreviewsEventArgs, ISearchResultPreview } from '../../magicbox/SuggestionsManager';

export interface IQuerySuggestPreview {
  numberOfPreviewResults?: number;
  resultTemplate?: Template;
  executeQueryDelay?: number;
}

export class QuerySuggestPreview extends Component implements IComponentBindings {
  static ID = 'QuerySuggestPreview';

  static doExport = () => {
    exportGlobally({
      QuerySuggestPreview: QuerySuggestPreview
    });
  };

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
     *  The amount of focus time (in milliseconds) required on a query suggestion before requesting a preview of its top results.
     *
     * **Default:** `200`
     */
    executeQueryDelay: ComponentOptions.buildNumberOption({ defaultValue: 200 })
  };

  private timer: Promise<void>;
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
      // TODO: Add a default template
      this.logger.warn(
        `Specifying a result template is required for the 'QuerySuggestPreview' component to work properly. See `,
        `https://docs.coveo.com/340/#providing-query-suggestion-result-previews`
      );
    }

    this.bind.onRootElement(SuggestionsManagerEvents.PopulateSearchResultPreviews, (args: IPopulateSearchResultPreviewsEventArgs) =>
      this.populateSearchResultPreviews(args)
    );

    this.omniboxAnalytics = this.searchInterface.getOmniboxAnalytics();
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
    args.previewsQuery = this.fetchSearchResultPreviews(args.suggestionText);
  }

  private async fetchSearchResultPreviews(suggestionText: string) {
    const timer = (this.timer = Utils.waitUntil(this.options.executeQueryDelay));
    await timer;
    if (this.timer !== timer) {
      return [];
    }
    const previousQueryOptions = this.queryController.getLastQuery();
    previousQueryOptions.q = suggestionText;
    previousQueryOptions.numberOfResults = this.options.numberOfPreviewResults;
    this.logShowQuerySuggestPreview();
    const results = await this.queryController.getEndpoint().search(previousQueryOptions);
    if (!results) {
      return [];
    }
    return this.buildResultsPreview(suggestionText, results);
  }

  private async buildResultsPreview(suggestionText: string, results: IQueryResults) {
    const buildResults = await this.templateToHtml.buildResults(results, 'preview', []);
    if (!(buildResults.length > 0)) {
      return [];
    }
    return buildResults.map((element, index) => this.buildResultPreview(suggestionText, element, index));
  }

  private buildResultPreview(suggestionText: string, element: HTMLElement, rank: number): ISearchResultPreview {
    $$(element).addClass('coveo-preview-selectable');
    return {
      element,
      onSelect: () => this.handleSelect(suggestionText, element, rank)
    };
  }

  private handleSelect(suggestionText: string, element: HTMLElement, rank: number) {
    this.logClickQuerySuggestPreview(suggestionText, rank, element);
    element.click();
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

  private logClickQuerySuggestPreview(suggestionText: string, displayedRank: number, element: HTMLElement) {
    this.usageAnalytics.logCustomEvent<IAnalyticsClickQuerySuggestPreviewMeta>(
      analyticsActionCauseList.clickQuerySuggestPreview,
      {
        suggestion: suggestionText,
        displayedRank
      },
      element
    );
  }
}

Initialization.registerAutoCreateComponent(QuerySuggestPreview);
