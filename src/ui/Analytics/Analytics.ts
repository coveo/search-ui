import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {IAnalyticsClient} from './AnalyticsClient';
import {ComponentOptions} from '../Base/ComponentOptions';
import {AnalyticsEndpoint} from '../../rest/AnalyticsEndpoint';
import {SearchEndpoint} from '../../rest/SearchEndpoint';
import {Assert} from '../../misc/Assert';
import {QueryEvents, IBuildingQueryEventArgs, IQueryErrorEventArgs} from '../../events/QueryEvents';
import {ComponentOptionsModel} from '../../models/ComponentOptionsModel';
import {$$} from '../../utils/Dom';
import {Model, IAttributeChangedEventArg} from '../../models/Model';
import {IAnalyticsActionCause, IAnalyticsDocumentViewMeta} from '../Analytics/AnalyticsActionListMeta';
import {IQueryResult} from '../../rest/QueryResult';
import {Utils} from '../../utils/Utils';
import {NoopAnalyticsClient} from '../Analytics/NoopAnalyticsClient';
import {LiveAnalyticsClient} from './LiveAnalyticsClient';
import {MultiAnalyticsClient} from './MultiAnalyticsClient';
import {IAnalyticsQueryErrorMeta, analyticsActionCauseList} from './AnalyticsActionListMeta';
import {SearchInterface} from '../SearchInterface/SearchInterface';
import {Recommendation} from '../Recommendation/Recommendation';
import {RecommendationAnalyticsClient} from './RecommendationAnalyticsClient';


export interface IAnalyticsOptions {
  user?: string;
  userDisplayName?: string;
  token?: string;
  endpoint?: string;
  anonymous?: boolean;
  searchHub?: string;
  splitTestRunName?: string;
  splitTestRunVersion?: string;
  sendToCloud?: boolean;
  organization?: string;
}

/**
 * This component logs all user actions performed in the search interface and sends them to a REST web service exposed through the Coveo Cloud platform.<br/>
 * You can use this data to evaluate how users are interacting with the search interface, improve relevance and produce analytics dashboards in the Coveo platform.
 *
 * # Sending Custom Events
 * In some scenarios, you want to send custom data to the Coveo Cloud analytics (see Coveo Cloud Usage Analytics). The Coveo JavaScript Search Framework offers helpers to communicate with the Coveo Analytics REST API, so you do not have to write code to call the API directly.
 *
 * 1. First, you need to craft your custom event cause and meta.
 * ```
 *   var customEventCause = {name: 'customEventName', type:'customEventType'};
 *   var metadata = {key1: "value1", key2:"value2"};
 * ```
 *
 * 2. Sending a custom event.
 * ```
 *   Coveo.logCustomEvent(document.querySelector('#search'), customEventCause, metadata);
 *      // OR (using the jquery extension)
 *   $('#search').coveo('logCustomEvent', customEventCause, metadata);
 * ```
 *
 * 3. Sending a custom search event<br/>(**NB : If you want to log a searchEvent, be sure to always call the helper before you call executeQuery.**)
 * ```
 * function myCustomButtonWasClicked() {
 *      Coveo.logSearchEvent(document.querySelector('#search'), customEventCause, metadata);
 *      Coveo.executeQuery(document.querySelector('#search'));
 *      // OR (using the jquery extension)
 *      $('#search').coveo('logSearchEvent', customEventCause, metadata);
 *      $('#search').coveo('executeQuery');
 * }
 * ```
 *
 * 4. Sending a custom searchAsYouType event<br/>(NB : **If you want to log a searchAsYouTypeEvent, be sure to always call the helper before you call executeQuery.**)
 * ```
 * function myCustomButtonWasClicked() {
 *      Coveo.logSearchAsYouTypeEvent(document.querySelector('#search'), customEventCause, metadata);
 *      Coveo.executeQuery(document.querySelector('#search'));
 *      // OR (using the jquery extension)
 *      $('#search').coveo('logSearchAsYouTypeEvent', customEventCause, metadata);
 *      $('#search').coveo('executeQuery');
 * }
 * ```
 *
 * 5. Sending a custom click event
 * ```
 * Coveo.logClickEvent(document.querySelector('#search'), customEventCause, metadata, result);
 * // OR (using the jquery extension)
 * $('#search').coveo('logClickEvent', customEventCause, metadata, result);
 * ```
 */
