import {Template} from '../Templates/Template';
import {DefaultResultTemplate} from '../Templates/DefaultResultTemplate';
import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings';
import {ComponentOptions, IFieldOption} from '../Base/ComponentOptions';
import {IQueryResult} from '../../rest/QueryResult';
import {IQueryResults} from '../../rest/QueryResults';
import {Assert} from '../../misc/Assert';
import {QueryEvents, INewQueryEventArgs, IBuildingQueryEventArgs, IQuerySuccessEventArgs, IDuringQueryEventArgs, IQueryErrorEventArgs} from '../../events/QueryEvents';
import {MODEL_EVENTS} from '../../models/Model';
import {QUERY_STATE_ATTRIBUTES} from '../../models/QueryStateModel';
import {QueryUtils} from '../../utils/QueryUtils';
import {$$, Win, Doc} from '../../utils/Dom';
import {analyticsActionCauseList, IAnalyticsNoMeta} from '../Analytics/AnalyticsActionListMeta';
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {Defer} from '../../misc/Defer';
import {DeviceUtils} from '../../utils/DeviceUtils';
import {ResultListEvents, IDisplayedNewResultEventArgs, IChangeLayoutEventArgs} from '../../events/ResultListEvents';
import {ResultLayoutEvents} from '../../events/ResultLayoutEvents';
import {Utils} from '../../utils/Utils';
import {DomUtils} from '../../utils/DomUtils';
import {Recommendation} from '../Recommendation/Recommendation';
import {DefaultRecommendationTemplate} from '../Templates/DefaultRecommendationTemplate';
import {ValidLayout} from '../ResultLayout/ResultLayout';

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
 * This component is responsible for displaying the results of the current query using one or more result templates.<br/>
 * It supports many additional features such as infinite scrolling.
 *
 * # Examples / samples
 * This contains some quick example. Refer to result templates on developers.coveo.com for more information.
 *
 * ```html
 * <!-- A very simple result list with a single underscore template.
 * The template has no condition : It will load for all results.
 * Every results will show the same template. -->
 *
 * <div class="CoveoResultList">
 *   <script class="result-template" type="text/underscore" id='MyDefaultTemplate'>
 *     <div>
 *       <a class='CoveoResultLink'>Hey, click on this ! <%- title %></a>
 *     </div>
 *   </script>
 * </div>
 *
 * <!-- 2 different template in the same result list : The first template has a condition attribute, the second one does not.
 *
 * The first condition will be evaluated against each result. If a result match this condition (in this case if the result.raw.objecttype property in the JSON equals MyObjectType) then the template will be rendered and the next template won't be rendered or evaluated for this result. -->
 *
 * If the result does not match the first template, the next one will be evaluated. Since the second one has no condition, it is always considered "true" and will load as a fallback.
 *
 * This process will repeat for each result that was returned by the query to the index. -->
 *
 * <div class="CoveoResultList">
 *   <script class="result-template" type="text/underscore" data-condition='raw.objecttype==MyObjectType' id='MyObjectTypeTemplate'>
 *     <div>
 *       <a class='CoveoResultLink'>Hey, click on this ! <%- title %></a>
 *       <div class='CoveoExcerpt'></div>
 *       <span>This is a result for the type : <%- raw.objecttype %></span>
 *     </div>
 *   </script>
 *
 *   <script class="result-template" type="text/underscore">
 *     <div>
 *       <a class='CoveoResultLink'>Hey, click on this ! <%- title %></a>
 *     </div>
 *   </script>
 * </div>
 *
 * <!-- 2 different template in the same result list : Both have a data-condition attribute.
 *
 * Same as before : the condition will be evaluated against all results.
 *
 * Since there is no "default" template with no condition specified, the framework will fallback on the default templates included in the framework if no template match a given result. This is to ensure that all results get rendered -->
 *
 * <div class="CoveoResultList">
 *   <script class="result-template" type="text/underscore" data-condition='raw.objecttype==MyObjectType' id='MyObjectTypeTemplate'>
 *     <div>
 *       <a class='CoveoResultLink'>Hey, click on this ! <%- title %></a>
 *       <div class='CoveoExcerpt'></div>
 *       <span>This is a result for the type : <%- raw.objecttype %></span>
 *      </div>
 *   </script>
 *
 *   <script class="result-template" type="text/underscore" data-condition='raw.objecttype==MySecondObjectType' id='MySecondObjectTypeTemplate'>
 *     <div>
 *       <span class='CoveoIcon'></span>
 *       <a class='CoveoResultLink'></a>
 *     </div>
 *     <div class='CoveoExcerpt'></div>
 *     <div class='CoveoPrintableUri'></div>
 *   </script>
 * </div>
 * ```
 */
