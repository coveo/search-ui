import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { DeviceUtils } from '../../utils/DeviceUtils';
import {
  QueryEvents,
  INewQueryEventArgs,
  IBuildingQueryEventArgs,
  IQuerySuccessEventArgs,
  INoResultsEventArgs,
  IDoneBuildingQueryEventArgs
} from '../../events/QueryEvents';
import { MODEL_EVENTS, IAttributeChangedEventArg } from '../../models/Model';
import { QueryStateModel } from '../../models/QueryStateModel';
import { QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { analyticsActionCauseList, IAnalyticsPagerMeta, IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { Initialization } from '../Base/Initialization';
import { Assert } from '../../misc/Assert';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import { exportGlobally } from '../../GlobalExports';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import 'styling/_Pager';

export interface IPagerOptions {
  numberOfPages: number;
  enableNavigationButton: boolean;
  maxNumberOfPages: number;
  maximumNumberOfResultsFromIndex: number;
}

/**
 * The Pager component attaches itself to a `div` element and renders widgets that allow the end user to navigate
 * through the different result pages.
 *
 * This component takes care of triggering a query with the correct result range whenever the end user selects a page or
 * uses the navigation buttons (**Previous** and **Next**).
 */
export class Pager extends Component {
  static ID = 'Pager';

  static doExport = () => {
    exportGlobally({
      Pager: Pager
    });
  };

  /**
   * The options for the Pager
   * @componentOptions
   */
  static options: IPagerOptions = {
    /**
     * Specifies how many page links to display in the pager.
     *
     * Default value is `5` on a desktop computers and `3` on a mobile device. Minimum value is `1`.
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
     * Specifies whether the **Previous** and **Next** buttons should appear at each end of the pager when appropriate.
     *
     * The default value is `true`.
     */
    enableNavigationButton: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies the maximum number of pages to display if enough results are available.
     *
     * This property is typically set when the default number of accessible results from the index has been changed from its default value of `1000` (10 results per page X 100 `maxNumberOfPages`).
     * Default value is `100`
     *
     * @deprecated This is a deprecated option. The `Pager` now automatically adapts itself on each new query, so you no longer need to specify a value for this option. However, if the default maximum number of accessible results value was changed on your Coveo index, you should use the [`maximumNumberOfResultsFromIndex`]{@link Pager.options.maximumNumberOfResultsFromIndex} option to specify the new value.
     */
    maxNumberOfPages: ComponentOptions.buildNumberOption({
      defaultValue: undefined,
      deprecated:
        'This is a deprecated option. The pager will automatically adapt itself on each new query. You no longer need to specify this option. Use maximumNumberOfResultsFromIndex instead.'
    }),
    /**
     * Specifies the maximum number of results that the index can return for any query.
     *
     * Default value is `1000` in a Coveo index.
     *
     * If this value was modified in your Coveo index, you must specify the new value in this option for the Pager component to work properly
     */
    maximumNumberOfResultsFromIndex: ComponentOptions.buildNumberOption({
      defaultValue: 1000
    })
  };

  /**
   * The current page (1-based index).
   */
  public currentPage: number;
  private lastNumberOfResultsPerPage: number;
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
   * Creates a new Pager. Binds multiple query events ({@link QueryEvents.newQuery}, {@link QueryEvents.buildingQuery},
   * {@link QueryEvents.querySuccess}, {@link QueryEvents.queryError} and {@link QueryEvents.noResults}. Renders itself
   * on every query success.
   * @param element The HTMLElement on which to instantiate the component (normally a `div`).
   * @param options The options for the Pager component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IPagerOptions, bindings?: IComponentBindings) {
    super(element, Pager.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Pager, options);
    this.currentPage = 1;

    this.bind.onRootElement(QueryEvents.newQuery, (args: INewQueryEventArgs) => this.handleNewQuery(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, () => this.handleQueryError());
    this.bind.onRootElement(QueryEvents.noResults, (args: INoResultsEventArgs) => this.handleNoResults(args));
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.FIRST, (data: IAttributeChangedEventArg) =>
      this.handleQueryStateModelChanged(data)
    );

    this.list = document.createElement('ul');
    $$(this.list).addClass('coveo-pager-list');
    element.appendChild(this.list);
  }

  /**
   * Sets the current page, then executes a query.
   *
   * Also logs an event in the usage analytics (`pageNumber` by default) with the new current page number as meta data.
   *
   * @param pageNumber The page number to navigate to.
   * @param analyticCause The event to log in the usage analytics.
   */
  public setPage(pageNumber: number, analyticCause: IAnalyticsActionCause = analyticsActionCauseList.pagerNumber) {
    Assert.exists(pageNumber);
    this.currentPage = Math.max(Math.min(pageNumber, this.getMaxNumberOfPagesForCurrentResultsPerPage()), 1);
    this.updateQueryStateModel(this.getFirstResultNumber(this.currentPage));
    this.usageAnalytics.logCustomEvent<IAnalyticsPagerMeta>(analyticCause, { pagerNumber: this.currentPage }, this.element);
    this.queryController.executeQuery({
      ignoreWarningSearchEvent: true,
      keepLastSearchUid: true,
      origin: this
    });
  }

  /**
   * Navigates to the previous page, then executes a query.
   *
   * Also logs the `pagePrevious` event in the usage analytics with the new current page number as meta data.
   */
  public previousPage() {
    this.setPage(this.currentPage - 1, analyticsActionCauseList.pagerPrevious);
  }

  /**
   * Navigates to the next page, then executes a query.
   *
   * Also logs the `pageNext` event in the usage analytics with the new current page number as meta data.
   */
  public nextPage() {
    this.setPage(this.currentPage + 1, analyticsActionCauseList.pagerNext);
  }

  private getMaxNumberOfPagesForCurrentResultsPerPage() {
    return Math.ceil(this.options.maximumNumberOfResultsFromIndex / this.getNumberOfResultsPerPage());
  }

  private handleNewQuery(data: INewQueryEventArgs) {
    const triggeredByPager = data && data.origin && data.origin.type == Pager.ID;
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

      const firstResult = data.query.firstResult;
      const count = data.results.totalCountFiltered;

      const pagerBoundary = this.computePagerBoundary(firstResult, count);
      this.currentPage = pagerBoundary.currentPage;
      if (pagerBoundary.end - pagerBoundary.start > 0) {
        for (let i = pagerBoundary.start; i <= pagerBoundary.end; i++) {
          const listItemValue = document.createElement('a');
          $$(listItemValue).addClass(['coveo-pager-list-item-text', 'coveo-pager-anchor']);
          $$(listItemValue).text(i.toString(10));

          let listItem = $$('li', { className: 'coveo-pager-list-item', tabindex: 0 }).el;
          if (i == this.currentPage) {
            $$(listItem).addClass('coveo-active');
          }

          ((pageNumber: number) => {
            let clickAction = () => this.handleClickPage(pageNumber);
            $$(listItem).on('click', clickAction);
            $$(listItem).on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, clickAction));
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
    let lastValidPage;
    if (data.results.totalCount > 0) {
      // First scenario : The index returned less results than expected (because of folding).
      // Recalculate the last valid page, and change to that new page.
      const possibleValidPage = this.computePagerBoundary(data.results.totalCountFiltered, data.results.totalCount).lastResultPage;
      if (this.currentPage > possibleValidPage) {
        lastValidPage = possibleValidPage;
      }
    } else if (this.currentPage > this.getMaxNumberOfPagesForCurrentResultsPerPage()) {
      // Second scenario : Someone tried to access a non-valid page by the URL for example, which is  higher than the current possible with the number of
      // possible results. The last valid page will be the maximum number of results avaiable from the index.
      lastValidPage = this.getMaxNumberOfPagesForCurrentResultsPerPage();
    }

    // This needs to be deferred because we still want all the "querySuccess" callbacks the complete their execution
    // before triggering/queuing the next query;
    // if we cannot find a lastValidPage to go to, do nothing : this means it's a query that simply return nothing.
    if (lastValidPage != null) {
      this.currentPage = lastValidPage;
      data.retryTheQuery = true;
      this.needToReset = false;
      this.ignoreNextQuerySuccess = false;
      this.updateQueryStateModel(this.getFirstResultNumber(this.currentPage));
    }
  }

  private reset() {
    $$(this.list).empty();
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    const eventArgs = this.getQueryEventArgs();
    data.queryBuilder.firstResult = eventArgs.first;

    // Set the number of results only if it was not already set by external code
    // Most of the time this will be set by either : the SearchInterface with the resultsPerPage option
    // Or by the ResultsPerPage component (so the end user decides).
    // Pager will realistically never set this value itself.
    if (data.queryBuilder.numberOfResults == null) {
      data.queryBuilder.numberOfResults = eventArgs.count;
    }
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    // This can change on every query, for example using the ResultsPerPage component or with external code.
    this.lastNumberOfResultsPerPage = data.queryBuilder.numberOfResults;
  }

  private computePagerBoundary(
    firstResult: number,
    totalCount: number
  ): { start: number; end: number; lastResultPage: number; currentPage: number } {
    const resultPerPage: number = this.getNumberOfResultsPerPage();
    const currentPage = Math.floor(firstResult / resultPerPage) + 1;
    let lastPageNumber: number = Math.min(Math.ceil(totalCount / resultPerPage), this.getMaxNumberOfPagesForCurrentResultsPerPage());
    lastPageNumber = Math.max(lastPageNumber, 1);
    const halfLength = Math.floor(this.options.numberOfPages / 2);
    let firstPageNumber = currentPage - halfLength;
    firstPageNumber = Math.max(firstPageNumber, 1);
    let endPageNumber = firstPageNumber + this.options.numberOfPages - 1;
    endPageNumber = Math.min(endPageNumber, lastPageNumber);
    return {
      start: firstPageNumber,
      end: endPageNumber,
      lastResultPage: lastPageNumber,
      currentPage: currentPage
    };
  }

  private renderNavigationButton(
    pagerBoundary: { start: number; end: number; lastResultPage: number; currentPage: number },
    list: HTMLElement
  ) {
    if (this.currentPage > 1) {
      const previous = document.createElement('li');
      $$(previous).addClass(['coveo-pager-previous', 'coveo-pager-anchor', 'coveo-pager-list-item']);
      const buttonLink = document.createElement('a');
      const buttonIcon = $$('span', { className: 'coveo-pager-previous-icon' }, SVGIcons.icons.pagerLeftArrow).el;
      SVGDom.addClassToSVGInContainer(buttonIcon, 'coveo-pager-previous-icon-svg');
      buttonLink.appendChild(buttonIcon);
      buttonLink.setAttribute('title', l('Previous'));
      previous.appendChild(buttonLink);
      $$(previous).on('click', () => this.handleClickPrevious());
      this.list.insertBefore(previous, this.list.firstChild);
    }

    if (this.currentPage < pagerBoundary.lastResultPage) {
      const next = document.createElement('li');
      $$(next).addClass(['coveo-pager-next', 'coveo-pager-anchor', 'coveo-pager-list-item']);
      const buttonLink = document.createElement('a');
      const buttonIcon = $$('span', { className: 'coveo-pager-next-icon' }, SVGIcons.icons.pagerRightArrow).el;
      SVGDom.addClassToSVGInContainer(buttonIcon, 'coveo-pager-next-icon-svg');
      buttonLink.appendChild(buttonIcon);
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
    const firstResult = data.value;
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
    return firstResult / this.getNumberOfResultsPerPage() + 1;
  }

  private getNumberOfResultsPerPage() {
    // If there was no query successful yet, we use the query controller value as a fallback.
    // If it's 0 for some reason (someone wants no results .. ? ), then we fallback to 10 as the "standard" value.
    // This ensure that we do not divide by 0 in the pager.
    if (this.lastNumberOfResultsPerPage != null) {
      return this.lastNumberOfResultsPerPage;
    }
    return this.queryController.options.resultsPerPage == 0 ? 10 : this.queryController.options.resultsPerPage;
  }

  private getFirstResultNumber(pageNumber: number = this.currentPage): number {
    return (pageNumber - 1) * this.getNumberOfResultsPerPage();
  }

  private getQueryEventArgs() {
    return {
      count: this.getNumberOfResultsPerPage(),
      first: this.getFirstResultNumber()
    };
  }
}

Initialization.registerAutoCreateComponent(Pager);
