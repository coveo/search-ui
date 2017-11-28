import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IAnalyticsClient } from './AnalyticsClient';
import { ComponentOptions } from '../Base/ComponentOptions';
import { AnalyticsEndpoint } from '../../rest/AnalyticsEndpoint';
import { SearchEndpoint } from '../../rest/SearchEndpoint';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IBuildingQueryEventArgs, IQueryErrorEventArgs } from '../../events/QueryEvents';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import { $$ } from '../../utils/Dom';
import { Model, IAttributeChangedEventArg } from '../../models/Model';
import { IAnalyticsActionCause, IAnalyticsDocumentViewMeta } from '../Analytics/AnalyticsActionListMeta';
import { IQueryResult } from '../../rest/QueryResult';
import { Utils } from '../../utils/Utils';
import { NoopAnalyticsClient } from '../Analytics/NoopAnalyticsClient';
import { LiveAnalyticsClient } from './LiveAnalyticsClient';
import { MultiAnalyticsClient } from './MultiAnalyticsClient';
import { IAnalyticsQueryErrorMeta, analyticsActionCauseList } from './AnalyticsActionListMeta';
import { RecommendationAnalyticsClient } from './RecommendationAnalyticsClient';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { PendingSearchEvent } from './PendingSearchEvent';
import { PendingSearchAsYouTypeSearchEvent } from './PendingSearchAsYouTypeSearchEvent';

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
 * The `Analytics` component can log user actions performed in the search interface and send them to a REST web service
 * exposed through the Coveo Cloud Platform.
 *
 * You can use analytics data to evaluate how users are interacting with your search interface, improve relevance and
 * produce analytics dashboards within the Coveo Cloud Platform.
 *
 * See [Step 7 - Usage Analytics](https://developers.coveo.com/x/EYskAg) of the Getting Started with the JavaScript
 * Search Framework V1 tutorial for an introduction to usage analytics.
 *
 * See also [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ) for more advanced use cases.
 */

export class Analytics extends Component {
  static ID = 'Analytics';

  static doExport() {
    exportGlobally({
      PendingSearchEvent: PendingSearchEvent,
      PendingSearchAsYouTypeSearchEvent: PendingSearchAsYouTypeSearchEvent,
      analyticsActionCauseList: analyticsActionCauseList,
      NoopAnalyticsClient: NoopAnalyticsClient,
      LiveAnalyticsClient: LiveAnalyticsClient,
      MultiAnalyticsClient: MultiAnalyticsClient,
      Analytics: Analytics
    });
  }

  // NOTE: The default values for some of those options (`organization`, `endpoint`, `searchHub`) can be
  // overridden by generated code when using hosted search pages.

  /**
   * Options for the component
   * @componentOptions
   */
  static options: IAnalyticsOptions = {
    /**
     * Specifies the name of the user for the usage analytics logs.
     *
     * Default value is `undefined`
     */
    user: ComponentOptions.buildStringOption(),

    /**
     * Specifies the user display name for the usage analytics logs.
     *
     * Default value is `undefined`
     */
    userDisplayName: ComponentOptions.buildStringOption(),

    /**
     * Specifies the token to use to access the usage analytics endpoint.
     *
     * Default value is `undefined`, and the component uses the search token.
     */
    token: ComponentOptions.buildStringOption(),

    /**
     * Specifies the URL of the Usage Analytics service. You do not have to specify a value for this option, unless
     * the location of the service you use differs from the default Coveo Cloud Usage Analytics endpoint.
     *
     * Default value is `https://usageanalytics.coveo.com`.
     */
    endpoint: ComponentOptions.buildStringOption({ defaultValue: AnalyticsEndpoint.DEFAULT_ANALYTICS_URI }),

    /**
     * Specifies whether to convert search user identities to unique hash when logging analytics data, so that
     * analytics reviewers and managers will not be able to clearly identify which user is performing which query.
     *
     * When you set this option to `true`, the Coveo Usage Analytics service can still properly differentiate sessions
     * made by anonymous users from sessions made by users authenticated in some way on the site containing the search
     * page.
     *
     * Default value is `false`.
     */
    anonymous: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Sets the Search Hub dimension on the search events.
     *
     * The Search Hub dimension is typically a name that refers to a specific search page. For example, you could use
     * the `CommunitySite` value to refer to a search page on a public community site.
     *
     * **Note:**
     * > If you wish to use the search hub dimension for security reasons (e.g., to provide different query suggestions
     * > for internal and external users), you should specify the search hub when generating the search token for the
     * > end user (in safe, server-side code), rather than setting it with this option (see
     * > [Search Token Authentication](https://developers.coveo.com/x/XICE)).
     *
     * Default value is `default`.
     */
    searchHub: ComponentOptions.buildStringOption({ defaultValue: 'default' }),

    /**
     * Specifies the name of the split test run that the search page is part of.
     *
     * You can use this dimension to perform A/B testing using different search page layouts and features inside the
     * Coveo Query pipeline.
     *
     * Default value is `undefined` and no split test run name is reported to the Coveo Usage Analytics service.
     */
    splitTestRunName: ComponentOptions.buildStringOption(),

    /**
     * Specifies the version name for the page when a split test run is active.
     *
     * When reporting on A/B testing analytics data, this value specifies the test run version name that was
     * presented to the user.
     *
     * Default value is `undefined`
     */
    splitTestRunVersion: ComponentOptions.buildStringOption(),
    sendToCloud: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies the organization bound to the access token. This is necessary when using an access token, because a
     * single access token can be associated to more than one organization.
     *
     * Default value is `undefined`, and the value of this parameter will fallback to the organization used for the
     * search endpoint.
     */
    organization: ComponentOptions.buildStringOption()
  };

  /**
   * A reference to the `AnalyticsClient`, which performs the heavy duty part of sending the usage analytics events to
   * the Coveo Usage Analytics service.
   */
  public client: IAnalyticsClient;

  /**
   * Creates a new `Analytics` component. Creates the [`AnalyticsClient`]{@link IAnalyticsClient}.
   * @param element The HTMLElement on which the component will be instantiated.
   * @param options The options for the `Analytics` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: IAnalyticsOptions = {}, public bindings?: IComponentBindings) {
    super(element, Analytics.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Analytics, options);

    this.retrieveInfoFromDefaultSearchEndpoint();
    this.initializeAnalyticsClient();
    Assert.exists(this.client);

    this.bind.onRootElement(QueryEvents.buildingQuery, (data: IBuildingQueryEventArgs) => this.handleBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.queryError, (data: IQueryErrorEventArgs) => this.handleQueryError(data));

    // Analytics component is a bit special: It can be higher in the dom tree than the search interface
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
   * Logs a `Search` usage analytics event.
   *
   * A `Search` event is actually sent to the Coveo Usage Analytics service only after the query successfully returns
   * (not immediately after calling this method). Therefore, it is important to call this method **before** executing
   * the query. Otherwise, the `Search` event will not be logged, and you will get a warning message in the console.
   *
   * **Note:**
   *
   * > When logging custom `Search` events, you should use the `Coveo.logSearchEvent` top-level function rather than
   * > calling this method directly from the `Analytics` component instance. See
   * > [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause The cause of the event.
   * @param meta The metadata you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * service automatically converts white spaces to underscores, and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   */
  public logSearchEvent<T>(actionCause: IAnalyticsActionCause, meta: T) {
    this.client.logSearchEvent<T>(actionCause, meta);
  }

  /**
   * Logs a `SearchAsYouType` usage analytics event.
   *
   * This method is very similar to the [`logSearchEvent`]{@link Analytics.logSearchEvent} method, except that
   * `logSearchAsYouType` should, by definition, be called more frequently. Consequently, in order to avoid logging
   * every single partial query, the `PendingSearchAsYouTypeEvent` takes care of logging only the "relevant" last event:
   * an event that occurs after 5 seconds have elapsed without any event being logged, or an event that occurs after
   * another part of the interface triggers a search event.
   *
   * It is important to call this method **before** executing the query. Otherwise, no `SearchAsYouType` event will be
   * logged, and you will get a warning message in the console.
   *
   * **Note:**
   *
   * > When logging custom `SearchAsYouType` events, you should use the `Coveo.logSearchAsYouTypeEvent` top-level
   * > function rather than calling this method directly from the `Analytics` component instance. See
   * > [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause The cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * service automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   */
  public logSearchAsYouType<T>(actionCause: IAnalyticsActionCause, meta: T) {
    this.client.logSearchAsYouType(actionCause, meta);
  }

  /**
   * Logs a `Custom` usage analytics event on the service.
   *
   * You can use `Custom` events to create custom reports, or to track events which are neither queries (see
   * [`logSearchEvent`]{@link Analytics.logSearchEvent} and
   * [`logSearchAsYouType`]{@link Analytics.logSearchAsYouType}), nor item views (see
   * [`logClickEvent`]{@link Analytics.logClickEvent}).
   *
   * **Note:**
   * > When logging `Custom` events, you should use the `Coveo.logClickEvent` top-level function rather than calling
   * > this method directly from the `Analytics` component instance. See
   * > [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause The cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * service automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   * @param element The HTMLElement that the user has interacted with for this custom event. Default value is the
   * element on which the `Analytics` component is bound.
   */
  public logCustomEvent<T>(actionCause: IAnalyticsActionCause, meta: T, element: HTMLElement = this.element) {
    this.client.logCustomEvent(actionCause, meta, element);
  }

  /**
   * Logs a `Click` usage analytics event.
   *
   * A `Click` event corresponds to an item view (e.g., clicking on a {@link ResultLink} or opening a
   * {@link Quickview}).
   *
   * `Click` events are immediately sent to the Coveo Usage Analytics service.
   *
   * **Note:**
   * > When logging custom `Click` events, you should use the `Coveo.logClickEvent` top-level function rather than
   * > calling this method directly from the `Analytics` component instance. See
   * > [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause The cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * service automatically converts uppercase characters to lowercase characters in key names. Each value must be a
   * simple string. You do not have to pass an {@link IAnalyticsDocumentViewMeta} as meta when logging a `Click` event.
   * You can actually send any arbitrary meta. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   * @param result The result that was clicked.
   * @param element The HTMLElement that the user has clicked in the interface. Default value is the element on which
   * the `Analytics` component is bound.
   */
  public logClickEvent(
    actionCause: IAnalyticsActionCause,
    meta: IAnalyticsDocumentViewMeta,
    result: IQueryResult,
    element: HTMLElement = this.element
  ) {
    this.client.logClickEvent(actionCause, meta, result, element);
  }

  /**
   * Sets the Origin Context dimension on the analytic events.
   *
   * You can use this dimension to specify the context of your application.
   * Suggested values are "Search", "InternalSearch" and "CommunitySearch"
   *
   * Default value is `Search`.
   *
   * @param originContext The origin context value
   */
  public setOriginContext(originContext: string) {
    this.client.setOriginContext(originContext);
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

      let isRecommendation = $$(this.root).hasClass(Component.computeCssClassNameForType(`Recommendation`));
      this.instantiateAnalyticsClient(endpoint, elementToInitializeClient, isRecommendation);
    } else {
      this.client = new NoopAnalyticsClient();
    }
  }

  private instantiateAnalyticsClient(endpoint: AnalyticsEndpoint, elementToInitializeClient: HTMLElement, isRecommendation: boolean) {
    if (isRecommendation) {
      this.client = new RecommendationAnalyticsClient(
        endpoint,
        elementToInitializeClient,
        this.options.user,
        this.options.userDisplayName,
        this.options.anonymous,
        this.options.splitTestRunName,
        this.options.splitTestRunVersion,
        this.options.searchHub,
        this.options.sendToCloud,
        this.getBindings()
      );
    } else {
      this.client = new LiveAnalyticsClient(
        endpoint,
        elementToInitializeClient,
        this.options.user,
        this.options.userDisplayName,
        this.options.anonymous,
        this.options.splitTestRunName,
        this.options.splitTestRunVersion,
        this.options.searchHub,
        this.options.sendToCloud
      );
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

    this.client.logCustomEvent<IAnalyticsQueryErrorMeta>(
      analyticsActionCauseList.queryError,
      {
        query: data.query.q,
        aq: data.query.aq,
        cq: data.query.cq,
        dq: data.query.dq,
        errorType: data.error.type,
        errorMessage: data.error.message
      },
      this.element
    );
  }

  public static create(element: HTMLElement, options: IAnalyticsOptions, bindings: IComponentBindings): IAnalyticsClient {
    let selector = Component.computeSelectorForType(Analytics.ID);
    let found: HTMLElement[] = [];
    found = found.concat($$(element).findAll(selector));
    if (!$$(element).hasClass(Component.computeCssClassNameForType('Recommendation'))) {
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
      return new MultiAnalyticsClient(_.map(found, el => Analytics.getClient(el, options, bindings)));
    } else {
      return new NoopAnalyticsClient();
    }
  }

  private static ignoreElementsInsideRecommendationInterface(found: HTMLElement[]): HTMLElement[] {
    return _.filter(found, element => {
      return $$(element).closest(Component.computeCssClassNameForType('Recommendation')) === undefined;
    });
  }

  private static getClient(element: HTMLElement, options: IAnalyticsOptions, bindings: IComponentBindings): IAnalyticsClient {
    // This check if an element is already initialized as an analytics component.
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
