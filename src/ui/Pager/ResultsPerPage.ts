import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {Initialization} from '../Base/Initialization';
import {QueryEvents, IQuerySuccessEventArgs, INoResultsEventArgs} from '../../events/QueryEvents'
import {analyticsActionCauseList, IAnalyticsResultsPerPageMeta, IAnalyticsActionCause} from '../Analytics/AnalyticsActionListMeta'
import {Assert} from '../../misc/Assert'
import {$$} from '../../utils/Dom'

export interface IResultsPerPageOptions {
  choicesDisplayed?: number[];
}

/**
 * This component attaches itself to a div and allows users to choose the number of results displayed per page.<br/>
 */
export class ResultsPerPage extends Component {
  static ID = 'ResultsPerPage';

  /**
   * The options for the ResultsPerPage
   * @componentOptions
   */
  static options: IResultsPerPageOptions = {
    /**
     * Specifies the possible values of the number of results to display per page.<br/>
     * The default value is 10, 25, 50, 100
     */
    choicesDisplayed: ComponentOptions.buildCustomListOption<number[]>(function (list: string[]) {
      let values = _.map(list, function (value) {
        return parseInt(value, 10);
      });
      return values.length == 0 ? null : values;
    }, { defaultValue: [10, 25, 50, 100] })
  };

  private currentResultsPerPage: number;
  private span: HTMLElement;
  private list: HTMLElement;

  /**
   * Create a new ResultsPerPage<br/>
   * Render itself on every query success.
   * @param element HTMLElement on which to instantiate the page (Normally : a div)
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options?: IResultsPerPageOptions, bindings?: IComponentBindings) {
    super(element, ResultsPerPage.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultsPerPage, options);
    this.currentResultsPerPage = this.options.choicesDisplayed[0];
    this.queryController.options.resultsPerPage = this.currentResultsPerPage;

    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, () => this.handleQueryError());
    this.bind.onRootElement(QueryEvents.noResults, (args: INoResultsEventArgs) => this.handleNoResults());
    this.initComponent(element);
  }

  /**
   * Set the current number of results per page, and execute a query.<br/>
   * Log the required analytics event (pagerResize by default)
   * @param resultsPerPage
   * @param analyticCause
   */
  public setResultsPerPage(resultsPerPage: number, analyticCause: IAnalyticsActionCause = analyticsActionCauseList.pagerResize) {
    Assert.exists(resultsPerPage);
    Assert.check(this.options.choicesDisplayed.indexOf(resultsPerPage) != -1, 'The specified number of results is not available in the options.');
    this.currentResultsPerPage = resultsPerPage;
    this.queryController.options.resultsPerPage = this.currentResultsPerPage;
    this.usageAnalytics.logCustomEvent<IAnalyticsResultsPerPageMeta>(analyticCause, { currentResultsPerPage: this.currentResultsPerPage }, this.element);
    this.queryController.executeQuery({
      ignoreWarningSearchEvent: true,
      keepLastSearchUid: true,
      origin: this
    });
  }

  private initComponent(element: HTMLElement) {
    this.span = $$('span', {
      className: 'coveo-results-per-page-text'
    }, 'Results per page').el;
    element.appendChild(this.span);
    this.list = $$('ul', {
      className: 'coveo-results-per-page-list'
    }).el;
    element.appendChild(this.list);
  }

  private render() {
    $$(this.span).removeClass('coveo-results-per-page-no-results');
    let numResultsList: number[] = this.options.choicesDisplayed;
    for (var i = 0; i < numResultsList.length; i++) {

      let listItem = $$('li', {
        className: 'coveo-results-per-page-list-item'
      });
      if (numResultsList[i] == this.currentResultsPerPage) {
        listItem.addClass('coveo-active');
      }

      ((resultsPerPage: number) => {
        listItem.on('click', () => {
          this.handleClickPage(numResultsList[resultsPerPage]);
        })
      })(i);

      listItem.el.appendChild($$('a', {
        className: 'coveo-results-per-page-list-item-text'
      }, numResultsList[i].toString()).el);
      this.list.appendChild(listItem.el);
    }
  }

  private handleQueryError() {
    this.reset();
  }

  private handleNoResults() {
    this.reset();
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (data.results.results.length != 0) {
      this.reset();
      this.render();
    }
  }

  private handleClickPage(resultsPerPage: number) {
    Assert.exists(resultsPerPage);
    this.setResultsPerPage(resultsPerPage);
  }

  private reset() {
    $$(this.span).addClass('coveo-results-per-page-no-results');
    $$(this.list).empty();
  }
}

Initialization.registerAutoCreateComponent(ResultsPerPage);
