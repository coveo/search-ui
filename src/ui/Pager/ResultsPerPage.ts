import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {InitializationEvents} from '../../events/InitializationEvents';
import {Initialization} from '../Base/Initialization';
import {QueryEvents, INewQueryEventArgs, IBuildingQueryEventArgs, IQuerySuccessEventArgs, INoResultsEventArgs} from '../../events/QueryEvents'
import {analyticsActionCauseList, IAnalyticsPagerMeta, IAnalyticsActionCause} from '../Analytics/AnalyticsActionListMeta'
import {Assert} from '../../misc/Assert'
import {l} from '../../strings/Strings'
import {$$} from '../../utils/Dom'

export interface IResultsPerPageOptions {
  numberOfResults?: string[];
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
    numberOfResults: ComponentOptions.buildListOption({ defaultValue: ['10', '50', '100'] })
  }

  public currentResultsPerPage: number;

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

    this.currentResultsPerPage = +this.options.numberOfResults[0];

    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, () => this.handleQueryError());

    var span = document.createElement('span');
    $$(span).addClass('coveo-results-per-page-text');
    $$(span).setHtml('Results per page:');
    element.appendChild(span);
    this.list = document.createElement('ul');
    $$(this.list).addClass('coveo-results-per-page-list');
    element.appendChild(this.list);
  }

  /**
   * Set the current page, and execute a query.<br/>
   * Log the required analytics event (pagerNumber by default)
   * @param pageNumber
   * @param analyticCause
   */
  public setResultsPerPage(resultsPerPage: number, analyticCause: IAnalyticsActionCause = analyticsActionCauseList.pagerResize) {
    Assert.exists(resultsPerPage);
    Assert.check(this.options.numberOfResults.indexOf(resultsPerPage.toString(10)) != -1);
    this.currentResultsPerPage = resultsPerPage;
    this.queryController.options.resultsPerPage = this.currentResultsPerPage;
    this.usageAnalytics.logCustomEvent<IAnalyticsPagerMeta>(analyticCause, { pagerNumber: this.queryController.options.page, currentResultsPerPage: this.currentResultsPerPage }, this.element);
    this.queryController.executeQuery({
      ignoreWarningSearchEvent: true,
      keepLastSearchUid: true,
      origin: this
    });
  }

  private handleQueryError() {
    this.reset();
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    this.reset();
    let numResultsList: string[] = this.options.numberOfResults;
    for (var i = 0; i < numResultsList.length; i++) {

      var listItemValue = document.createElement('a');
      $$(listItemValue).text(numResultsList[i]);

      var listItem = document.createElement('li');
      $$(listItem).addClass('coveo-results-per-page-list-item');
      if (+numResultsList[i] == this.currentResultsPerPage) {
        $$(listItem).addClass('coveo-active');
      }

      ((resultsPerPage: number) => {
        $$(listItem).on('click', () => {
          this.handleClickPage(+numResultsList[resultsPerPage]);
        })
      })(i);

      listItem.appendChild(listItemValue);
      this.list.appendChild(listItem);
    }
  }
  private handleClickPage(resultsPerPage: number) {
    Assert.exists(resultsPerPage);
    this.setResultsPerPage(resultsPerPage);
  }

  private reset() {
    $$(this.list).empty();
  }
}

Initialization.registerAutoCreateComponent(ResultsPerPage);
