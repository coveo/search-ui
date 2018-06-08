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
  onlyDisplaySearchTips?: boolean;
  enableNoResultsFoundMessage?: boolean;
  noResultsFoundMessage?: string;
  enableCancelLastAction?: boolean;
  enableSearchTips?: boolean;
}

// TODO : Is it the right place to declare constants like this in a scenario like this one?
const QUERY_TAG: string = '<%-query%>';
const DEFAULT_NO_RESULT_FOUND_MESSAGE: string = l('noResultFor', ' ');

// TODO : Do we want to change the description of the QuerySummary component?
//        This specific part : "If the query matches [...] a better query."
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
    /**
     * Specifies whether to hide the information about the currently displayed range of results and only display the
     * search tips instead.
     *
     * Default value is `false`.
     */
    onlyDisplaySearchTips: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether to display the a message to the end user when there are no search results.
     *
     * Default value is `true`.
     */
    enableNoResultsFoundMessage: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    // TODO : There is probably an other place where I will need to add this documentation for the query tag :<%-query%>)?
    // TODO : I'm not sure if we should put an example in the description and if the description is precise enough?
    /**
     * Specifies a custom message to display when there are no search results.
     *
     * A query tag ({@link QUERY_TAG}) can be added in the message. This tag will
     * be replaced by the search box input who triggered the no results found page.
     *
     * Ex.:
     *
     * Searchbox input : "ThereIsNoResults"
     *
     * {@link QUERY_TAG} = <%-query%>
     *
     * Message input : "We are sorry, <%-query%> did not match any results."
     *
     * Final Message : "We are sorry, ThereIsNoResults did not match any results."
     *
     * Default value is `No results for <%-query%>`.
     */
    noResultsFoundMessage: ComponentOptions.buildStringOption({
      defaultValue: DEFAULT_NO_RESULT_FOUND_MESSAGE,
      depend: 'enableNoResultsFoundMessage',
      postProcessing: (value, options) => value || DEFAULT_NO_RESULT_FOUND_MESSAGE
    }),

    /**
     * Specifies whether to display the cancel last action link to the end user when there are no search results.
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

  // TODO : For now, the function is built such as the custom message can only contain one QUERY_TAG
  //        Do we want to be able to put mutiple QUERY_TAG ?
  private parseNoResultsFoundMessage(noResultsFoundMessage: string) {
    let parsedNoResultsFoundMessage = noResultsFoundMessage.split(QUERY_TAG, 2);
    if (parsedNoResultsFoundMessage.length == 1) {
      parsedNoResultsFoundMessage.push('');
    }
    return parsedNoResultsFoundMessage;
  }

  private isDefautlNoResulstFoundMessage() {
    return this.options.noResultsFoundMessage == DEFAULT_NO_RESULT_FOUND_MESSAGE;
  }

  private isSubArrayInArray(array: string, subarray: string) {
    let subArrayfound: boolean;
    let subArrayLength: number = subarray.length,
      arrayLengthToScan: number = array.length + 1 - subArrayLength;

    for (let i = 0; i < arrayLengthToScan; i++) {
      subArrayfound = true;
      for (let j = 0; j < subArrayLength; j++) {
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
    // TODO : I didn't find an equivalent for isSubArrayInArray() but something might exist?
    const isQueryTagInMessage = this.isSubArrayInArray(this.options.noResultsFoundMessage, QUERY_TAG);

    if (!isQueryTagInMessage && !this.isDefautlNoResulstFoundMessage()) {
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

    let parsedNoResultsFoundMessage = this.parseNoResultsFoundMessage(this.options.noResultsFoundMessage);

    let noResultsForString = $$(
      'div',
      {
        className: 'coveo-query-summary-no-results-string'
      },
      parsedNoResultsFoundMessage[0],
      queryEscapedString,
      parsedNoResultsFoundMessage[1]
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

    if (noResultsForString && this.options.enableNoResultsFoundMessage) {
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
