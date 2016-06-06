import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {QueryEvents, IQuerySuccessEventArgs} from '../../events/QueryEvents';
import {IComponentBindings} from '../Base/ComponentBindings';
import {$$, Dom} from '../../utils/Dom';
import {Assert} from '../../misc/Assert';
import {l} from '../../strings/Strings';
import {analyticsActionCauseList, IAnalyticsNoMeta} from '../Analytics/AnalyticsActionListMeta';
import {Initialization} from '../Base/Initialization';
import {QueryStateModel} from '../../models/QueryStateModel';

declare const Globalize;

export interface IQuerySummaryOptions {
  enableSearchTips?: boolean;
  onlyDisplaySearchTips?: boolean;
}

/**
 * This component displays information about the current range of results being displayed (ex: 1-10 of 123).<br/>
 * If the query matches no documents, it will display advices and tip for the end user on how to remedy the problem.
 */
export class QuerySummary extends Component {
  static ID = 'QuerySummary';
  /**
   * Options for the component
   * @componentOptions
   */
  static options: IQuerySummaryOptions = {
    /**
     * Specifies whether the search tips are displayed to the end user when there are no search results.<br/>
     * The default value is <code>true</code>.
     */
    enableSearchTips: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies whether to hide the information about the current range of results being displayed and only display the search tips.<br/>
     * The default value is <code>false</code>.
     */
    onlyDisplaySearchTips: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  private textContainer: HTMLElement;

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
        let first = Globalize.format(data.query.firstResult + 1, 'n0');
        let last = Globalize.format(data.query.firstResult + data.results.results.length, 'n0');
        let totalCount = Globalize.format(data.results.totalCountFiltered, 'n0');

        let highlightFirst = $$('span', { className: 'coveo-highlight' }, first).el;
        let highlightLast = $$('span', { className: 'coveo-highlight' }, last).el;
        let highlightTotal = $$('span', { className: 'coveo-highlight' }, totalCount).el;

        this.textContainer.innerHTML = l('ShowingResultsOf', highlightFirst.outerHTML, highlightLast.outerHTML, highlightTotal.outerHTML, data.results.results.length);
      }
    }

    if (data.results.exception != null && data.results.exception.code != null) {
      let code: string = ('QueryException' + data.results.exception.code).toLocaleString();
      this.textContainer.innerHTML = l('QueryException', code);
    } else if (data.results.results.length == 0) {
      this.displayInfoOnNoResults();
    }
  }

  private displayInfoOnNoResults() {
    let queryEscaped = _.escape(this.queryStateModel.get(QueryStateModel.attributesEnum.q));
    let noResultsForString: Dom;

    if (queryEscaped != '') {
      noResultsForString = $$('div', {
        className: 'coveo-query-summary-no-results-string'
      }, l('noResultFor', $$('span', { className: 'coveo-highlight' }, queryEscaped).el.outerHTML));
    }
    let cancelLastAction = $$('div', {
      className: 'coveo-query-summary-cancel-last'
    }, l('CancelLastAction'));

    cancelLastAction.on('click', () => {
      this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.noResultsBack, {}, this.root);
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.noResultsBack, {})
      history.back();
    });

    let searchTipsInfo = $$('div', {
      className: 'coveo-query-summary-search-tips-info'
    })
    searchTipsInfo.text(l('SearchTips'));
    let searchTips = $$('ul');

    let checkSpelling = $$('li');
    checkSpelling.text(l('CheckSpelling'));

    let fewerKeywords = $$('li');
    fewerKeywords.text(l('TryUsingFewerKeywords'));

    searchTips.el.appendChild(checkSpelling.el);
    searchTips.el.appendChild(fewerKeywords.el);

    if (this.queryStateModel.atLeastOneFacetIsActive()) {
      let fewerFilter = $$('li');
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
