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
import { AccessToken } from '../../rest/AccessToken';
import { AnalyticsEvents, IAnalyticsEventArgs } from '../../events/AnalyticsEvents';
import { QueryUtils } from '../../utils/QueryUtils';
import { AnalyticsInformation } from './AnalyticsInformation';
import { InitializationEvents } from '../../events/InitializationEvents';

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
  autoPushToGtmDataLayer?: boolean;
  gtmDataLayerName?: string;
  renewAccessToken?: () => Promise<string>;
}

/**
 * The `Analytics` component can log user actions performed in the search interface and send them to a REST web service
 * exposed through the Coveo Cloud Platform.
 *
 * You can use analytics data to evaluate how users are interacting with your search interface, improve relevance and
 * produce analytics dashboards within the Coveo Cloud Platform.
 *
 * See [JavaScript Search Framework Usage Analytics](https://docs.coveo.com/en/365) for an introduction.
 * 
 * See also [Logging Your Own Search Events](https://docs.coveo.com/en/2726/#logging-your-own-search-events) for more advanced use cases.
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
     * By deault, the value is `https://platform.cloud.coveo.com/rest/ua`, or
     * `https://platform-<REGION_ABBREVIATION>.cloud.coveo.com/rest/ua` if you have
     * [configured your search endpoint]{@link SearchEndpoint.configureCloudV2Endpoint} to implement
     * data residency outside of the United States.
     */
    endpoint: ComponentOptions.buildStringOption({
      postProcessing: value => {
        if (!value) {
          return AnalyticsEndpoint.getURLFromSearchEndpoint(SearchEndpoint.defaultEndpoint);
        }

        const isLegacy = value.indexOf('usageanalytics') !== -1;

        if (isLegacy) {
          const [basePlatform] = value.split('/rest');
          return basePlatform + '/rest';
        }

        return value;
      }
    }),

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
     * > [Search Token Authentication](https://docs.coveo.com/en/56/)).
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
    organization: ComponentOptions.buildStringOption(),

    /**
     * Whether to automatically attempt to push Coveo usage analytics events to the Google Tag Manager [data layer](https://developers.google.com/tag-manager/devguide#datalayer).
     *
     * See also [`gtmDataLayerName`]{@link Analytics.options.gtmDataLayerName}.
     *
     * @availablesince [July 2019 Release (v2.6459)](https://docs.coveo.com/en/2938/)
     */
    autoPushToGtmDataLayer: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * The name of the Google Tag Manager data layer initialized in the page.
     *
     * See also [`autoPushToGtmDataLayer`]{@link Analytics.options.autoPushToGtmDataLayer}.
     *
     * **Note:**
     * Setting this option is only useful if the [GTM data layer was renamed](https://developers.google.com/tag-manager/devguide#renaming) in the page.
     *
     * **Default:** `dataLayer`
     */
    gtmDataLayerName: ComponentOptions.buildStringOption({ defaultValue: 'dataLayer' })
  };

  /**
   * A reference to the `AnalyticsClient`, which performs the heavy duty part of sending the usage analytics events to
   * the Coveo Usage Analytics service.
   */
  public client: IAnalyticsClient;

  private accessToken: AccessToken;

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

    this.setupAccessToken();

    if (this.accessToken == null) {
      this.logger.error(`Analytics component could not resolve any access token`);
      this.logger.error(
        `Either provide a analytics token : data-option-token="an-authentication-token" on the Analytics element, or configure a default SearchEndpoint`,
        this.element
      );
      return;
    } else {
      this.options.token = this.accessToken.token;
      this.accessToken.subscribeToRenewal(newToken => {
        this.options.token = newToken;
        this.client.endpoint.endpointCaller.options.accessToken = newToken;
      });
    }

    this.initializeAnalyticsClient();
    Assert.exists(this.client);

    $$(this.root).on(QueryEvents.buildingQuery, (e, data: IBuildingQueryEventArgs) => this.handleBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.queryError, (data: IQueryErrorEventArgs) => this.handleQueryError(data));
    this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => this.handleDoNotTrack());

    if (this.options.autoPushToGtmDataLayer && this.isGtmDataLayerInitialized) {
      this.bind.onRootElement(AnalyticsEvents.analyticsEventReady, (data: IAnalyticsEventArgs) => this.pushToGtmDataLayer(data));
    }

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
      $$(this.root).on(event, (e, args: IAttributeChangedEventArg) => this.handleSearchHubChanged(args));
    }

    this.createClientId();
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
   * > [Logging Your Own Search Events](https://docs.coveo.com/en/2726/#logging-your-own-search-events).
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
   * > [Logging Your Own Search Events](https://docs.coveo.com/en/2726/#logging-your-own-search-events).
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
   * > [Logging Your Own Custom Events](https://docs.coveo.com/en/2726/#logging-your-own-custom-events).
   *
   * @param actionCause The cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * service automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   * @param element The HTMLElement that the user has interacted with for this custom event. Default value is the
   * element on which the `Analytics` component is bound.
   * @param result The IQueryResult that the custom event is linked to, if any.
   */
  public logCustomEvent<T>(actionCause: IAnalyticsActionCause, meta: T, element: HTMLElement = this.element, result?: IQueryResult) {
    this.client.logCustomEvent(actionCause, meta, element, result);
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
   * > [Logging Your Own Click Events](https://docs.coveo.com/en/2726/#logging-your-own-click-events).
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

  /**
   * Re-enables the component if it was previously disabled.
   */
  public enable() {
    if (!this.disabled) {
      return this.logger.warn('The Analytics component is already enabled.');
    }
    super.enable();
    this.initializeAnalyticsClient();
    this.updateSearchInterfaceUAClient();
    this.resolveQueryController().enableHistory();
  }

  /**
   * Removes all session information stored in the browser (e.g., analytics visitor cookies, action history, etc.)
   *
   * @availablesince [October 2019 Release (v2.7219)](https://docs.coveo.com/en/3084/)
   */
  public clearLocalData() {
    if (this.disabled || this.client instanceof NoopAnalyticsClient) {
      return this.logger.warn('Could not clear local data while analytics are disabled.');
    }
    new AnalyticsInformation().clear();
    this.resolveQueryController().resetHistory();
  }

  /**
   * Disables the component and clears local data by running [`clearLocalData`]{@link Analytics.clearLocalData}.
   */
  public disable() {
    if (this.disabled) {
      return this.logger.warn('The Analytics component is already disabled.');
    }
    this.clearLocalData();
    this.client.cancelAllPendingEvents();
    this.client = new NoopAnalyticsClient();
    this.updateSearchInterfaceUAClient();
    this.resolveQueryController().disableHistory();
    super.disable();
  }

  private updateSearchInterfaceUAClient() {
    this.searchInterface.usageAnalytics = this.client;
  }

  /**
   * Attempts to push data representing a single Coveo usage analytics event to the Google Tag Manager data layer.
   *
   * **Note:**
   * If the [`autoPushToGtmDataLayer`]{@link Analytics.options.autoPushToGtmDataLayer} option is set to `true` and the GTM data layer has been properly initialized in the page, this method is called automatically whenever an event is about to be logged to the Coveo Cloud usage analytics service.
   *
   * See also the [`gtmDataLayerName`]{@link Analytics.options.gtmDataLayerName} option.
   *
   * @param data The data to push.
   */
  public pushToGtmDataLayer(data: IAnalyticsEventArgs) {
    const dataLayerName = this.options.gtmDataLayerName;
    try {
      (<any>window)[dataLayerName].push(data);
    } catch (error) {
      this.logger.error(`Unexpected error when pushing to Google Tag Manager data layer '${dataLayerName}': '${error}'.`);
    }
  }

  protected initializeAnalyticsEndpoint(): AnalyticsEndpoint {
    return new AnalyticsEndpoint({
      accessToken: this.accessToken,
      serviceUrl: this.options.endpoint,
      organization: this.options.organization
    });
  }

  private createClientId() {
    const info = new AnalyticsInformation();

    if (!info.clientId) {
      info.clientId = QueryUtils.createGuid();
    }
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
        this.options.sendToCloud,
        this.getBindings()
      );
    }
  }

  private setupAccessToken() {
    this.trySetupAccessTokenFromOptions();
    if (this.accessToken == null) {
      this.trySetupAccessTokenFromDefaultSearchEndpoint();
    }
  }

  private trySetupAccessTokenFromOptions() {
    if (this.options.token != null) {
      this.accessToken = new AccessToken(this.options.token, this.options.renewAccessToken);
    }
  }

  private trySetupAccessTokenFromDefaultSearchEndpoint() {
    if (this.defaultEndpoint) {
      this.accessToken = this.defaultEndpoint.accessToken;

      this.options.token = this.defaultEndpoint.accessToken.token;
    }

    if (!this.options.organization && this.defaultEndpoint) {
      this.options.organization = this.defaultEndpoint.options.queryStringArguments['organizationId'];
    }
  }

  private get defaultEndpoint(): SearchEndpoint {
    return this.searchInterface.options.endpoint || SearchEndpoint.defaultEndpoint;
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

  private get isGtmDataLayerInitialized(): boolean {
    const dataLayerName = this.options.gtmDataLayerName;
    if (!dataLayerName) {
      return false;
    }
    if (!(<any>window)[dataLayerName]) {
      this.logger.warn(`Cannot automatically push to Google Tag Manager data layer: '${dataLayerName}' is undefined.`);
      return false;
    }
    return true;
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

  private handleDoNotTrack() {
    if (this.doNotTrack()) {
      this.logger.warn('Coveo Analytics tracking disabled due to doNotTrack');
      this.disable();
    }
  }

  private doNotTrack() {
    const doNotTrack = [true, 'yes', '1', 1].indexOf(navigator.doNotTrack || window.doNotTrack || (<any>navigator).msDoNotTrack);
    const globalPrivacyControl = (<any>navigator).globalPrivacyControl;
    return doNotTrack !== -1 || globalPrivacyControl;
  }
}
