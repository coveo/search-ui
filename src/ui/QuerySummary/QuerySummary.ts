import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$ } from '../../utils/Dom';
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

export interface IQuerySummaryOptions {
  enableResultsSummary?: boolean;
  enableNoResultsForSearch?: boolean;
  enableCancelLastAction?: boolean;
  enableSearchTips?: boolean;
  noResultsForSearchMessage?: string;
}

// TODO : Is it the right way to declare a constant like this?
const QUERY_TAG: string = '<%-query%>';

/**
 * The QuerySummary component can display information about the currently displayed range of results (e.g., "Results
 * 1-10 of 123").
 *
 * If the query matches no item, the QuerySummary component can instead display tips to help the end user formulate
 * a better query.
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
    // TODO : Add description
    enableResultsSummary: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    // TODO : Add description
    enableNoResultsForSearch: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    // TODO : Add description
    noResultsForSearchMessage: ComponentOptions.buildStringOption({
      defaultValue: l('noResultFor', ' '),
      depend: 'enableNoResultsForSearch',
      postProcessing: (value, options) => value || l('noResultFor', ' ')
    }),

    // TODO : Add description
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
    this.element.appendChild(this.textContainer);
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

    if (this.options.enableResultsSummary) {
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

  private parseNoResultsForSearchMessage(noResultsForSearchMessage: string) {
    let parsedNoResultsForSearchMessage = noResultsForSearchMessage.split(QUERY_TAG, 2);
    if (parsedNoResultsForSearchMessage.length == 1) {
      parsedNoResultsForSearchMessage.push('');
    }
    return parsedNoResultsForSearchMessage;
  }

  private isDefautlValue() {
    return this.options.noResultsForSearchMessage == l('noResultFor', ' ');
  }

  private isSubArrayInArray(array: string, subarray: string) {
    let subArrayfound: boolean;
    let sl: number = subarray.length,
      l: number = array.length + 1 - sl;

    for (let i = 0; i < l; i++) {
      subArrayfound = true;
      for (let j = 0; j < sl; j++) {
        if (array[i + j] !== subarray[j]) {
          subArrayfound = false;
          break;
        }
      }
      if (subArrayfound) {
        return true;
      }
    }
    return false;
  }

  private displayInfoOnNoResults() {
    const queryEscaped = escape(this.queryStateModel.get(QueryStateModel.attributesEnum.q));
    let queryEscapedValue: string;
    // TODO : we could use : _.contains(this.options.noResultsForSearchMessage, QUERY_TAG)
    //        if we assume the QUERY_TAG has a space before and after it.
    // I didn't find an equivalent for isSubArrayInArray()
    // In this scenario isSubArrayInArray() is more flexible than _.contains
    const isQueryTagInMessage = this.isSubArrayInArray(this.options.noResultsForSearchMessage, QUERY_TAG);

    if (!isQueryTagInMessage && !this.isDefautlValue()) {
      queryEscapedValue = '';
    } else {
      queryEscapedValue = queryEscaped;
    }

    let queryEscapedString = $$(
      'span',
      {
        className: 'coveo-highlight'
      },
      queryEscapedValue
    );

    let parsedNoResultsForSearchMessage = this.parseNoResultsForSearchMessage(this.options.noResultsForSearchMessage);

    let noResultsForString = $$(
      'div',
      {
        className: 'coveo-query-summary-no-results-string'
      },
      parsedNoResultsForSearchMessage[0],
      queryEscapedString,
      parsedNoResultsForSearchMessage[1]
    );

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

    const searchTipsInfo = $$('div', {
      className: 'coveo-query-summary-search-tips-info'
    });
    searchTipsInfo.text(l('SearchTips'));
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

    if (noResultsForString && this.options.enableNoResultsForSearch) {
      this.textContainer.appendChild(noResultsForString.el);
    }

    if (this.options.enableCancelLastAction) {
      this.textContainer.appendChild(cancelLastAction.el);
    }

    if (this.options.enableSearchTips) {
      this.textContainer.appendChild(searchTipsInfo.el);
      this.textContainer.appendChild(searchTips.el);
    }
  }
}
Initialization.registerAutoCreateComponent(QuerySummary);
