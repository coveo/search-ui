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
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_QuerySummary';

export interface IQuerySummaryOptions {
  enableSearchTips?: boolean;
  onlyDisplaySearchTips?: boolean;
}

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
     * Specifies whether to display the search tips to the end user when there are no search results.
     *
     * Default value is `true`.
     */
    enableSearchTips: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to hide the information about the currently displayed range of results and only display the
     * search tips instead.
     *
     * Default value is `false`.
     */
    onlyDisplaySearchTips: ComponentOptions.buildBooleanOption({ defaultValue: false })
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

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    Assert.exists(data);
    $$(this.textContainer).empty();
    this.show();

    if (!this.options.onlyDisplaySearchTips) {
      if (data.results.results.length > 0) {
        const first = Globalize.format(data.query.firstResult + 1, 'n0');
        const last = Globalize.format(data.query.firstResult + data.results.results.length, 'n0');
        const totalCount = Globalize.format(data.results.totalCountFiltered, 'n0');

        const highlightFirst = $$('span', { className: 'coveo-highlight' }, first).el;
        const highlightLast = $$('span', { className: 'coveo-highlight' }, last).el;
        const highlightTotal = $$('span', { className: 'coveo-highlight' }, totalCount).el;

        const query = data.query.q ? _.escape(data.query.q.trim()) : '';

        if (query) {
          const highlightQuery = $$('span', { className: 'coveo-highlight' }, query).el;

          this.textContainer.innerHTML = l(
            'ShowingResultsOfWithQuery',
            highlightFirst.outerHTML,
            highlightLast.outerHTML,
            highlightTotal.outerHTML,
            highlightQuery.outerHTML,
            data.results.results.length
          );
        } else {
          this.textContainer.innerHTML = l(
            'ShowingResultsOf',
            highlightFirst.outerHTML,
            highlightLast.outerHTML,
            highlightTotal.outerHTML,
            data.results.results.length
          );
        }
      }
    }

    if (data.results.exception != null && data.results.exception.code != null) {
      const code: string = ('QueryException' + data.results.exception.code).toLocaleString();
      this.textContainer.innerHTML = l('QueryException', code);
    } else if (data.results.results.length == 0) {
      this.displayInfoOnNoResults();
    } else {
      this.lastKnownGoodState = this.queryStateModel.getAttributes();
    }
  }

  private displayInfoOnNoResults() {
    const queryEscaped = _.escape(this.queryStateModel.get(QueryStateModel.attributesEnum.q));
    let noResultsForString: Dom;

    if (queryEscaped != '') {
      noResultsForString = $$(
        'div',
        {
          className: 'coveo-query-summary-no-results-string'
        },
        l('noResultFor', $$('span', { className: 'coveo-highlight' }, queryEscaped).el.outerHTML)
      );
    }
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

    if (this.options.enableSearchTips) {
      if (noResultsForString) {
        this.textContainer.appendChild(noResultsForString.el);
      }
      this.textContainer.appendChild(cancelLastAction.el);
      this.textContainer.appendChild(searchTipsInfo.el);
      this.textContainer.appendChild(searchTips.el);
    } else {
      if (noResultsForString) {
        this.textContainer.appendChild(noResultsForString.el);
      }
      this.textContainer.appendChild(cancelLastAction.el);
    }
  }
}
Initialization.registerAutoCreateComponent(QuerySummary);
