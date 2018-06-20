import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$, Dom } from '../../utils/Dom';
import { Assert } from '../../misc/Assert';
import { l } from '../../strings/Strings';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { Initialization } from '../Base/Initialization';
import { QueryStateModel } from '../../models/QueryStateModel';
import * as Globalize from 'globalize';
import { QuerySummaryEvents } from '../../events/QuerySummaryEvents';
import { exportGlobally } from '../../GlobalExports';
import { escape, any } from 'underscore';
import { get } from '../../ui/Base/RegisteredNamedMethods';
import ResultListModule = require('../ResultList/ResultList');
import 'styling/_QuerySummary';
import { IQuery } from '../../rest/Query';
import { IQueryResults } from '../../rest/QueryResults';
import * as _ from 'underscore';

export interface IQuerySummaryOptions {
  onlyDisplaySearchTips?: boolean;
  enableNoResultsFoundMessage?: boolean;
  noResultsFoundMessage?: string;
  enableCancelLastAction?: boolean;
  enableSearchTips?: boolean;
}

const queryTag: string = '${query}';
const noResultsCssClass: string = '.coveo-show-if-no-results';

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
    noResultsFoundMessage: ComponentOptions.buildStringOption({
      defaultValue: l('noResultFor', queryTag),
      depend: 'enableNoResultsFoundMessage'
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
     * Specifies whether to display the search tips to the end user when there are no search results.
     *
     * Default value is `true`.
     */
    enableSearchTips: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  private textContainer: HTMLElement;
  private lastKnownGoodState: any;

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

  private render(queryPerformed: IQuery, queryResults: IQueryResults) {
    $$(this.textContainer).empty();
    this.show();

    this.hideCustomNoResultsFoundPage();

    if (!this.options.onlyDisplaySearchTips) {
      if (this.isInfiniteScrollingMode()) {
        this.renderSummaryInInfiniteScrollingMode(queryPerformed, queryResults);
      } else {
        this.renderSummaryInStandardMode(queryPerformed, queryResults);
      }
    }

    if (queryResults.exception != null && queryResults.exception.code != null) {
      const code: string = ('QueryException' + queryResults.exception.code).toLocaleString();
      this.textContainer.innerHTML = l('QueryException', code);
    } else if (queryResults.results.length == 0) {
      this.displayInfoOnNoResults();
    } else {
      this.lastKnownGoodState = this.queryStateModel.getAttributes();
    }
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    Assert.exists(data);
    this.render(data.query, data.results);
  }

  private isInfiniteScrollingMode() {
    const allResultsLists = $$(this.root).findAll(`.${Component.computeCssClassNameForType('ResultList')}`);
    const anyResultListIsUsingInfiniteScroll = any(allResultsLists, resultList => {
      return (get(resultList) as ResultListModule.ResultList).options.enableInfiniteScroll;
    });
    return anyResultListIsUsingInfiniteScroll;
  }

  private formatSummary(queryPerformed: IQuery, queryResults: IQueryResults) {
    const first = Globalize.format(queryPerformed.firstResult + 1, 'n0');
    const last = Globalize.format(queryPerformed.firstResult + queryResults.results.length, 'n0');
    const totalCount = Globalize.format(queryResults.totalCountFiltered, 'n0');
    const query = queryPerformed.q ? escape(queryPerformed.q.trim()) : '';

    const highlightFirst = $$('span', { className: 'coveo-highlight' }, first).el;
    const highlightLast = $$('span', { className: 'coveo-highlight' }, last).el;
    const highlightTotal = $$('span', { className: 'coveo-highlight' }, totalCount).el;
    const highlightQuery = $$('span', { className: 'coveo-highlight' }, query).el;

    return {
      first,
      last,
      totalCount,
      query,
      highlightFirst,
      highlightLast,
      highlightTotal,
      highlightQuery
    };
  }

  private renderSummaryInStandardMode(queryPerformed: IQuery, queryResults: IQueryResults) {
    if (queryResults.results.length > 0) {
      const { query, highlightFirst, highlightLast, highlightTotal, highlightQuery } = this.formatSummary(queryPerformed, queryResults);

      if (query) {
        this.textContainer.innerHTML = l(
          'ShowingResultsOfWithQuery',
          highlightFirst.outerHTML,
          highlightLast.outerHTML,
          highlightTotal.outerHTML,
          highlightQuery.outerHTML,
          queryResults.results.length
        );
      } else {
        this.textContainer.innerHTML = l(
          'ShowingResultsOf',
          highlightFirst.outerHTML,
          highlightLast.outerHTML,
          highlightTotal.outerHTML,
          queryResults.results.length
        );
      }
    }
  }

  private renderSummaryInInfiniteScrollingMode(queryPerformed: IQuery, queryResults: IQueryResults) {
    if (queryResults.results.length > 0) {
      const { query, highlightQuery, highlightTotal } = this.formatSummary(queryPerformed, queryResults);

      if (query) {
        this.textContainer.innerHTML = l(
          'ShowingResultsWithQuery',
          highlightTotal.outerHTML,
          highlightQuery.outerHTML,
          queryResults.results.length
        );
      } else {
        this.textContainer.innerHTML = l('ShowingResults', highlightTotal.outerHTML, queryResults.results.length);
      }
    }
  }

  private parseNoResultsFoundMessage(noResultsFoundMessage: string) {
    if (this.isQuerySummaryTagInMessage(noResultsFoundMessage)) {
      const messageSections = noResultsFoundMessage.split(queryTag);
      let messageElements: Dom[] = [];
      _.each(messageSections, section => {
        messageElements.push(this.createTextElement(section));
      });

      for (let i = 0, j = messageElements.length - 1; i < j; i++) {
        if (messageElements[i].el.innerHTML != '' && messageElements[i + 1].el.innerHTML != '') {
          messageElements.splice(i + 1, 0, this.getQueryElement());
          i++;
          j++;
        }
      }

      _.each(messageElements, message => {
        if (message.el.innerHTML == '') {
          message = this.getQueryElement();
        }
      });

      return messageElements;
    } else {
      return [this.createTextElement(noResultsFoundMessage)];
    }
  }

  private isQuerySummaryTagInMessage(noResultsFoundMessage: string) {
    return noResultsFoundMessage.split(queryTag).length > 0;
  }

  private displayInfoOnNoResults() {
    this.showCustomNoResultsFoundPage();

    const noResultsFoundMessage = this.getNoResultsFoundMessageElement();
    const cancelLastAction = this.getCancelLastActionElement();
    const searchTipsInfo = this.getSearchTipsInfoElement();
    const searchTips = this.getSearchTipsElement();

    if (noResultsFoundMessage && this.options.enableNoResultsFoundMessage) {
      this.textContainer.appendChild(noResultsFoundMessage.el);
    }

    if (this.options.enableCancelLastAction) {
      this.textContainer.appendChild(cancelLastAction.el);
    }

    if (this.options.enableSearchTips) {
      this.textContainer.appendChild(searchTipsInfo.el);
      this.textContainer.appendChild(searchTips.el);
    }
  }

  private hideCustomNoResultsFoundPage() {
    const showIfNoResultsElement = $$(this.element).find(noResultsCssClass);
    if (showIfNoResultsElement) {
      $$(showIfNoResultsElement).addClass('coveo-no-results-found-page-hidden');
    }
  }

  private showCustomNoResultsFoundPage() {
    const showIfNoResultsElement = $$(this.element).find(noResultsCssClass);
    if (showIfNoResultsElement) {
      $$(showIfNoResultsElement).removeClass('coveo-no-results-found-page-hidden');
    }
  }

  private getNoResultsFoundMessageElement() {
    const parsedNoResultsFoundMessage = this.parseNoResultsFoundMessage(this.options.noResultsFoundMessage);

    const noResultsFoundMessage = $$(
      'div',
      {
        className: 'coveo-query-summary-no-results-string'
      },
      ...parsedNoResultsFoundMessage
    );

    return noResultsFoundMessage;
  }

  private createTextElement(text: string) {
    return $$('span', {}, text);
  }

  private getQueryElement() {
    const queryEscaped = escape(this.queryStateModel.get(QueryStateModel.attributesEnum.q));
    const isQueryTagInMessage = this.isQuerySummaryTagInMessage(this.options.noResultsFoundMessage);
    let queryEscapedValue: string;

    if (isQueryTagInMessage) {
      queryEscapedValue = queryEscaped;
    } else {
      queryEscapedValue = '';
    }

    const query = $$(
      'span',
      {
        className: 'coveo-highlight'
      },
      queryEscapedValue
    );

    return query;
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

  private getSearchTipsInfoElement() {
    const searchTipsInfo = $$('div', {
      className: 'coveo-query-summary-search-tips-info'
    });

    return searchTipsInfo;
  }

  private getSearchTipsElement() {
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