export class Analytics extends Component {
  static ID = 'Analytics';
  // NOTE: The default values for some of those options (organization, endpoint, searchHub) can be
  // overridden by generated code when using hosted search pages.

  /**
   * Options for the component
   * @componentOptions
   */
  static options: IAnalyticsOptions = {
    /**
     * Specifies the name of the user for usage analytics logs.
     */
    user: ComponentOptions.buildStringOption(),
    /**
     * Specifies the name of the user display name for usage analytics logs.
     */
    userDisplayName: ComponentOptions.buildStringOption(),
    /**
     * Specifies the token used to gain access the analytics endpoint.<br/>
     * This attribute is optional, the component will use the search token by default.
     */
    token: ComponentOptions.buildStringOption(),
    /**
     * Specifies the URL of the analytics logger for rare cases where it is different from the default usage analytics Coveo Cloud endpoint (https://usageanalytics.coveo.com).
     */
    endpoint: ComponentOptions.buildStringOption({ defaultValue: AnalyticsEndpoint.DEFAULT_ANALYTICS_URI }),
    /**
     * Specifies whether the search user identities are converted in a unique hash in the logged analytics data to prevent analytics reviewers and managers to identify who performs which queries.<br/>
     * When enabled, the Coveo Analytics Platform can still properly identify sessions made by anonymous users, versus ones from users that are authenticated in some way with the site containing the search page.<br/>
     * The default value is false.
     */
    anonymous: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Sets the Search Hub dimension on the search events.<br/>
     * The Search Hub dimension is typically a name that refers to a specific search page. For example, one could use the CommunitySite value to refer to a search page on a company's public community site.<br/>
     * The default value is default.
     */
    searchHub: ComponentOptions.buildStringOption({ defaultValue: 'default' }),
    /**
     * Specifies the name of the split test run that the search page is a part of.<br/>
     * This dimension can be used to perform A/B testing using different search page layouts and features, inside the Coveo Query pipeline.<br/>
     * By default, this value is not specified and no split test run name is reported to the Coveo Analytics Platform.
     */
    splitTestRunName: ComponentOptions.buildStringOption(),
    /**
     * Specifies the version name for the page when a split test run is active.<br/>
     * When reporting on A/B testing analytics data, this value specifies the test run version name that has been presented to the user.<br/>
     * By default, this value is not specified.
     */
    splitTestRunVersion: ComponentOptions.buildStringOption(),
    sendToCloud: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the organization bound to the access token. This is necessary when using an access token because it can be associated with more than organization.
     * If this parameter is not specified, it will fallback on the organization used for the search endpoint.
     */
    organization: ComponentOptions.buildStringOption()
  };

  /**
   * A reference to the analyticsClient, which will perform the heavy duty part of logging the actual events on the service.
   */
  public client: IAnalyticsClient;

