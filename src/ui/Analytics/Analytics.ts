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
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { Recommendation } from '../Recommendation/Recommendation';
import { RecommendationAnalyticsClient } from './RecommendationAnalyticsClient';
import _ = require('underscore');

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
 * The Analytics component logs user actions performed in the search interface and sends them to a REST web service
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
     * Specifies the URL of the usage analytics logger to cover exceptional cases in which this location could differ
     * from the default Coveo Cloud Usage Analytics endpoint (https://usageanalytics.coveo.com).
     *
     * Default value is `https://usageanalytics.coveo.com`.
     */
    endpoint: ComponentOptions.buildStringOption({ defaultValue: AnalyticsEndpoint.DEFAULT_ANALYTICS_URI }),

    /**
     * Specifies whether to convert search user identities to unique hash when logging analytics data, so that
     * analytics reviewers and managers will not be able to clearly identify which user is performing which query.
     *
     * When this option is `true`, the Coveo Usage Analytics Platform can still properly differentiate sessions
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
     * the `CommunitySite` value to refer to a search page on a company's public community site.
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
     * Default value is `undefined` and no split test run name is reported to the Coveo Usage Analytics Platform.
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
   * A reference to the `analyticsClient`, which performs the heavy duty part of logging the actual events on the
   * service.
   */
  public client: IAnalyticsClient;

  /**
   * Creates a new Analytics component. Creates the {@link IAnalyticsClient}.
   * @param element The HTMLElement on which the component will be instantiated.
   * @param options The options for the Analytics component.
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
   * Logs a Search event on the service, using an [AnalyticsActionCause]({@link IAnalyticsActionCause}) and a meta
   * object.
   *
   * Note that the search event is only sent to the service when the query successfully returns, not immediately after
   * calling this method. Therefore, it is important to call this method before executing the query. Otherwise the
   * service will log no Search event and you will get a warning message in the console.
   *
   * See [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   */
  public logSearchEvent<T>(actionCause: IAnalyticsActionCause, meta: T) {
    this.client.logSearchEvent<T>(actionCause, meta);
  }

  /**
   * Logs a SearchAsYouType event on the service, using an {@link IAnalyticsActionCause} and a meta object.
   *
   * This method is very similar to the {@link logSearchEvent} method, except that logSearchAsYouType is, by definition,
   * more frequently called.
   *
   * The `PendingSearchAsYouTypeEvent` takes care of logging only the "relevant" last event: an event that occurs after
   * 5 seconds elapse without any event being logged, or an event that occurs after another part of the interface
   * triggers a search event. This avoids logging every single partial query, which would make the reporting very
   * confusing.
   *
   * It is important to call this method before executing the query. Otherwise the service will log no SearchAsYouType
   * event and you will get a warning message in the console.
   *
   * See [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   */
  public logSearchAsYouType<T>(actionCause: IAnalyticsActionCause, meta: T) {
    this.client.logSearchAsYouType(actionCause, meta);
  }

  /**
   * Logs a Custom event on the service. You can use custom events to create custom reports, or to track events
   * that are not queries or document views.
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   * @param element The HTMLElement that the user has interacted with for this custom event.
   */
  public logCustomEvent<T>(actionCause: IAnalyticsActionCause, meta: T, element: HTMLElement = this.element) {
    this.client.logCustomEvent(actionCause, meta, element);
  }

  /**
   * Logs a Click event. You can understand click events as document views (e.g., clicking on a {@link ResultLink} or
   * opening a {@link Quickview}).
   *
   * This event is logged immediately on the service.
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts uppercase characters to lowercase characters in key names. Each value must be a simple
   * string. You do not have to pass an {@link IAnalyticsDocumentViewMeta} as meta when logging a custom Click event.
   * You can actually send any arbitrary meta. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   * @param result The result that the user has clicked.
   * @param element The HTMLElement that the user has clicked in the interface.
   */
  public logClickEvent(actionCause: IAnalyticsActionCause, meta: IAnalyticsDocumentViewMeta, result: IQueryResult, element: HTMLElement = this.element) {
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

  public static create(element: HTMLElement, options: IAnalyticsOptions, bindings: IComponentBindings): IAnalyticsClient {
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
