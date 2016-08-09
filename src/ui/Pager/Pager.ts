import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {DeviceUtils} from '../../utils/DeviceUtils'
import {QueryEvents, INewQueryEventArgs, IBuildingQueryEventArgs, IQuerySuccessEventArgs, INoResultsEventArgs} from '../../events/QueryEvents'
import {MODEL_EVENTS, IAttributeChangedEventArg} from '../../models/Model'
import {QueryStateModel} from '../../models/QueryStateModel'
import {QUERY_STATE_ATTRIBUTES} from '../../models/QueryStateModel'
import {analyticsActionCauseList, IAnalyticsPagerMeta, IAnalyticsActionCause} from '../Analytics/AnalyticsActionListMeta'
import {Initialization} from '../Base/Initialization';
import {Assert} from '../../misc/Assert'
import {l} from '../../strings/Strings'
import {$$} from '../../utils/Dom'

export interface IPagerOptions {
  numberOfPages?: number;
  enableNavigationButton?: boolean;
  maxNumberOfPages?: number;
}

/**
 * This component attaches itself to a div and allows users to navigate through the different result pages.<br/>
 * It takes care of triggering a query with the correct range whenever a user selects a page or uses the navigation buttons (Previous, Next).
 */
export class Pager extends Component {
  static ID = 'Pager';

  /**
   * The options for the Pager
   * @componentOptions
   */
  static options: IPagerOptions = {
    /**
     * Specifies how many page links to display in the pager.<br/>
     * The default value is 5 pages on desktop, 3 on mobile
     */
    numberOfPages: ComponentOptions.buildNumberOption({
      defaultFunction: () => {
        if (DeviceUtils.isMobileDevice()) {
          return 3;
        } else {
          return 5;
        }
      },
      min: 1
    }),
    /**
     * Specifies whether the Previous and Next buttons appear at each end of the pager when appropriate.<br/>
     * The default value is true.
     */
    enableNavigationButton: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the maximum number of pages that will be displayed if enough results are available.<br/>
     * The default value is 100 pages.<br/>
     * This property is typically set when the default number of accessible results from the index has been changed from it's default value of 1000. (So 10 per page X 100 maximumNumberOfPage)
     */
    maxNumberOfPages: ComponentOptions.buildNumberOption({ defaultValue: undefined })
  };

  /**
   * The current page (1 based index)
   */
  public currentPage: number;
  private listenToQueryStateChange = true;
  private ignoreNextQuerySuccess = false;

  // The normal behavior of this component is to reset to page 1 when a new
  // query is performed by other components (i.e. not pagers).
  //
  // This behavior is overridden when the 'first' state is
  // programmatically modified.
  private needToReset = true;

  private list: HTMLElement;


  /**
   * Create a new Pager. Bind multiple query events (new query, building query, query success).<br/>
   * Render itself on every query success.
   * @param element HTMLElement on which to instantiate the page (Normally : a div)
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options?: IPagerOptions, bindings?: IComponentBindings) {
    super(element, Pager.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Pager, options);
    this.currentPage = 1;

    if (this.options.maxNumberOfPages == null) {
      this.options.maxNumberOfPages = 1000 /
        (this.queryController.options.resultsPerPage > 0 ? this.queryController.options.resultsPerPage : 10);
    }

    this.bind.onRootElement(QueryEvents.newQuery, (args: INewQueryEventArgs) => this.handleNewQuery(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, () => this.handleQueryError());
    this.bind.onRootElement(QueryEvents.noResults, (args: INoResultsEventArgs) => this.handleNoResults(args));
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.FIRST, (data: IAttributeChangedEventArg) => this.handleQueryStateModelChanged(data));

    this.list = document.createElement('ul');
    $$(this.list).addClass('coveo-pager-list');
    element.appendChild(this.list);
  }

  /**
   * Set the current page, and execute a query.<br/>
   * Log the required analytics event (pagerNumber by default)
   * @param pageNumber
   * @param analyticCause
   */
  public setPage(pageNumber: number, analyticCause: IAnalyticsActionCause = analyticsActionCauseList.pagerNumber) {
    Assert.exists(pageNumber);
    this.currentPage = Math.max(Math.min(pageNumber, 1000), 1);
    this.updateQueryStateModel(this.getFirstResultNumber(this.currentPage));
    this.usageAnalytics.logCustomEvent<IAnalyticsPagerMeta>(analyticCause, { pagerNumber: this.currentPage }, this.element);
    this.queryController.executeQuery({
      ignoreWarningSearchEvent: true,
      keepLastSearchUid: true,
      origin: this
    });
  }

  /**
   * Go to the previous page, and execute a query.<br/>
   * Log the required analytics event (pagerPrevious)
   */
  public previousPage() {
    this.setPage(this.currentPage - 1, analyticsActionCauseList.pagerPrevious);
  }

  /**
   * Go to the next page, and execute a query.<br/>
   * Log the required analytics event (pagerNext)
   */
  public nextPage() {
    this.setPage(this.currentPage + 1, analyticsActionCauseList.pagerNext);
  }

  private handleNewQuery(data: INewQueryEventArgs) {
    var triggeredByPager = data && data.origin && data.origin.type == Pager.ID;
    if (this.needToReset && !triggeredByPager) {
      this.currentPage = 1;
      this.updateQueryStateModel(this.getFirstResultNumber(this.currentPage));
    }
    this.needToReset = true;
  }