  /**
   * Create a new Analytics component. Create the {@link IAnalyticsClient}
   * @param element The HTMLElement on which the component will be instantiated.
   * @param options The options for the Analytics.
   * @param bindings The bindings that the component requires to function normally. If not set, will automatically resolve them (With slower execution time)
   */
  constructor(public element: HTMLElement, public options: IAnalyticsOptions = {}, public bindings?: IComponentBindings) {
    super(element, Analytics.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Analytics, options);

    this.retrieveInfoFromDefaultSearchEndpoint();
    this.initializeAnalyticsClient();
    Assert.exists(this.client);

    this.bind.onRootElement(QueryEvents.buildingQuery, (data: IBuildingQueryEventArgs) => this.handleBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.queryError, (data: IQueryErrorEventArgs) => this.handleQueryError(data));

    // Analytics component is a bit special : It can be higher in the dom tree than the search interface
    // Need to resolve down to find the componentOptionsModel if we need to.
    if (!this.componentOptionsModel) {
      let cmpOptionElement = $$(element).find('.' + Component.computeCssClassName(ComponentOptionsModel));
      if (cmpOptionElement) {
        this.componentOptionsModel = cmpOptionElement[Component.computeCssClassName(ComponentOptionsModel)];
      }
    }

    if (this.componentOptionsModel) {
      this.componentOptionsModel.set(ComponentOptionsModel.attributesEnum.searchHub, this.options.searchHub);
      let event = this.componentOptionsModel.getEventName(Model.eventTypes.changeOne + ComponentOptionsModel.attributesEnum.searchHub);
      this.bind.onRootElement(event, (args: IAttributeChangedEventArg) => this.handleSearchHubChanged(args));
    }
  }

  /**
   * Log a search event on the service, using a cause and a meta object.<br/>
   * Note that the event will be sent on the service when a query successfully return, not immediately after calling this method.<br/>
   * Normally, this should be called using the following "format" : <br/>
   * usageAnalytics.logSearchEvent<SomeMeta>({name : 'foo', type : 'bar'}, <SomeMeta>{'key':'value'});<br/>
   * this.queryController.executeQuery();<br/>
   * This will queue up an analytics search event. Then the query is executed. The search event will be sent to the service when the query successfully complete.<br/>
   * @param actionCause
   * @param meta Can be an empty object ( {} )
   */
  public logSearchEvent<T>(actionCause: IAnalyticsActionCause, meta: T) {
    this.client.logSearchEvent<T>(actionCause, meta);
  }

  /**
   * Log a search as you type event on the service, using a cause and a meta object.<br/>
   * This is extremely similar to a search event, except that search as you type, by definition, will be frequently called.<br/>
   * The {@link PendingSearchAsYouTypeEvent} will take care of logging only the "relevant" last event : After 5 seconds of no event logged, or after another search event is triggered somewhere else in the interface.<br/>
   * This is to ensure that we do not needlessly log every single partial query, which would make the reporting very confusing.
   * @param actionCause
   * @param meta Can be an empty object ( {} )
   */
  public logSearchAsYouType<T>(actionCause: IAnalyticsActionCause, meta: T) {
    this.client.logSearchAsYouType(actionCause, meta);
  }

  /**
   * Log a custom event on the service. A custom event can be used to create customized report, or to track events which are not queries or document view.
   * @param actionCause
   * @param meta
   * @param element The HTMLElement that was interacted with for this custom event.
   */
  public logCustomEvent<T>(actionCause: IAnalyticsActionCause, meta: T, element: HTMLElement = this.element) {
    this.client.logCustomEvent(actionCause, meta, element);
  }

  /**
   * Log a click event. A click event can be understood as a document view.<br/>
   * eg : Clicking on a result link of opening a quickview.<br/>
   * This event will be logged immediately on the service.
   * @param actionCause
   * @param meta Can be an empty object ( {} )
   * @param result The result that was clicked
   * @param element The HTMLElement that was clicked in the interface
   */
  public logClickEvent(actionCause: IAnalyticsActionCause, meta: IAnalyticsDocumentViewMeta, result: IQueryResult, element: HTMLElement = this.element) {
    this.client.logClickEvent(actionCause, meta, result, element);
  }

  protected initializeAnalyticsEndpoint(): AnalyticsEndpoint {
    return new AnalyticsEndpoint({
      token: this.options.token,
      serviceUrl: this.options.endpoint,
      organization: this.options.organization
    });
  }