export class ResultList extends Component {
  static ID = 'ResultList';
  /**
   * The options for the ResultList
   * @componentOptions
   */
  static options: IResultListOptions = {
    /**
     * Specifies the element within which the rendered templates for results are inserted.<br/>
     * The content of this element is cleared when a new query is performed. If this option is not specified, a &lt;div&gt; element will by dynamically created in JavaScript and appended to the result list and used as a result container.<br/>
     * You can change the container by specifying its selector: Eg  data-result-container-selector="#someCssSelector"
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
     * Specifies the type of animation to display while waiting for a new query to finish executing.<br/>
     * Possible values are :<br/>
     * 'fade' : Fades out the currently displayed results while the query is executing.<br/>
     * 'spinner' : Shows a spinning animation while the query is executing.<br/>
     * 'none' : Use no animation during queries.<br/>
     * Default value is 'none'
     */
    waitAnimation: ComponentOptions.buildStringOption({ defaultValue: 'none' }),
    /**
     * Specifies the element inside which an animation is displayed while waiting for a new query to finish executing.<br/>
     * You can change this by specifying a css selector.<br/>
     * Eg : data-wait-animation-container-selector="#someCssSelector"
     * By default, the animation appears in the the resultContainer.
     */
    waitAnimationContainer: ComponentOptions.buildChildHtmlElementOption({ postProcessing: (value, options: IResultListOptions) => value || options.resultContainer }),
    /**
     * Specifies whether the ResultList automatically retrieves an additional page of results and appends them to those already being displayed whenever the user scrolls to the end of the infiniteScrollContainer.<br/>
     * The waitAnimation will be displayed while additional results are fetched.<br/>
     * Default value is false
     */
    enableInfiniteScroll: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * When infiniteScroll is enabled, specifies the number of additional results that are fetched when the user scrolls to the bottom of the infiniteScrollContainer.<br/>
     * Default value is 10
     */
    infiniteScrollPageSize: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableInfiniteScroll' }),
    /**
     * When infinite scrolling is enabled, specifies the element whose scrolling is monitored to trigger fetching of additional results.<br/>
     * By default, the framework will try to find the first scrolling parent it encounter, starting from the ResultList itself<br/>
     * This also means that if it encounter no parent that are scrollable (in css this means having overflow-y: scroll), then the window itself will be the scroll container
     */
    infiniteScrollContainer: ComponentOptions.buildChildHtmlElementOption({ depend: 'enableInfiniteScroll', defaultFunction: (element) => ComponentOptions.findParentScrolling(element) }),
    /**
     * Specifies if the wait animation should be displayed when a query is being performed using infinite scroll.<br/>
     * Default value is true
     */
    enableInfiniteScrollWaitingAnimation: ComponentOptions.buildBooleanOption({ depend: 'enableInfiniteScroll', defaultValue: true }),
    mobileScrollContainer: ComponentOptions.buildSelectorOption({ defaultFunction: () => <HTMLElement>document.querySelector('.coveo-results-column') }),
    /**
     * Specifies a list of fields to include in the query.<br/>
     * This is to ensure that fields that are not needed for the UI to function are not sent by the search API.<br/>
     * By default, this list is empty.<br/>
     * Note that this option has an interaction with autoSelectFieldsToInclude
     */
    fieldsToInclude: ComponentOptions.buildFieldsOption({ includeInResults: true }),
    /**
     * Specifies that the result list should scan its template and discover which field it will need to render every results.<br/>
     * This is to ensure that fields that are not needed for the UI to function are not sent by the search API.<br/>
     * Default value is false.<br/>
     * NB: Many interface created by the interface editor will actually explicitly set this option to true.
     */
    autoSelectFieldsToInclude: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the layout to use for displaying the results. Specifying a value for this option will automatically
     * populate a {@link ResultLayout} component with a switcher for the layout.
     *
     * For example, if there are two {@link ResultList} components in the page, one with its
     * {@link ResultList.options.layout} set to `list` and the other with the same option set to `card`, then the
     * ResultLayout component will have two buttons respectively titled **List** and **Card**.
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

  /**
   * Create a new ResultList.<br/>
   * Bind various event related to queries (eg : on querySuccess -> renderResults)<br/>
   * Bind scroll event if infinite scrolling is enabled.
   * @param element The HTMLElement on which the element will be instantiated.
   * @param options The options for the ResultList.
   * @param bindings The bindings that the component requires to function normally. If not set, will automatically resolve them (With slower execution time)
   * @param elementClassId The class that this component should instantiate. By default this will be CoveoResultList. This is used by component that extends the base ResultList
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
      this.bind.on(<HTMLElement>this.options.infiniteScrollContainer, 'scroll', (e: Event) => this.handleScrollOfResultList());
    }
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.FIRST, () => this.handlePageChanged());

    $$(this.options.resultContainer).addClass('coveo-result-list-container');
    $$(this.options.resultContainer).addClass(`coveo-${this.options.layout}-layout`);

    $$(this.root).on(ResultLayoutEvents.populateResultLayout, (e, args) => args.layouts.push(this.options.layout));
  }

  /**
   * Empty the current result list content and append the given array of HTMLElement.<br/>
   * Can append to existing elements in the result list, or replace them.<br/>
   * Triggers the newResultDiplayed and newResultsDisplayed event
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
    if (this.options.layout == 'card') {
      // Used to prevent last card from spanning the grid's whole width
      _.times(3, () => this.options.resultContainer.appendChild($$('div').el));
    }
    this.triggerNewResultsDisplayed();
  }

  /**
   * Build and return an array of HTMLElement with the given result set.
   * @param results
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
   * Build and return an HTMLElement for the given result.
   * @param result
   * @returns {HTMLElement}
   */
  public buildResult(result: IQueryResult): HTMLElement {
    Assert.exists(result);
    QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), result);
    QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, result);
    ResultList.resultCurrentlyBeingRendered = result;
    let resultElement = this.options.resultTemplate.instantiateToElement(result, true, true, { layout: <ValidLayout>this.options.layout });
    if (resultElement != null) {
      Component.bindResultToElement(resultElement, result);
    }
    this.autoCreateComponentsInsideResult(resultElement, result);
    return resultElement;
  }

  /**
   * Execute a query to fetch new results. After the query is done, render those new results.<br/>
   * Assert that there is actually more results to display by checking that the last query returned as many results as requested.<br/>
   * Assert that the result list is not currently fetching results
   * @param count The number of results to fetch and display
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
      Defer.defer(() => this.handleScrollOfResultList());
    });
  }

  /**
   * Get the list of currently displayed result
   * @returns {IQueryResult[]}
   */
  public getDisplayedResults(): IQueryResult[] {
    return this.currentlyDisplayedResults;
  }

  /**
   * Get the list of currently displayed result HTMLElement
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
      args.queryBuilder.addRequiredFields(this.getAutoSelectedFieldsToInclude());
      args.queryBuilder.includeRequiredFields = true;
    }
  }

  private handleChangeLayout(args: IChangeLayoutEventArgs) {
    if (args.layout === this.options.layout) {
      this.enable();
      if (args.results) {
        Defer.defer(() => {
          this.renderResults(this.buildResults(args.results));
        });
      }
    } else {
      this.disable();
    }
  }

  private getAutoSelectedFieldsToInclude() {
    return _.chain(this.options.resultTemplate.getFields())
      .concat(this.getMinimalFieldsToInclude())
      .compact()
      .unique()
      .value();
  }

  private isCurrentlyFetchingMoreResults(): boolean {
    return Utils.exists(this.fetchingMoreResults);
  }

  private getMinimalFieldsToInclude() {
    // these fields are needed for analytics click event
    return ['author', 'language', 'urihash', 'objecttype', 'collection', 'source', 'language', 'uniqueid'];
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
    this.options.waitAnimationContainer.appendChild(DomUtils.getLoadingSpinner());
  }

  private hideWaitingAnimationForInfiniteScrolling() {
    let spinner = $$(this.options.waitAnimationContainer).find('.coveo-loading-spinner');
    if (spinner) {
      $$(spinner).detach();
    }
  }

  private static getDefaultTemplate(e: HTMLElement): Template {
    let component = <ResultList>Component.get(e);
    if (component.searchInterface instanceof Recommendation) {
      return new DefaultRecommendationTemplate();
    }
    return new DefaultResultTemplate();
  }
}


Initialization.registerAutoCreateComponent(ResultList);
