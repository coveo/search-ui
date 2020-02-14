import 'styling/_Pager';
import {
  IBuildingQueryEventArgs,
  INewQueryEventArgs,
  INoResultsEventArgs,
  IQuerySuccessEventArgs,
  QueryEvents
} from '../../events/QueryEvents';
import { ResultListEvents } from '../../events/ResultListEvents';
import { exportGlobally } from '../../GlobalExports';
import { Assert } from '../../misc/Assert';
import { IAttributeChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { QueryStateModel, QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { l } from '../../strings/Strings';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { $$ } from '../../utils/Dom';
import { ResultListUtils } from '../../utils/ResultListUtils';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { analyticsActionCauseList, IAnalyticsActionCause, IAnalyticsPagerMeta } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';

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

  private listenToQueryStateChange = true;
  private ignoreNextQuerySuccess = false;

  private _currentPage: number;

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
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, () => this.handleQueryError());
    this.bind.onRootElement(QueryEvents.noResults, (args: INoResultsEventArgs) => this.handleNoResults(args));
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.FIRST, (data: IAttributeChangedEventArg) =>
      this.handleQueryStateFirstResultChanged(data)
    );
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.NUMBER_OF_RESULTS, (data: IAttributeChangedEventArg) =>
      this.handleQueryStateNumberOfResultsPerPageChanged(data)
    );
    this.addAlwaysActiveListeners();

    this.list = $$('ul', {
      className: 'coveo-pager-list',
      role: 'navigation',
      ariaLabel: l('Pagination')
    }).el;
    element.appendChild(this.list);
  }

  /**
   * The current page (1-based index).
   */
  public get currentPage(): number {
    return this._currentPage;
  }

  public set currentPage(value: number) {
    let sanitizedValue = value;

    if (isNaN(value)) {
      this.logger.warn(`Unable to set pager current page to an invalid value: ${value}. Resetting to 1.`);
      sanitizedValue = 1;
    }

    sanitizedValue = Math.max(Math.min(sanitizedValue, this.getMaxNumberOfPagesForCurrentResultsPerPage()), 1);
    sanitizedValue = Math.floor(sanitizedValue);

    this._currentPage = sanitizedValue;
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
    this.currentPage = pageNumber;
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

  private addAlwaysActiveListeners() {
    this.searchInterface.element.addEventListener(ResultListEvents.newResultsDisplayed, () =>
      ResultListUtils.hideIfInfiniteScrollEnabled(this)
    );
  }

  private getMaxNumberOfPagesForCurrentResultsPerPage() {
    return Math.ceil(this.options.maximumNumberOfResultsFromIndex / this.searchInterface.resultsPerPage);
  }

  private handleNewQuery(data: INewQueryEventArgs) {
    const triggeredByPagerOrDebugMode = data && data.origin && (data.origin.type == Pager.ID || data.origin.type == 'Debug');
    if (this.needToReset && !triggeredByPagerOrDebugMode) {
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
          const listItemValue = $$(
            'a',
            {
              className: 'coveo-pager-list-item-text coveo-pager-anchor',
              tabindex: -1,
              ariaHidden: 'true'
            },
            i.toString(10)
          ).el;

          const page = i;
          const listItem = $$('li', {
            className: 'coveo-pager-list-item',
            tabindex: 0
          }).el;
          const isCurrentPage = page === this.currentPage;
          if (isCurrentPage) {
            $$(listItem).addClass('coveo-active');
          }
          $$(listItem).setAttribute('aria-pressed', isCurrentPage.toString());

          const clickAction = () => this.handleClickPage(page);

          new AccessibleButton()
            .withElement(listItem)
            .withLabel(l('PageNumber', i.toString(10)))
            .withClickAction(clickAction)
            .withEnterKeyboardAction(clickAction)
            .build();

          listItem.appendChild(listItemValue);
          this.list.appendChild(listItem);
        }

        if (this.options.enableNavigationButton && pagerBoundary.lastResultPage > 1) {
          this.renderNavigationButton(pagerBoundary);
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

    const maxResultNumber = data.queryBuilder.firstResult + data.queryBuilder.numberOfResults;
    const numOfExcessResults = Math.max(0, maxResultNumber - this.options.maximumNumberOfResultsFromIndex);

    data.queryBuilder.numberOfResults -= numOfExcessResults;
  }

  private computePagerBoundary(firstResult: number, totalCount: number) {
    const resultPerPage = this.searchInterface.resultsPerPage;
    const currentPage = Math.floor(firstResult / resultPerPage) + 1;
    let lastPageNumber = Math.min(Math.ceil(totalCount / resultPerPage), this.getMaxNumberOfPagesForCurrentResultsPerPage());
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

  private renderNavigationButton(pagerBoundary: { start: number; end: number; lastResultPage: number; currentPage: number }) {
    if (this.currentPage > 1) {
      const previous = this.renderPreviousButton();
      this.list.insertBefore(previous.el, this.list.firstChild);
    }

    if (this.currentPage < pagerBoundary.lastResultPage) {
      const next = this.renderNextButton();
      this.list.appendChild(next.el);
    }
  }

  private renderPreviousButton() {
    const previousButton = $$('li', {
      className: 'coveo-pager-previous coveo-pager-anchor coveo-pager-list-item'
    });

    const previousLink = $$('a', {
      title: l('Previous'),
      tabindex: -1,
      ariaHidden: 'true'
    });

    const previousIcon = $$(
      'span',
      {
        className: 'coveo-pager-previous-icon'
      },
      SVGIcons.icons.pagerLeftArrow
    );

    SVGDom.addClassToSVGInContainer(previousIcon.el, 'coveo-pager-previous-icon-svg');

    previousLink.append(previousIcon.el);
    previousButton.append(previousLink.el);

    new AccessibleButton()
      .withElement(previousButton)
      .withLabel(l('Previous'))
      .withSelectAction(() => this.handleClickPrevious())
      .build();

    return previousButton;
  }

  private renderNextButton() {
    const nextButton = $$('li', {
      className: 'coveo-pager-next coveo-pager-anchor coveo-pager-list-item'
    });

    const nextLink = $$('a', {
      title: l('Next'),
      tabindex: -1,
      ariaHidden: 'true'
    });

    const nextIcon = $$(
      'span',
      {
        className: 'coveo-pager-next-icon'
      },
      SVGIcons.icons.pagerRightArrow
    );

    SVGDom.addClassToSVGInContainer(nextIcon.el, 'coveo-pager-next-icon-svg');

    nextLink.append(nextIcon.el);
    nextButton.append(nextLink.el);

    new AccessibleButton()
      .withElement(nextButton)
      .withLabel(l('Next'))
      .withSelectAction(() => this.handleClickNext())
      .build();

    return nextButton;
  }

  private handleQueryStateFirstResultChanged(data: IAttributeChangedEventArg) {
    if (!this.listenToQueryStateChange) {
      return;
    }
    Assert.exists(data);
    this.needToReset = false;
    const firstResult = data.value;
    this.currentPage = this.fromFirstResultsToPageNumber(firstResult);
  }

  private handleQueryStateNumberOfResultsPerPageChanged(data: IAttributeChangedEventArg) {
    const firstResult = this.queryStateModel.get(QUERY_STATE_ATTRIBUTES.FIRST);
    this.searchInterface.resultsPerPage = data.value;
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
    return firstResult / this.searchInterface.resultsPerPage + 1;
  }

  private getFirstResultNumber(pageNumber: number = this.currentPage): number {
    return (pageNumber - 1) * this.searchInterface.resultsPerPage;
  }

  private getQueryEventArgs() {
    return {
      count: this.searchInterface.resultsPerPage,
      first: this.getFirstResultNumber()
    };
  }
}

Initialization.registerAutoCreateComponent(Pager);