  private initializeAnalyticsClient() {
    if (Utils.isNonEmptyString(this.options.endpoint)) {
      let endpoint = this.initializeAnalyticsEndpoint();
      let elementToInitializeClient: HTMLElement;
      if (this.root && this.element) {
        if (this.root.contains(this.element)) {
          elementToInitializeClient = this.root;
        } else {
          elementToInitializeClient = this.element;
        }

      }

      let isRecommendation = $$(this.root).hasClass(Component.computeCssClassName(Recommendation));
      this.instantiateAnalyticsClient(endpoint, elementToInitializeClient, isRecommendation);

    } else {
      this.client = new NoopAnalyticsClient();
    }
  }

  private instantiateAnalyticsClient(endpoint: AnalyticsEndpoint, elementToInitializeClient: HTMLElement, isRecommendation: boolean) {
    if (isRecommendation) {
      this.client = new RecommendationAnalyticsClient(endpoint, elementToInitializeClient,
        this.options.user,
        this.options.userDisplayName,
        this.options.anonymous,
        this.options.splitTestRunName,
        this.options.splitTestRunVersion,
        this.options.searchHub,
        this.options.sendToCloud,
        this.getBindings());
    } else {
      this.client = new LiveAnalyticsClient(endpoint, elementToInitializeClient,
        this.options.user,
        this.options.userDisplayName,
        this.options.anonymous,
        this.options.splitTestRunName,
        this.options.splitTestRunVersion,
        this.options.searchHub,
        this.options.sendToCloud);
    }
  }

  private retrieveInfoFromDefaultSearchEndpoint() {
    let defaultEndpoint = SearchEndpoint.endpoints['default'];
    if (this.options.token == null && defaultEndpoint) {
      this.options.token = defaultEndpoint.options.accessToken;
    }

    if (!this.options.organization && defaultEndpoint) {
      this.options.organization = defaultEndpoint.options.queryStringArguments['workgroup'];
    }
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);

    data.queryBuilder.searchHub = this.options.searchHub;
  }

  private handleSearchHubChanged(data: IAttributeChangedEventArg) {
    this.options.searchHub = data.value;
  }

  private handleQueryError(data: IQueryErrorEventArgs) {
    Assert.exists(data);

    this.client.logCustomEvent<IAnalyticsQueryErrorMeta>(analyticsActionCauseList.queryError, {
      query: data.query.q,
      aq: data.query.aq,
      cq: data.query.cq,
      dq: data.query.dq,
      errorType: data.error.type,
      errorMessage: data.error.message
    }, this.element);
  }

  public static create(element: HTMLElement, options: IAnalyticsOptions, bindings: IComponentBindings) {
    let selector = Component.computeSelectorForType(Analytics.ID);
    let found: HTMLElement[] = [];
    found = found.concat($$(element).findAll(selector));
    if (!(Component.get(element, SearchInterface) instanceof Recommendation)) {
      found = this.ignoreElementsInsideRecommendationInterface(found);
    }
    found.push($$(element).closest(Component.computeCssClassName(Analytics)));
    if ($$(element).is(selector)) {
      found.push(element);
    }
    found = _.compact(found);

    if (found.length == 1) {
      return Analytics.getClient(found[0], options, bindings);
    } else if (found.length > 1) {
      return new MultiAnalyticsClient(_.map(found, (el) => Analytics.getClient(el, options, bindings)));
    } else {
      return new NoopAnalyticsClient();
    }
  }

  private static ignoreElementsInsideRecommendationInterface(found: HTMLElement[]): HTMLElement[] {
    return _.filter(found, (element) => {
      return $$(element).closest(Component.computeCssClassName(Recommendation)) === undefined;
    });
  }

  private static getClient(element: HTMLElement, options: IAnalyticsOptions, bindings: IComponentBindings): IAnalyticsClient {
    // This check if an element is already initialized as an analytics component
    // If that's the case, return the client on that element.
    // Otherwise, init and return.
    let foundOnElement = Component.get(element, Analytics, true);
    if (foundOnElement instanceof Analytics) {
      return (<Analytics>foundOnElement).client;
    } else {
      return new Analytics(element, options, bindings).client;
    }
  }
}
