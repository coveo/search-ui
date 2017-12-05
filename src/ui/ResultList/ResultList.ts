import { Template } from '../Templates/Template';
import { TableTemplate } from '../Templates/TableTemplate';
import { DefaultResultTemplate } from '../Templates/DefaultResultTemplate';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IQueryResult } from '../../rest/QueryResult';
import { IQueryResults } from '../../rest/QueryResults';
import { Assert } from '../../misc/Assert';
import {
  QueryEvents,
  INewQueryEventArgs,
  IBuildingQueryEventArgs,
  IQuerySuccessEventArgs,
  IDuringQueryEventArgs,
  IQueryErrorEventArgs
} from '../../events/QueryEvents';
import { MODEL_EVENTS } from '../../models/Model';
import { QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { QueryUtils } from '../../utils/QueryUtils';
import { $$, Win, Doc } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { Initialization, IInitializationParameters, IInitResult } from '../Base/Initialization';
import { Defer } from '../../misc/Defer';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { ResultListEvents, IDisplayedNewResultEventArgs, IChangeLayoutEventArgs } from '../../events/ResultListEvents';
import { ResultLayoutEvents, IResultLayoutPopulateArgs } from '../../events/ResultLayoutEvents';
import { Utils } from '../../utils/Utils';
import { DomUtils } from '../../utils/DomUtils';
import { DefaultRecommendationTemplate } from '../Templates/DefaultRecommendationTemplate';
import { ValidLayout } from '../ResultLayout/ResultLayout';
import { TemplateList } from '../Templates/TemplateList';
import { TemplateCache } from '../Templates/TemplateCache';
import { ResponsiveDefaultResultTemplate } from '../ResponsiveComponents/ResponsiveDefaultResultTemplate';
import { ResultListRenderer } from './ResultListRenderer';
import { ResultListTableRenderer } from './ResultListTableRenderer';
import { ResultListCardRenderer } from './ResultListCardRenderer';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_ResultList';
import 'styling/_ResultFrame';
import 'styling/_Result';
import { InitializationPlaceholder } from '../Base/InitializationPlaceholder';
import { get } from '../Base/RegisteredNamedMethods';

export interface IResultListOptions {
  resultContainer?: HTMLElement;
  resultTemplate?: Template;
  resultOptions?: {};
  waitAnimationContainer?: HTMLElement;
  enableInfiniteScroll?: boolean;
  infiniteScrollPageSize?: number;
  infiniteScrollContainer?: HTMLElement | Window;
  waitAnimation?: string;
  mobileScrollContainer?: HTMLElement;
  enableInfiniteScrollWaitingAnimation?: boolean;
  fieldsToInclude?: IFieldOption[];
  autoSelectFieldsToInclude?: boolean;
  layout?: string;
}

/**
 * The `ResultList` component is responsible for displaying query results by applying one or several result templates
 * (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * It is possible to include multiple `ResultList` components along with a single [`ResultLayout`]{@link ResultLayout}
 * component in a search page to provide different result layouts (see
 * [Result Layouts](https://developers.coveo.com/x/yQUvAg)).
 *
 * This component supports infinite scrolling (see the
 * [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll} option).
 */
export class ResultList extends Component {
  private static getDefaultTemplate(e: HTMLElement): Template {
    const template = ResultList.loadTemplatesFromCache();
    if (template != null) {
      return template;
    }

    const component = <ResultList>Component.get(e);
    if (Coveo['Recommendation'] && component.searchInterface instanceof Coveo['Recommendation']) {
      return new DefaultRecommendationTemplate();
    }
    return new DefaultResultTemplate();
  }

  private static loadTemplatesFromCache(): Template {
    var pageTemplateNames = TemplateCache.getResultListTemplateNames();
    if (pageTemplateNames.length > 0) {
      return new TemplateList(_.compact(_.map(pageTemplateNames, templateName => TemplateCache.getTemplate(templateName))));
    }

    return null;
  }

  static ID = 'ResultList';

  static doExport = () => {
    exportGlobally({
      ResultList: ResultList
    });
  };

  /**
   * The options for the ResultList
   * @componentOptions
   */
  static options: IResultListOptions = {
    /**
     * Specifies the element inside which to insert the rendered result templates.
     *
     * Performing a new query clears the content of this element.
     *
     * You can change the container by specifying its selector (e.g.,
     * `data-result-container-selector='#someCssSelector'`).
     *
     * If you specify no value for this option, a `div` element will be dynamically created and appended to the result
     * list. This element will then be used as a result container.
     */
    resultContainer: ComponentOptions.buildChildHtmlElementOption(),
    resultTemplate: ComponentOptions.buildTemplateOption({ defaultFunction: ResultList.getDefaultTemplate }),

    /**
     * Specifies the type of animation to display while waiting for a query to return.
     *
     * The possible values are:
     * - `fade`: Fades out the current list of results while the query is executing.
     * - `spinner`: Shows a spinning animation while the query is executing.
     * - `none`: Use no animation during queries.
     *
     * See also the [`waitAnimationContainer`]{@link ResultList.options.waitAnimationContainer} option.
     *
     * Default value is `none`.
     */
    waitAnimation: ComponentOptions.buildStringOption({ defaultValue: 'none' }),

    /**
     * Specifies the element inside which to display the [`waitAnimation`]{@link ResultList.options.waitAnimation}.
     *
     * You can change this by specifying a CSS selector (e.g.,
     * `data-wait-animation-container-selector='#someCssSelector'`).
     *
     * Default value is the value of the [`resultContainer`]{@link ResultList.options.resultContainer} option.
     */
    waitAnimationContainer: ComponentOptions.buildChildHtmlElementOption({
      postProcessing: (value, options: IResultListOptions) => value || options.resultContainer
    }),

    /**
     * Specifies whether to automatically retrieve an additional page of results and append it to the
     * results that the `ResultList` is currently displaying when the user scrolls down to the bottom of the
     * [`infiniteScrollContainer`]{@link ResultList.options.infiniteScrollContainer}.
     *
     * See also the [`infiniteScrollPageSize`]{@link ResultList.options.infiniteScrollPageSize} and
     * [`enableInfiniteScrollWaitingAnimation`]{@link ResultList.options.enableInfiniteScrollWaitingAnimation} options.
     *
     * It is important to specify the `infiniteScrollContainer` option manually if you want the scrolling element to be
     * something else than the default `window` element. Otherwise, you might find yourself in a strange state where the
     * framework rapidly triggers multiple successive query.
     *
     * Default value is `false`.
     */
    enableInfiniteScroll: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * If the [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll} option is `true`, specifies the
     * number of additional results to fetch when the user scrolls down to the bottom of the
     * [`infiniteScrollContainer`]{@link ResultList.options.infiniteScrollContainer}.
     *
     * Default value is `10`. Minimum value is `1`.
     */
    infiniteScrollPageSize: ComponentOptions.buildNumberOption({
      defaultValue: 10,
      min: 1,
      depend: 'enableInfiniteScroll'
    }),

    /**
     * If the [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll} option is `true`, specifies the
     * element that triggers fetching additional results when the end user scrolls down to its bottom.
     *
     * You can change the container by specifying its selector (e.g.,
     * `data-infinite-scroll-container-selector='#someCssSelector'`).
     *
     * By default, the framework uses the first vertically scrollable parent element it finds, starting from the
     * `ResultList` element itself. A vertically scrollable element is an element whose CSS `overflow-y` attribute is
     * `scroll`.
     *
     * This implies that if the framework can find no scrollable parent, it uses the `window` itself as a scrollable
     * container.
     *
     * This heuristic is not perfect, for technical reasons. There are always some corner case CSS combination which the
     * framework will not be able to correctly detect as 'scrollable'.
     *
     * It is highly recommended that you manually set this option if you wish something else than the `window` to be the
     * scrollable element.
     */
    infiniteScrollContainer: ComponentOptions.buildChildHtmlElementOption({
      depend: 'enableInfiniteScroll',
      defaultFunction: element => ComponentOptions.findParentScrolling(element)
    }),

    /**
     * If the [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll} option is `true`, specifies
     * whether to display the [`waitingAnimation`]{@link ResultList.options.waitAnimation} while fetching additional
     * results.
     *
     * Default value is `true`.
     */
    enableInfiniteScrollWaitingAnimation: ComponentOptions.buildBooleanOption({
      depend: 'enableInfiniteScroll',
      defaultValue: true
    }),
    mobileScrollContainer: ComponentOptions.buildSelectorOption({
      defaultFunction: () => <HTMLElement>document.querySelector('.coveo-results-column')
    }),

    /**
     * Specifies whether the `ResultList` should scan its result templates to discover which fields it must request to
     * be able to render all results.
     *
     * Setting this option to `true` ensures that the Coveo Search API does not return fields that are unnecessary for
     * the UI to function.
     *
     * Default value is `false`, which means that for each result, the Coveo Search API returns all available fields
     * (unless you specify a list of values in the [`fieldsToInclude`]{@link ResultList.options.fieldsToInclude} option,
     * in which case the Coveo Search API only returns those fields, if they are available).
     *
     * **Notes:**
     * > * Many interfaces created with the JavaScript Search Interface Editor explicitly set this option to `true`.
     * > * You cannot set this option to `true` in the Coveo for Sitecore integration.
     */
    autoSelectFieldsToInclude: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies a list of fields to include in the query results.
     *
     * If you set the [`autoSelectFieldsToInclude`]{@link ResultList.options.autoSelectFieldsToInclude} option to
     * `true`, the Coveo Search API returns the fields you specify for this option (if those fields are available) in
     * addition to the fields which the `ResultList` automatically requests.
     *
     * Otherwise, the Coveo Search API only returns the fields you specify for this option (if those fields are
     * available), unless you leave this option undefined, in which case the Coveo Search API returns all available
     * fields.
     */
    fieldsToInclude: ComponentOptions.buildFieldsOption({ includeInResults: true }),

    /**
     * Specifies the layout to use when displaying results in this `ResultList` (see
     * [Result Layouts](https://developers.coveo.com/x/yQUvAg)). Specifying a value for this option automatically
     * populates a [`ResultLayout`]{@link ResultLayout} component with a switcher for the layout.
     *
     * For example, if there are two `ResultList` components in the page, one with its `layout` set to `list` and the
     * other with the same option set to `card`, then the `ResultLayout` component will render two buttons respectively
     * entitled **List** and **Card**.
     *
     * See the [`ValidLayout`]{@link ValidLayout} type for the list of possible values.
     *
     * Default value is `list`.
     */
    layout: ComponentOptions.buildStringOption({
      defaultValue: 'list',
      required: true
    })
  };

  public static resultCurrentlyBeingRendered: IQueryResult = null;
  public currentlyDisplayedResults: IQueryResult[] = [];
  private fetchingMoreResults: Promise<IQueryResults>;
  private reachedTheEndOfResults = false;

  private renderer: ResultListRenderer;

  // This variable serves to block some setup where the framework fails to correctly identify the "real" scrolling container.
  // Since it's not technically feasible to correctly identify the scrolling container in every possible scenario without some very complex logic, we instead try to add some kind of mechanism to
  // block runaway requests where UI will keep asking more results in the index, eventually bringing the browser to it's knee.
  // Those successive request are needed in "displayMoreResults" to ensure we fill the scrolling container correctly.
  // Since the container is not identified correctly, it is never "full", so we keep asking for more.
  // It is reset every time the user actually scroll the container manually.
  private successiveScrollCount = 0;
  private static MAX_AMOUNT_OF_SUCESSIVE_REQUESTS = 5;

  /**
   * Creates a new `ResultList` component. Binds various event related to queries (e.g., on querySuccess ->
   * renderResults). Binds scroll event if the [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll}
   * option is `true`.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `ResultList` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param elementClassId The class that this component should instantiate. Components that extend the base ResultList
   * use this. Default value is `CoveoResultList`.
   */
  constructor(
    public element: HTMLElement,
    public options?: IResultListOptions,
    public bindings?: IComponentBindings,
    elementClassId: string = ResultList.ID
  ) {
    super(element, elementClassId, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultList, options);

    Assert.exists(element);
    Assert.exists(this.options);
    Assert.exists(this.options.resultTemplate);
    Assert.exists(this.options.infiniteScrollContainer);

    this.showOrHideElementsDependingOnState(false, false);

    this.bind.onRootElement<INewQueryEventArgs>(QueryEvents.newQuery, (args: INewQueryEventArgs) => this.handleNewQuery());
    this.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) =>
      this.handleBuildingQuery(args)
    );
    this.bind.onRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) =>
      this.handleQuerySuccess(args)
    );
    this.bind.onRootElement<IDuringQueryEventArgs>(QueryEvents.duringQuery, (args: IDuringQueryEventArgs) => this.handleDuringQuery());
    this.bind.onRootElement<IQueryErrorEventArgs>(QueryEvents.queryError, (args: IQueryErrorEventArgs) => this.handleQueryError());
    $$(this.root).on(ResultListEvents.changeLayout, (e: Event, args: IChangeLayoutEventArgs) => this.handleChangeLayout(args));

    if (this.options.enableInfiniteScroll) {
      this.handlePageChanged();
      this.bind.on(<HTMLElement>this.options.infiniteScrollContainer, 'scroll', (e: Event) => {
        this.successiveScrollCount = 0;
        this.handleScrollOfResultList();
      });
    }
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.FIRST, () => this.handlePageChanged());

    this.initResultContainer();
    Assert.exists(this.options.resultContainer);

    this.initWaitAnimationContainer();
    Assert.exists(this.options.waitAnimationContainer);

    this.setupTemplatesVersusLayouts();
    $$(this.root).on(ResultLayoutEvents.populateResultLayout, (e, args: IResultLayoutPopulateArgs) =>
      args.layouts.push(this.options.layout)
    );
    this.setupRenderer();
  }

  /**
   * Get the fields needed to be automatically included in the query for this result list.
   * @returns {string[]}
   */
  public getAutoSelectedFieldsToInclude(): string[] {
    return _.chain(this.options.resultTemplate.getFields())
      .concat(this.getMinimalFieldsToInclude())
      .compact()
      .unique()
      .value();
  }

  private setupTemplatesVersusLayouts() {
    const layoutClassToAdd = `coveo-${this.options.layout}-layout-container`;
    $$(this.options.resultContainer).addClass(layoutClassToAdd);

    if (this.options.layout === 'table') {
      this.options.resultTemplate = new TableTemplate((<TemplateList>this.options.resultTemplate).templates || []);
    }

    // A TemplateList is the scenario where the result template are directly embedded inside the ResultList
    // This is the typical scenario when a page gets created by the interface editor, for example.
    // In that case, we try to stick closely that what is actually configured inside the page, and do no "special magic".
    // Stick to the "hardcoded" configuration present in the page.
    // We only add the correct layout options if it has not been set manually.
    if (this.options.resultTemplate instanceof TemplateList) {
      _.each((<TemplateList>this.options.resultTemplate).templates, (tmpl: Template) => {
        if (!tmpl.layout) {
          tmpl.layout = <ValidLayout>this.options.layout;
        }
      });
    } else if (this.options.resultTemplate instanceof DefaultResultTemplate && this.options.layout == 'list') {
      ResponsiveDefaultResultTemplate.init(this.root, this, {});
    }
  }

  /**
   * Empties the current result list content and appends the given array of HTMLElement.
   *
   * Can append to existing elements in the result list, or replace them.
   *
   * Triggers the `newResultsDisplayed` and `newResultDisplayed` events.
   * @param resultsElement
   * @param append
   */
  public renderResults(resultElements: HTMLElement[], append = false): Promise<void> {
    if (!append) {
      this.options.resultContainer.innerHTML = '';
    }

    return this.renderer
      .renderResults(resultElements, append, this.triggerNewResultDisplayed.bind(this))
      .then(() => this.triggerNewResultsDisplayed());
  }

  /**
   * Builds and returns an array of HTMLElement with the given result set.
   * @param results the result set to build an array of HTMLElement from.
   */
  public buildResults(results: IQueryResults): Promise<HTMLElement[]> {
    const res: { elem: HTMLElement; idx: number }[] = [];
    const resultsPromises = _.map(results.results, (result: IQueryResult, index: number) => {
      return this.buildResult(result).then((resultElement: HTMLElement) => {
        if (resultElement != null) {
          res.push({ elem: resultElement, idx: index });
        }
        ResultList.resultCurrentlyBeingRendered = null;
        return resultElement;
      });
    });

    // We need to sort by the original index order, because in lazy loading mode, it's possible that results does not gets rendered
    // in the correct order returned by the index, depending on the time it takes to load all the results component for a given result template
    return Promise.all(resultsPromises).then(() => {
      return _.pluck(_.sortBy(res, 'idx'), 'elem');
    });
  }

  /**
   * Builds and returns an HTMLElement for the given result.
   * @param result the result to build an HTMLElement from.
   * @returns {HTMLElement}
   */
  public buildResult(result: IQueryResult): Promise<HTMLElement> {
    Assert.exists(result);
    QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), result);
    QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, result);
    ResultList.resultCurrentlyBeingRendered = result;
    return this.options.resultTemplate
      .instantiateToElement(result, {
        wrapInDiv: true,
        checkCondition: true,
        currentLayout: <ValidLayout>this.options.layout,
        responsiveComponents: this.searchInterface.responsiveComponents
      })
      .then((resultElement: HTMLElement) => {
        if (resultElement != null) {
          Component.bindResultToElement(resultElement, result);
        }
        this.currentlyDisplayedResults.push(result);
        return this.autoCreateComponentsInsideResult(resultElement, result).initResult.then(() => {
          return resultElement;
        });
      });
  }

  /**
   * Executes a query to fetch new results. After the query returns, renders the new results.
   *
   * Asserts that there are more results to display by verifying whether the last query has returned as many results as
   * requested.
   *
   * Asserts that the `ResultList` is not currently fetching results.
   * @param count The number of results to fetch and display.
   */
  public displayMoreResults(count: number) {
    Assert.isLargerOrEqualsThan(1, count);

    if (this.isCurrentlyFetchingMoreResults()) {
      this.logger.warn("Ignoring request to display more results since we're already doing so");
      return;
    }
    if (!this.hasPotentiallyMoreResultsToDisplay()) {
      this.logger.warn("Ignoring request to display more results since we know there aren't more to display");
      return;
    }

    if (this.options.enableInfiniteScrollWaitingAnimation) {
      this.showWaitingAnimationForInfiniteScrolling();
    }

    this.fetchingMoreResults = this.queryController.fetchMore(count);
    this.fetchingMoreResults.then((data: IQueryResults) => {
      Assert.exists(data);
      this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.pagerScrolling, {}, this.element);
      const results = data.results;
      this.reachedTheEndOfResults = count > data.results.length;
      this.buildResults(data).then((elements: HTMLElement[]) => {
        this.renderResults(elements, true);
        _.each(results, result => {
          this.currentlyDisplayedResults.push(result);
        });
        this.triggerNewResultsDisplayed();
      });
    });

    this.fetchingMoreResults.finally(() => {
      this.hideWaitingAnimationForInfiniteScrolling();
      this.fetchingMoreResults = undefined;
      Defer.defer(() => {
        this.successiveScrollCount++;
        if (this.successiveScrollCount <= ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS) {
          this.handleScrollOfResultList();
        } else {
          this.logger.info(
            `Result list has triggered 5 consecutive queries to try and fill up the scrolling container, but it is still unable to do so`
          );
          this.logger.info(
            `Try explicitly setting the 'data-infinite-scroll-container-selector' option on the result list. See : https://coveo.github.io/search-ui/components/resultlist.html#options.infinitescrollcontainer`
          );
        }
      });
    });

    return this.fetchingMoreResults;
  }

  /**
   * Gets the list of currently displayed result.
   * @returns {IQueryResult[]}
   */
  public getDisplayedResults(): IQueryResult[] {
    return this.currentlyDisplayedResults;
  }

  /**
   * Gets the list of currently displayed result HTMLElement.
   * @returns {HTMLElement[]}
   */
  public getDisplayedResultsElements(): HTMLElement[] {
    return $$(this.options.resultContainer).findAll('.CoveoResult');
  }

  public enable(): void {
    super.enable();
    $$(this.element).removeClass('coveo-hidden');
  }
  public disable(): void {
    super.disable();
    $$(this.element).addClass('coveo-hidden');
  }

  protected autoCreateComponentsInsideResult(element: HTMLElement, result: IQueryResult): IInitResult {
    Assert.exists(element);

    const initOptions = this.searchInterface.options.originalOptionsObject;
    const resultComponentBindings: IResultsComponentBindings = _.extend({}, this.getBindings(), {
      resultElement: element
    });
    const initParameters: IInitializationParameters = {
      options: initOptions,
      bindings: resultComponentBindings,
      result: result
    };
    return Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  protected triggerNewResultDisplayed(result: IQueryResult, resultElement: HTMLElement) {
    const args: IDisplayedNewResultEventArgs = {
      result: result,
      item: resultElement
    };
    $$(this.element).trigger(ResultListEvents.newResultDisplayed, args);
  }

  protected triggerNewResultsDisplayed() {
    $$(this.element).trigger(ResultListEvents.newResultsDisplayed, {});
  }

  private handleDuringQuery() {
    this.logger.trace('Emptying the result container');
    this.cancelFetchingMoreResultsIfNeeded();
    this.showWaitingAnimation();
    this.showOrHideElementsDependingOnState(false, false);
  }

  private handleQueryError() {
    this.hideWaitingAnimation();
    $$(this.options.resultContainer).empty();
    this.currentlyDisplayedResults = [];
    this.reachedTheEndOfResults = true;
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    Assert.exists(data);
    Assert.exists(data.results);
    const results = data.results;
    this.logger.trace('Received query results from new query', results);
    this.hideWaitingAnimation();

    ResultList.resultCurrentlyBeingRendered = undefined;
    this.reachedTheEndOfResults = data.query.numberOfResults > data.results.results.length;

    this.currentlyDisplayedResults = [];
    this.buildResults(data.results).then((elements: HTMLElement[]) => {
      this.renderResults(elements);

      this.showOrHideElementsDependingOnState(true, this.currentlyDisplayedResults.length != 0);

      if (DeviceUtils.isMobileDevice() && this.options.mobileScrollContainer != undefined) {
        this.options.mobileScrollContainer.scrollTop = 0;
      }

      if (this.options.enableInfiniteScroll && results.results.length == data.queryBuilder.numberOfResults) {
        // This will check right away if we need to add more results to make the scroll container full & scrolling.
        this.scrollBackToTop();
        this.handleScrollOfResultList();
      }
    });
  }

  private handleScrollOfResultList() {
    if (this.isCurrentlyFetchingMoreResults() || !this.options.enableInfiniteScroll) {
      return;
    }
    if (this.isScrollingOfResultListAlmostAtTheBottom() && this.hasPotentiallyMoreResultsToDisplay()) {
      this.displayMoreResults(this.options.infiniteScrollPageSize);
    }
  }

  private handlePageChanged() {
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, () => {
      setTimeout(() => {
        this.scrollBackToTop();
      }, 0);
    });
  }

  private scrollBackToTop() {
    if (this.options.infiniteScrollContainer instanceof Window) {
      const win = <Window>this.options.infiniteScrollContainer;
      win.scrollTo(0, 0);
    } else {
      const el = <HTMLElement>this.options.infiniteScrollContainer;
      el.scrollTop = 0;
    }
  }

  private handleNewQuery() {
    $$(this.element).removeClass('coveo-hidden');
    ResultList.resultCurrentlyBeingRendered = undefined;
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    if (this.options.fieldsToInclude != null) {
      // remove the @
      args.queryBuilder.addFieldsToInclude(_.map(this.options.fieldsToInclude, field => field.substr(1)));
    }
    if (this.options.autoSelectFieldsToInclude) {
      const otherResultListsElements = _.reject(
        $$(this.root).findAll(`.${Component.computeCssClassName(ResultList)}`),
        resultListElement => resultListElement == this.element
      );
      const otherFields = _.flatten(
        _.map(otherResultListsElements, otherResultListElement => {
          const otherResultListInstance = <ResultList>get(otherResultListElement);
          if (otherResultListInstance) {
            return otherResultListInstance.getAutoSelectedFieldsToInclude();
          } else {
            return [];
          }
        })
      );

      args.queryBuilder.addRequiredFields(_.unique(otherFields.concat(this.getAutoSelectedFieldsToInclude())));
      args.queryBuilder.includeRequiredFields = true;
    }
  }

  private handleChangeLayout(args: IChangeLayoutEventArgs) {
    if (args.layout === this.options.layout) {
      this.enable();
      this.options.resultTemplate.layout = <ValidLayout>this.options.layout;
      if (args.results) {
        // Prevent flickering when switching to a new layout that is empty
        // add a temporary placeholder, the same that is used on initialization
        if (this.options.resultContainer.innerHTML == '') {
          new InitializationPlaceholder(this.root).withVisibleRootElement().withPlaceholderForResultList();
        }
        Defer.defer(() => {
          this.buildResults(args.results).then((elements: HTMLElement[]) => {
            this.renderResults(elements);
          });
        });
      }
    } else {
      this.disable();
    }
  }

  private isCurrentlyFetchingMoreResults(): boolean {
    return Utils.exists(this.fetchingMoreResults);
  }

  private getMinimalFieldsToInclude() {
    // these fields are needed for analytics click event
    return ['author', 'language', 'urihash', 'objecttype', 'collection', 'source', 'language', 'permanentid'];
  }

  private isScrollingOfResultListAlmostAtTheBottom(): boolean {
    // this is in a try catch because the unit test fail otherwise (Window does not exist for phantom js in the console)
    let isWindow;
    try {
      isWindow = this.options.infiniteScrollContainer instanceof Window;
    } catch (e) {
      isWindow = false;
    }
    return isWindow ? this.isScrollAtBottomForWindowElement() : this.isScrollAtBottomForHtmlElement();
  }

  private isScrollAtBottomForWindowElement() {
    const win = new Win(window);
    const windowHeight = win.height();
    const scrollTop = win.scrollY();
    const bodyHeight = new Doc(document).height();
    return bodyHeight - (windowHeight + scrollTop) < windowHeight / 2;
  }

  private isScrollAtBottomForHtmlElement() {
    const el = <HTMLElement>this.options.infiniteScrollContainer;
    const elementHeight = el.clientHeight;
    const scrollHeight = el.scrollHeight;
    const bottomPosition = el.scrollTop + elementHeight;
    return scrollHeight - bottomPosition < elementHeight / 2;
  }

  public hasPotentiallyMoreResultsToDisplay(): boolean {
    return this.currentlyDisplayedResults.length > 0 && !this.reachedTheEndOfResults;
  }

  private cancelFetchingMoreResultsIfNeeded() {
    if (this.isCurrentlyFetchingMoreResults()) {
      this.logger.trace('Cancelling fetching more results');
      Promise.reject(this.fetchingMoreResults);
      this.fetchingMoreResults = undefined;
    }
  }

  private showOrHideElementsDependingOnState(hasQuery: boolean, hasResults: boolean) {
    const showIfQuery = $$(this.element).findAll('.coveo-show-if-query');
    const showIfNoQuery = $$(this.element).findAll('.coveo-show-if-no-query');
    const showIfResults = $$(this.element).findAll('.coveo-show-if-results');
    const showIfNoResults = $$(this.element).findAll('.coveo-show-if-no-results');

    _.each(showIfQuery, (s: HTMLElement) => {
      $$(s).toggle(hasQuery);
    });
    _.each(showIfNoQuery, (s: HTMLElement) => {
      $$(s).toggle(!hasQuery);
    });
    _.each(showIfResults, (s: HTMLElement) => {
      $$(s).toggle(hasQuery && hasResults);
    });
    _.each(showIfNoResults, (s: HTMLElement) => {
      $$(s).toggle(hasQuery && !hasResults);
    });
  }

  private showWaitingAnimation() {
    switch (this.options.waitAnimation.toLowerCase()) {
      case 'fade':
        $$(this.options.waitAnimationContainer).addClass('coveo-fade-out');
        break;
      case 'spinner':
        _.each(this.options.resultContainer.children, (child: HTMLElement) => {
          $$(child).hide();
        });
        if ($$(this.options.waitAnimationContainer).find('.coveo-wait-animation') == undefined) {
          this.options.waitAnimationContainer.appendChild(DomUtils.getBasicLoadingAnimation());
        }
        break;
    }
  }

  private hideWaitingAnimation() {
    switch (this.options.waitAnimation.toLowerCase()) {
      case 'fade':
        $$(this.options.waitAnimationContainer).removeClass('coveo-fade-out');
        break;
      case 'spinner':
        const spinner = $$(this.options.waitAnimationContainer).find('.coveo-loading-spinner');
        if (spinner) {
          $$(spinner).detach();
        }
        break;
    }
  }

  private showWaitingAnimationForInfiniteScrolling() {
    const spinner = DomUtils.getLoadingSpinner();
    if (this.options.layout == 'card' && this.options.enableInfiniteScroll) {
      const previousSpinnerContainer = $$(this.options.waitAnimationContainer).findAll('.coveo-loading-spinner-container');
      _.each(previousSpinnerContainer, previousSpinner => $$(previousSpinner).remove());
      const spinnerContainer = $$('div', {
        className: 'coveo-loading-spinner-container'
      });
      spinnerContainer.append(spinner);
      this.options.waitAnimationContainer.appendChild(spinnerContainer.el);
    } else {
      this.options.waitAnimationContainer.appendChild(DomUtils.getLoadingSpinner());
    }
  }

  private hideWaitingAnimationForInfiniteScrolling() {
    const spinners = $$(this.options.waitAnimationContainer).findAll('.coveo-loading-spinner');
    const containers = $$(this.options.waitAnimationContainer).findAll('.coveo-loading-spinner-container');
    _.each(spinners, spinner => $$(spinner).remove());
    _.each(containers, container => $$(container).remove());
  }

  private initResultContainer() {
    if (!this.options.resultContainer) {
      const elemType = this.options.layout === 'table' ? 'table' : 'div';
      this.options.resultContainer = $$(elemType, { className: 'coveo-result-list-container' }).el;
      this.element.appendChild(this.options.resultContainer);
    }
  }

  private initWaitAnimationContainer() {
    if (!this.options.waitAnimationContainer) {
      this.options.waitAnimationContainer = this.options.resultContainer;
    }
  }

  private setupRenderer() {
    const autoCreateComponentsFn = this.autoCreateComponentsInsideResult.bind(this);
    switch (this.options.layout) {
      case 'card':
        this.renderer = new ResultListCardRenderer(this.options, autoCreateComponentsFn);
        break;
      case 'table':
        this.renderer = new ResultListTableRenderer(this.options, autoCreateComponentsFn);
        break;
      case 'list':
      default:
        this.renderer = new ResultListRenderer(this.options, autoCreateComponentsFn);
        break;
    }
  }
}

Initialization.registerAutoCreateComponent(ResultList);
