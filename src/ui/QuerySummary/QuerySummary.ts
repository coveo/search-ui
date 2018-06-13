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

const QUERY_TAG: string = '<%-query%>';
const DEFAULT_NO_RESULT_FOUND_MESSAGE: string = l('noResultFor', QUERY_TAG);

const SHOW_IF_NO_RESULTS: string = 'coveo-show-if-no-results';

// TODO : Documentation review :
//        Do we want to change the description of the QuerySummary component?
//        This specific part : "If the query matches [...] a better query."
//        Basicaly do we want to add a description for the NO_RESULT_FOUND_MESSAGE about the fact that it can be edited?
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

    // TODO : Documentation review
    /**
     * Specifies whether to display the a message to the end user when there are no search results.
     *
     * Default value is `true`.
     */
    enableNoResultsFoundMessage: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    // TODO : Documentation review : I'm not sure if we should put an example in the description and if the description is precise enough?
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

    // TODO : Documentation review
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
    $$(this.element).append(this.textContainer);
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
      let messageSections = noResultsFoundMessage.split(QUERY_TAG);
      let messageElements = Array<Dom>();

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
    return noResultsFoundMessage.split(QUERY_TAG).length > 0;
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
    const showIfNoResultsElement = this.element.getElementsByClassName(SHOW_IF_NO_RESULTS);
    if (showIfNoResultsElement.length > 0) {
      showIfNoResultsElement[0].classList.add('coveo-hidden');
    }
  }

  private showCustomNoResultsFoundPage() {
    const showIfNoResultsElement = this.element.getElementsByClassName(SHOW_IF_NO_RESULTS);
    if (showIfNoResultsElement.length > 0) {
      showIfNoResultsElement[0].classList.remove('coveo-hidden');
    }
  }

  private getNoResultsFoundMessageElement() {
    let parsedNoResultsFoundMessage = this.parseNoResultsFoundMessage(this.options.noResultsFoundMessage);

    let noResultsFoundMessage = $$(
      'div',
      {
        className: 'coveo-query-summary-no-results-string'
      },
      ...parsedNoResultsFoundMessage
    );

    return noResultsFoundMessage;
  }

  private createTextElement(text: string) {
    let textContainer = $$('span', {}, text);
    return textContainer;
  }

  private getQueryElement() {
    const queryEscaped = escape(this.queryStateModel.get(QueryStateModel.attributesEnum.q));
    const isQueryTagInMessage = this.isQuerySummaryTagInMessage(this.options.noResultsFoundMessage);
    let queryEscapedValue: string;

    if (!isQueryTagInMessage) {
      queryEscapedValue = '';
    } else {
      queryEscapedValue = queryEscaped;
    }

    let query = $$(
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
