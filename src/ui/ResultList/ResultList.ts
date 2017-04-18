import { Template } from '../Templates/Template';
import { DefaultResultTemplate } from '../Templates/DefaultResultTemplate';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IQueryResult } from '../../rest/QueryResult';
import { IQueryResults } from '../../rest/QueryResults';
import { Assert } from '../../misc/Assert';
import { QueryEvents, INewQueryEventArgs, IBuildingQueryEventArgs, IQuerySuccessEventArgs, IDuringQueryEventArgs, IQueryErrorEventArgs } from '../../events/QueryEvents';
import { MODEL_EVENTS } from '../../models/Model';
import { QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { QueryUtils } from '../../utils/QueryUtils';
import { $$, Win, Doc } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { Initialization, IInitializationParameters } from '../Base/Initialization';
import { Defer } from '../../misc/Defer';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { ResultListEvents, IDisplayedNewResultEventArgs, IChangeLayoutEventArgs } from '../../events/ResultListEvents';
import { ResultLayoutEvents } from '../../events/ResultLayoutEvents';
import { Utils } from '../../utils/Utils';
import { DomUtils } from '../../utils/DomUtils';
import { Recommendation } from '../Recommendation/Recommendation';
import { DefaultRecommendationTemplate } from '../Templates/DefaultRecommendationTemplate';
import { ValidLayout } from '../ResultLayout/ResultLayout';
import { TemplateList } from '../Templates/TemplateList';
import { TemplateCache } from '../Templates/TemplateCache';
import { ResponsiveDefaultResultTemplate } from '../ResponsiveComponents/ResponsiveDefaultResultTemplate';
import _ = require('underscore');
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
 * The ResultList component is responsible for displaying the results of the current query using one or more result
 * templates (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * This component supports many additional features, such as infinite scrolling.
 */
export class ResultList extends Component {

  private static getDefaultTemplate(e: HTMLElement): Template {
    const template = ResultList.loadTemplatesFromCache();
    if (template != null) {
      return template;
    }

    let component = <ResultList>Component.get(e);
    if (component.searchInterface instanceof Recommendation) {
      return new DefaultRecommendationTemplate();
    }
    return new DefaultResultTemplate();
  }

  private static loadTemplatesFromCache(): Template {
    var pageTemplateNames = TemplateCache.getResultListTemplateNames();
    if (pageTemplateNames.length > 0) {
      return new TemplateList(_.compact(_.map(pageTemplateNames, (templateName) => TemplateCache.getTemplate(templateName))));
    }

    return null;
  }

  static ID = 'ResultList';
  /**
   * The options for the ResultList
   * @componentOptions
   */
  static options: IResultListOptions = {

    /**
     * Specifies the element within which to insert the rendered templates for results.
     *
     * Performing a new query clears the content of this element.
     *
     * You can change the container by specifying its selector (e.g.,
     * `data-result-container-selector='#someCssSelector'`).
     *
     * If you specify no value for this option, a `div` element will be dynamically created and appended to the result
     * list. This element will then be used as a result container.
     */
    resultContainer: ComponentOptions.buildChildHtmlElementOption({
      defaultFunction: (element: HTMLElement) => {
        let d = document.createElement('div');
        element.appendChild(d);
        return d;
      }
    }),
    resultTemplate: ComponentOptions.buildTemplateOption({ defaultFunction: ResultList.getDefaultTemplate }),

    /**
     * Specifies the type of animation to display while waiting for a query to return.
     *
     * The possible values are:
     * - `fade`: Fades out the current list of results while the query is executing.
     * - `spinner`: Shows a spinning animation while the query is executing.
     * - `none`: Use no animation during queries.
     *
     * See also {@link ResultList.options.waitAnimationContainer}.
     *
     * Default value is `none`.
     */
    waitAnimation: ComponentOptions.buildStringOption({ defaultValue: 'none' }),

    /**
     * Specifies the element inside which to display the {@link ResultList.options.waitAnimation}.
     *
     * You can change this by specifying a CSS selector (e.g.,
     * `data-wait-animation-container-selector='#someCssSelector'`).
     *
     * Default value is the value of {@link ResultList.options.resultContainer}.
     */
    waitAnimationContainer: ComponentOptions.buildChildHtmlElementOption({ postProcessing: (value, options: IResultListOptions) => value || options.resultContainer }),

    /**
     * Specifies whether to automatically retrieve an additional page of results and append it to the
     * results that the ResultList is currently displaying when the user scrolls down to the bottom of the infinite
     * scroll container.
     *
     * See also {@link ResultList.options.infiniteScrollPageSize}, {@link ResultList.options.infiniteScrollContainer}
     * and {@link ResultList.options.enableInfiniteScrollWaitingAnimation}.
     *
     * It is important to specify the {@link ResultList.options.infiniteScrollContainer} manually if you want the scrolling
     * element to be something else than the default `window` element.
     * Otherwise, you might get in a weird state where the framework will rapidly trigger multiple successive query.
     *
     * Default value is `false`.
     */
    enableInfiniteScroll: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * If {@link ResultList.options.enableInfiniteScroll} is `true`, specifies the number of additional results to fetch
     * when the user scrolls down to the bottom of the {@link ResultList.options.infiniteScrollContainer}.
     *
     * Default value is `10`. Minimum value is `1`.
     */
    infiniteScrollPageSize: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableInfiniteScroll' }),

    /**
     * If {@link ResultList.options.enableInfiniteScroll} is `true`, specifies the element that triggers the fetching of
     * additional results when the end user scrolls down to its bottom.
     *
     * You can change the container by specifying its selector (e.g.,
     * `data-infinite-scroll-container-selector='#someCssSelector'`).
     *
     * By default, the framework uses the first vertically scrollable parent element it finds, starting from the
     * ResultList element itself. A vertically scrollable element is an element whose CSS `overflow-y` attribute is
     * `scroll`.
     *
     * This implies that if the framework can find no scrollable parent, it uses the window itself as a scrollable
     * container.
     *
     * This heuristic is not perfect, for technical reasons. There are always some corner case CSS combination which the framework will
     * not be able to detect correctly as 'scrollable'.
     *
     * It is highly recommended that you manually set this option if you wish to have something else than `window` be the scrollable element.
     */
    infiniteScrollContainer: ComponentOptions.buildChildHtmlElementOption({ depend: 'enableInfiniteScroll', defaultFunction: (element) => ComponentOptions.findParentScrolling(element) }),

    /**
     * If {@link ResultList.options.enableInfiniteScroll} is `true`, specifies whether to display the
     * {@link ResultList.options.waitAnimation} while fetching additional results.
     *
     * Default value is `true`.
     */
    enableInfiniteScrollWaitingAnimation: ComponentOptions.buildBooleanOption({ depend: 'enableInfiniteScroll', defaultValue: true }),
    mobileScrollContainer: ComponentOptions.buildSelectorOption({ defaultFunction: () => <HTMLElement>document.querySelector('.coveo-results-column') }),

    /**
     * Specifies a list of fields to include in the query.
     *
     * Specifying a list of values for this option ensures that the Search API does not send fields that are unnecessary
     * for the UI to function.
     *
     * See also {@link ResultList.options.autoSelectFieldsToInclude}.
     *
     * Default value is `undefined`.
     */
    fieldsToInclude: ComponentOptions.buildFieldsOption({ includeInResults: true }),

    /**
     * Specifies whether the ResultList should scan its template and discover which fields it needs to render all
     * results.
     *
     * Setting this option to `true` ensures that the Search API does not send fields that are unnecessary for the UI to
     * function.
     *
     * See also {@link ResultList.options.fieldsToInclude}.
     *
     * Default value is `false`.
     *
     * **Note:**
     * > Many interfaces created with the Interface Editor explicitly set this option to `true`.
     */
    autoSelectFieldsToInclude: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the layout to use for displaying the results within this ResultList. Specifying a value for this option
     * automatically populates a {@link ResultLayout} component with a switcher for the layout.
     *
     * For example, if there are two {@link ResultList} components in the page, one with its
     * {@link ResultList.options.layout} set to `list` and the other with the same option set to `card`, then the
     * ResultLayout component will render two buttons respectively titled **List** and **Card**.
     *
     * See the {@link ValidLayout} type for the list of possible values.
     *
     * Default value is `list`.
     */
    layout: ComponentOptions.buildStringOption({
      defaultValue: 'list',
      required: true,
    })
  };

  public static resultCurrentlyBeingRendered: IQueryResult = null;
  public currentlyDisplayedResults: IQueryResult[] = [];
  private fetchingMoreResults: Promise<IQueryResults>;
  private reachedTheEndOfResults = false;

  // This variable serves to block some setup where the framework fails to correctly identify the "real" scrolling container.
  // Since it's not technically feasible to correctly identify the scrolling container in every possible scenario without some very complex logic, we instead try to add some kind of mechanism to
  // block runaway requests where UI will keep asking more results in the index, eventually bringing the browser to it's knee.
  // Those successive request are needed in "displayMoreResults" to ensure we fill the scrolling container correctly.
  // Since the container is not identified correctly, it is never "full", so we keep asking for more.
  // It is reset every time the user actually scroll the container manually.
  private successiveScrollCount = 0;
  private static MAX_AMOUNT_OF_SUCESSIVE_REQUESTS = 5;

  /**
   * Creates a new ResultList component. Binds various event related to queries (e.g., on querySuccess ->
   * renderResults). Binds scroll event if {@link ResultList.options.enableInfiniteScroll} is `true`.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ResultList component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param elementClassId The class that this component should instantiate. Components that extend the base ResultList
   * use this. Default value is `CoveoResultList`.
   */
  constructor(public element: HTMLElement, public options?: IResultListOptions, public bindings?: IComponentBindings, elementClassId: string = ResultList.ID) {
    super(element, elementClassId, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultList, options);


    Assert.exists(element);
    Assert.exists(this.options);
    Assert.exists(this.options.resultContainer);
    Assert.exists(this.options.resultTemplate);
    Assert.exists(this.options.waitAnimationContainer);
    Assert.exists(this.options.infiniteScrollContainer);

    this.showOrHideElementsDependingOnState(false, false);


    this.bind.onRootElement<INewQueryEventArgs>(QueryEvents.newQuery, (args: INewQueryEventArgs) => this.handleNewQuery());
    this.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
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

    $$(this.options.resultContainer).addClass('coveo-result-list-container');
    if (this.searchInterface.isNewDesign()) {
      this.setupTemplatesVersusLayouts();
      $$(this.root).on(ResultLayoutEvents.populateResultLayout, (e, args) => args.layouts.push(this.options.layout));
    }
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
    let layoutClassToAdd = `coveo-${this.options.layout}-layout-container`;
    $$(this.options.resultContainer).addClass(layoutClassToAdd);

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
      ResponsiveDefaultResultTemplate.init(this.root, this, this.options);
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
  public renderResults(resultsElement: HTMLElement[], append = false) {
    if (!append) {
      this.options.resultContainer.innerHTML = '';
    }
    _.each(resultsElement, (resultElement) => {
      this.options.resultContainer.appendChild(resultElement);
      this.triggerNewResultDisplayed(Component.getResult(resultElement), resultElement);
    });
    if (this.options.layout == 'card' && !this.options.enableInfiniteScroll) {
      // Used to prevent last card from spanning the grid's whole width
      _.times(3, () => this.options.resultContainer.appendChild($$('div').el));
    }
    this.triggerNewResultsDisplayed();
  }

  /**
   * Builds and returns an array of HTMLElement with the given result set.
   * @param results the result set to build an array of HTMLElement from.
   */
  public buildResults(results: IQueryResults): HTMLElement[] {
    let res: HTMLElement[] = [];
    _.each(results.results, (result: IQueryResult) => {
      let resultElement = this.buildResult(result);
      if (resultElement != null) {
        res.push(resultElement);
      }
    });
    ResultList.resultCurrentlyBeingRendered = null;
    return res;
  }

  /**
   * Builds and returns an HTMLElement for the given result.
   * @param result the result to build an HTMLElement from.
   * @returns {HTMLElement}
   */
  public buildResult(result: IQueryResult): HTMLElement {
    Assert.exists(result);
    QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), result);
    QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, result);
    ResultList.resultCurrentlyBeingRendered = result;
    let resultElement = this.options.resultTemplate.instantiateToElement(result, {
      wrapInDiv: true,
      checkCondition: true,
      currentLayout: <ValidLayout>this.options.layout,
      responsiveComponents: this.searchInterface.responsiveComponents
    });
    if (resultElement != null) {
      Component.bindResultToElement(resultElement, result);
      $$(resultElement).addClass('');
    }
    this.autoCreateComponentsInsideResult(resultElement, result);
    return resultElement;
  }

  /**
   * Executes a query to fetch new results. After the query returns, renders the new results.
   *
   * Asserts that there are more results to display by verifying whether the last query has returned as many results as
   * requested.
   *
   * Asserts that the ResultList is not currently fetching results.
   * @param count The number of results to fetch and display.
   */
  public displayMoreResults(count: number) {
    Assert.isLargerOrEqualsThan(1, count);

    if (this.isCurrentlyFetchingMoreResults()) {
      this.logger.warn('Ignoring request to display more results since we\'re already doing so');
      return;
    }
    if (!this.hasPotentiallyMoreResultsToDisplay()) {
      this.logger.warn('Ignoring request to display more results since we know there aren\'t more to display');
      return;
    }

    if (this.options.enableInfiniteScrollWaitingAnimation) {
      this.showWaitingAnimationForInfiniteScrolling();
    }

    this.fetchingMoreResults = this.queryController.fetchMore(count);
    this.fetchingMoreResults.then((data: IQueryResults) => {
      Assert.exists(data);
      this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.pagerScrolling, {}, this.element);
      let results = data.results;
      this.reachedTheEndOfResults = count > data.results.length;
      this.renderResults(this.buildResults(data), true);
      _.each(results, (result) => {
        this.currentlyDisplayedResults.push(result);
      });
      this.triggerNewResultsDisplayed();
    });

    this.fetchingMoreResults.then(() => {
      this.hideWaitingAnimationForInfiniteScrolling();
      this.fetchingMoreResults = undefined;
      Defer.defer(() => {
        this.successiveScrollCount++;
        if (this.successiveScrollCount <= ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS) {
          this.handleScrollOfResultList();
        } else {
          this.logger.info(`Result list has triggered 5 consecutive queries to try and fill up the scrolling container, but it is still unable to do so`);
          this.logger.info(`Try explicitly setting the 'data-infinite-scroll-container-selector' option on the result list. See : https://coveo.github.io/search-ui/components/resultlist.html#options.infinitescrollcontainer`);
        }
      });
    });
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

  public enable() {
    super.enable();
    $$(this.element).removeClass('coveo-hidden');
  }
  public disable() {
    super.disable();
    $$(this.element).addClass('coveo-hidden');
  }

  protected autoCreateComponentsInsideResult(element: HTMLElement, result: IQueryResult) {
    Assert.exists(element);

    let initOptions = this.searchInterface.options.originalOptionsObject;
    let resultComponentBindings: IResultsComponentBindings = _.extend({}, this.getBindings(), {
      resultElement: element
    });
    let initParameters: IInitializationParameters = {
      options: initOptions,
      bindings: resultComponentBindings,
      result: result
    };
    Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  protected triggerNewResultDisplayed(result: IQueryResult, resultElement: HTMLElement) {
    let args: IDisplayedNewResultEventArgs = {
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
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    Assert.exists(data);
    Assert.exists(data.results);
    let results = data.results;
    this.logger.trace('Received query results from new query', results);
    this.hideWaitingAnimation();
    ResultList.resultCurrentlyBeingRendered = undefined;
    this.currentlyDisplayedResults = [];
    this.renderResults(this.buildResults(data.results));
    this.currentlyDisplayedResults = results.results;
    this.reachedTheEndOfResults = false;
    this.showOrHideElementsDependingOnState(true, this.currentlyDisplayedResults.length != 0);

    if (DeviceUtils.isMobileDevice() && this.options.mobileScrollContainer != undefined) {
      this.options.mobileScrollContainer.scrollTop = 0;
    }

    if (this.options.enableInfiniteScroll && results.results.length == data.queryBuilder.numberOfResults) {
      // This will check right away if we need to add more results to make the scroll container full & scrolling.
      this.scrollBackToTop();
      this.handleScrollOfResultList();
    }
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
      let win = <Window>this.options.infiniteScrollContainer;
      win.scrollTo(0, 0);
    } else {
      let el = <HTMLElement>this.options.infiniteScrollContainer;
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
      args.queryBuilder.addFieldsToInclude(_.map(this.options.fieldsToInclude, (field) => field.substr(1)));
    }
    if (this.options.autoSelectFieldsToInclude) {
      const otherResultListsElements = _.reject($$(this.root).findAll(`.${Component.computeCssClassName(ResultList)}`), resultListElement => resultListElement == this.element);
      const otherFields = _.flatten(_.map(otherResultListsElements, (otherResultListElement) => {
        return (<ResultList>get(otherResultListElement)).getAutoSelectedFieldsToInclude();
      }));

      args.queryBuilder.addRequiredFields(_.unique(otherFields.concat(this.getAutoSelectedFieldsToInclude())));
      args.queryBuilder.includeRequiredFields = true;
    }
  }

  private handleChangeLayout(args: IChangeLayoutEventArgs) {
    if (args.layout === this.options.layout) {
      this.enable();
      this.options.resultTemplate.layout = <ValidLayout>this.options.layout;
      if (args.results) {
        Defer.defer(() => {
          this.renderResults(this.buildResults(args.results));
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
    let win = new Win(window);
    let windowHeight = win.height();
    let scrollTop = win.scrollY();
    let bodyHeight = new Doc(document).height();
    return bodyHeight - (windowHeight + scrollTop) < windowHeight / 2;
  }

  private isScrollAtBottomForHtmlElement() {
    let el = <HTMLElement>this.options.infiniteScrollContainer;
    let elementHeight = el.clientHeight;
    let scrollHeight = el.scrollHeight;
    let bottomPosition = el.scrollTop + elementHeight;
    return (scrollHeight - bottomPosition) < elementHeight / 2;
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
    let showIfQuery = $$(this.element).findAll('.coveo-show-if-query');
    let showIfNoQuery = $$(this.element).findAll('.coveo-show-if-no-query');
    let showIfResults = $$(this.element).findAll('.coveo-show-if-results');
    let showIfNoResults = $$(this.element).findAll('.coveo-show-if-no-results');

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
        let spinner = $$(this.options.waitAnimationContainer).find('.coveo-loading-spinner');
        if (spinner) {
          $$(spinner).detach();
        }
        break;
    }
  }

  private showWaitingAnimationForInfiniteScrolling() {
    let spinner = DomUtils.getLoadingSpinner();
    if (this.options.layout == 'card' && this.options.enableInfiniteScroll) {
      let spinnerContainer = $$('div', {
        className: 'coveo-loading-spinner-container'
      });
      spinnerContainer.append(spinner);
      this.options.waitAnimationContainer.appendChild(spinnerContainer.el);
    } else {
      this.options.waitAnimationContainer.appendChild(DomUtils.getLoadingSpinner());
    }

  }

  private hideWaitingAnimationForInfiniteScrolling() {
    let spinner = $$(this.options.waitAnimationContainer).find('.coveo-loading-spinner');
    if (spinner) {
      $$(spinner).detach();
    }
  }
}


Initialization.registerAutoCreateComponent(ResultList);