  private updateQueryStateModel(attrValue: number) {
    this.listenToQueryStateChange = false;
    this.queryStateModel.set(QueryStateModel.attributesEnum.first, attrValue);
    this.listenToQueryStateChange = true;
  }

  private handleQueryError() {
    this.reset();
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    this.reset();
    if (this.ignoreNextQuerySuccess) {
      this.ignoreNextQuerySuccess = false;
    } else {
      Assert.isNotUndefined(data);

      var firstResult = data.query.firstResult;
      var count = data.results.totalCountFiltered;

      var pagerBoundary = this.computePagerBoundary(firstResult, count);
      this.currentPage = pagerBoundary.currentPage;
      if (pagerBoundary.end - pagerBoundary.start > 0) {
        for (var i = pagerBoundary.start; i <= pagerBoundary.end; i++) {

          var listItemValue = document.createElement('a');
          $$(listItemValue).addClass(['coveo-pager-list-item-text', 'coveo-pager-anchor']);
          $$(listItemValue).text(i.toString(10));

          var listItem = document.createElement('li');
          $$(listItem).addClass('coveo-pager-list-item');
          if (i == this.currentPage) {
            $$(listItem).addClass('coveo-active');
          }

          ((pageNumber: number) => {
            $$(listItem).on('click', () => {
              this.handleClickPage(pageNumber);
            })
          })(i);

          listItem.appendChild(listItemValue);
          this.list.appendChild(listItem);
        }

        if (this.options.enableNavigationButton && pagerBoundary.lastResultPage > 1) {
          this.renderNavigationButton(pagerBoundary, this.list);
        }
      }
    }
  }

  private handleNoResults(data: INoResultsEventArgs) {
    var lastValidPage = this.computePagerBoundary(data.results.totalCountFiltered, data.results.totalCount).lastResultPage;
    if (this.currentPage > lastValidPage) {
      this.ignoreNextQuerySuccess = true;
      this.setPage(lastValidPage);
    }
  }

  private reset() {
    $$(this.list).empty();
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    var eventArgs = this.getQueryEventArgs();
    data.queryBuilder.firstResult = eventArgs.first;
    data.queryBuilder.numberOfResults = eventArgs.count;
  }

  private computePagerBoundary(firstResult: number, totalCount: number): { start: number; end: number; lastResultPage: number; currentPage: number; } {
    var resultPerPage: number = this.queryController.options.resultsPerPage;
    var currentPage = Math.floor(firstResult / resultPerPage) + 1;
    var lastPageNumber: number = Math.min(Math.ceil(totalCount / resultPerPage), this.options.maxNumberOfPages);
    lastPageNumber = Math.max(lastPageNumber, 1);
    var halfLength = Math.floor(this.options.numberOfPages / 2);
    var firstPageNumber = currentPage - halfLength;
    firstPageNumber = Math.max(firstPageNumber, 1);
    var endPageNumber = firstPageNumber + this.options.numberOfPages - 1;
    endPageNumber = Math.min(endPageNumber, lastPageNumber);
    return {
      start: firstPageNumber,
      end: endPageNumber,
      lastResultPage: lastPageNumber,
      currentPage: currentPage
    };
  }

  private renderNavigationButton(pagerBoundary: { start: number; end: number; lastResultPage: number; currentPage: number; }, list: HTMLElement) {
    if (this.currentPage > 1) {
      var previous = document.createElement('li');
      $$(previous).addClass(['coveo-pager-previous', 'coveo-pager-anchor', 'coveo-pager-list-item']);
      var buttonLink = document.createElement('a');
      var buttonImg = document.createElement('span');
      buttonLink.appendChild(buttonImg);
      buttonLink.setAttribute('title', l('Previous'));
      previous.appendChild(buttonLink);
      $$(previous).on('click', () => this.handleClickPrevious());
      this.list.insertBefore(previous, this.list.firstChild);
    }

    if (this.currentPage < pagerBoundary.lastResultPage) {
      var next = document.createElement('li');
      $$(next).addClass(['coveo-pager-next', 'coveo-pager-anchor', 'coveo-pager-list-item']);
      var buttonLink = document.createElement('a');
      var buttonImg = document.createElement('span');
      buttonLink.appendChild(buttonImg);
      buttonLink.setAttribute('title', l('Next'));
      next.appendChild(buttonLink);
      $$(next).on('click', () => this.handleClickNext());
      this.list.appendChild(next);
    }
  }

  private handleQueryStateModelChanged(data: IAttributeChangedEventArg) {
    if (!this.listenToQueryStateChange) {
      return;
    }
    Assert.exists(data);
    this.needToReset = false;
    var firstResult = data.value;
    this.currentPage = this.fromFirstResultsToPageNumber(firstResult);
  }

  private handleClickPage(pageNumber: number) {
    Assert.exists(pageNumber);
    this.setPage(pageNumber);
  }

  private handleClickPrevious() {
    this.previousPage();
  }

  private handleClickNext() {
    this.nextPage();
  }

  private fromFirstResultsToPageNumber(firstResult: number): number {
    return (firstResult / this.queryController.options.resultsPerPage) + 1;
  }

  private getFirstResultNumber(pageNumber: number = this.currentPage): number {
    return (pageNumber - 1) * this.queryController.options.resultsPerPage;
  }

  private getQueryEventArgs() {
    return {
      count: this.queryController.options.resultsPerPage,
      first: this.getFirstResultNumber()
    };
  }
}

Initialization.registerAutoCreateComponent(Pager);
