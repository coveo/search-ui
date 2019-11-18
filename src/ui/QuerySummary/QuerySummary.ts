import 'styling/_QuerySummary';
import { escape } from 'underscore';
import { IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { QuerySummaryEvents } from '../../events/QuerySummaryEvents';
import { exportGlobally } from '../../GlobalExports';
import { Assert } from '../../misc/Assert';
import { QueryStateModel } from '../../models/QueryStateModel';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { QuerySummaryUtils } from '../../utils/QuerySummaryUtils';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';

export interface IQuerySummaryOptions {
  onlyDisplaySearchTips?: boolean;
  enableNoResultsFoundMessage?: boolean;
  noResultsFoundMessage?: string;
  enableCancelLastAction?: boolean;
  enableSearchTips?: boolean;
}

export const noResultsCssClass: string = 'coveo-show-if-no-results';

/**
 * The QuerySummary component can display information about the currently displayed range of results (e.g., "Results
 * 1-10 of 123").
 *
 * When the query does not match any items, the QuerySummary component can instead display information to the end users.
 *
 * The information displayed to the end user is customizable through this component.
 */
export class QuerySummary extends Component {
  static ID = 'QuerySummary';

  static doExport = () => {
    exportGlobally({
      QuerySummary: QuerySummary
    });
  };

  /**
   * Options for the component
   * @componentOptions
   */
  static options: IQuerySummaryOptions = {
    /**
     * Specifies whether to hide the number of returned results.
     *
     * When this option is set to true, the number of returned results will be hidden from the page, meaning that your end users will not know how many results were returned for their query.
     *
     * Default value is `false`.
     */
    onlyDisplaySearchTips: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether to display the {@link QuerySummary.options.noResultsFoundMessage} message when there are no search results.
     *
     * Default value is `true`.
     */
    enableNoResultsFoundMessage: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies a custom message to display when there are no search results.
     *
     * You can refer to the query the end user has entered using the `${query}` query tag.
     *
     * **Example**
     * > For the `noResultFoundMessage` option, you enter `There were no results found for "${query}"`.
     * > Your end user searches for `query without results`, which does not return any result.
     * > On your page, they see this message: `There were no results found for "query without results"`.
     *
     * Default value is `No results for ${query}`.
     */
    noResultsFoundMessage: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('noResultFor', '${query}'),
      depend: 'enableNoResultsFoundMessage',
      postProcessing: (value: string) => {
        return escape(value);
      }
    }),

    /**
     * Specifies whether to display the `Cancel last action` link when there are no search results.
     *
     * When clicked, the link restores the previous query that contained results.
     *
     * Default value is `true`.
     */
    enableCancelLastAction: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to display search tips when there are no search results.
     *
     * Default value is `true`.
     */
    enableSearchTips: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  private textContainer: HTMLElement;
  private lastKnownGoodState: any;
  private noResultsSnapshot: string;

  /**
   * Creates a new QuerySummary component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the QuerySummary component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IQuerySummaryOptions, bindings?: IComponentBindings) {
    super(element, QuerySummary.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, QuerySummary, options);
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
    this.bind.onRootElement(QueryEvents.queryError, () => this.hide());
    this.hide();
    this.textContainer = $$('span').el;
    $$(this.element).prepend(this.textContainer);
  }

  private hide() {
    $$(this.element).addClass('coveo-hidden');
  }

  private show() {
    $$(this.element).removeClass('coveo-hidden');
  }

  private render(data: IQuerySuccessEventArgs) {
    $$(this.textContainer).empty();
    this.show();

    this.updateNoResultsSnapshot();
    this.hideNoResultsPage();

    if (!this.options.onlyDisplaySearchTips) {
      this.updateSummaryIfResultsWereReceived(data);
    }

    const queryResults = data.results;

    if (queryResults.exception != null && queryResults.exception.code != null) {
      const code: string = ('QueryException' + queryResults.exception.code).toLocaleString();
      this.textContainer.innerHTML = l('QueryException', code);
    } else if (queryResults.results.length == 0) {
      this.updateQueryTagsInNoResultsContainer();
      this.displayInfoOnNoResults();
    } else {
      this.lastKnownGoodState = this.queryStateModel.getAttributes();
    }
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    Assert.exists(data);
    this.render(data);
  }

  private updateSummaryIfResultsWereReceived(data: IQuerySuccessEventArgs) {
    if (!data.results.results.length) {
      return;
    }

    const message = QuerySummaryUtils.htmlMessage(this.root, data);
    this.textContainer.innerHTML = message;
  }

  private updateNoResultsSnapshot() {
    const noResultsContainer = this.getNoResultsContainer();
    if (this.noResultsSnapshot == null && noResultsContainer) {
      this.noResultsSnapshot = noResultsContainer.innerHTML;
    }
  }

  private updateQueryTagsInNoResultsContainer() {
    const noResultsContainer = this.getNoResultsContainer();
    if (noResultsContainer) {
      noResultsContainer.innerHTML = this.replaceQueryTagsWithHighlightedQuery(this.noResultsSnapshot);
    }
  }

  private replaceQueryTagsWithHighlightedQuery(template: string) {
    const highlightedQuery = `<span class="coveo-highlight">${this.sanitizedQuery}</span>`;
    return QuerySummaryUtils.replaceQueryTags(template, highlightedQuery);
  }

  private get sanitizedQuery() {
    return escape(this.queryStateModel.get(QueryStateModel.attributesEnum.q));
  }

  private displayInfoOnNoResults() {
    this.showNoResultsPage();

    if (this.options.enableNoResultsFoundMessage) {
      const noResultsFoundMessage = this.getNoResultsFoundMessageElement();
      this.textContainer.appendChild(noResultsFoundMessage.el);
    }

    if (this.options.enableCancelLastAction) {
      const cancelLastAction = this.getCancelLastActionElement();
      this.textContainer.appendChild(cancelLastAction.el);
    }

    if (this.options.enableSearchTips) {
      const searchTipsTitle = this.getSearchTipsTitleElement();
      const searchTipsList = this.getSearchTipsListElement();
      this.textContainer.appendChild(searchTipsTitle.el);
      this.textContainer.appendChild(searchTipsList.el);
    }
  }

  private hideNoResultsPage() {
    const noResultsContainers = this.getAllNoResultsContainer();
    noResultsContainers.forEach(noResultsContainer => {
      $$(noResultsContainer).removeClass('coveo-no-results');
    });
  }

  private showNoResultsPage() {
    const noResultsContainers = this.getAllNoResultsContainer();
    noResultsContainers.forEach(noResultsContainer => {
      $$(noResultsContainer).addClass('coveo-no-results');
    });
  }

  private getNoResultsContainer(): HTMLElement {
    return $$(this.element).find(`.${noResultsCssClass}`);
  }

  private getAllNoResultsContainer(): HTMLElement[] {
    return $$(this.element).findAll(`.${noResultsCssClass}`);
  }

  private getNoResultsFoundMessageElement() {
    const parsedNoResultsFoundMessage = this.replaceQueryTagsWithHighlightedQuery(this.options.noResultsFoundMessage);

    const noResultsFoundMessage = $$(
      'div',
      {
        className: 'coveo-query-summary-no-results-string'
      },
      parsedNoResultsFoundMessage
    );

    return noResultsFoundMessage;
  }

  private getCancelLastActionElement() {
    const cancelLastAction = $$(
      'div',
      {
        className: 'coveo-query-summary-cancel-last'
      },
      l('CancelLastAction')
    );

    cancelLastAction.on('click', () => {
      this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.noResultsBack, {}, this.root);
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.noResultsBack, {});
      if (this.lastKnownGoodState) {
        this.queryStateModel.reset();
        this.queryStateModel.setMultiple(this.lastKnownGoodState);
        $$(this.root).trigger(QuerySummaryEvents.cancelLastAction);
        this.queryController.executeQuery();
      } else {
        history.back();
      }
    });

    return cancelLastAction;
  }

  private getSearchTipsTitleElement() {
    const searchTipsInfo = $$('div', {
      className: 'coveo-query-summary-search-tips-info'
    });
    searchTipsInfo.text(l('SearchTips'));

    return searchTipsInfo;
  }

  private getSearchTipsListElement() {
    const searchTips = $$('ul');

    const checkSpelling = $$('li');
    checkSpelling.text(l('CheckSpelling'));

    const fewerKeywords = $$('li');
    fewerKeywords.text(l('TryUsingFewerKeywords'));

    searchTips.el.appendChild(checkSpelling.el);
    searchTips.el.appendChild(fewerKeywords.el);

    if (this.queryStateModel.atLeastOneFacetIsActive()) {
      const fewerFilter = $$('li');
      fewerFilter.text(l('SelectFewerFilters'));
      searchTips.el.appendChild(fewerFilter.el);
    }

    return searchTips;
  }
}
Initialization.registerAutoCreateComponent(QuerySummary);
