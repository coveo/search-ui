import {SearchEndpoint} from '../../rest/SearchEndpoint';
import {ComponentOptions} from '../Base/ComponentOptions';
import {DeviceUtils} from '../../utils/DeviceUtils';
import {$$} from '../../utils/Dom';
import {DomUtils} from '../../utils/DomUtils';
import {Assert} from '../../misc/Assert';
import {QueryStateModel} from '../../models/QueryStateModel';
import {ComponentStateModel} from '../../models/ComponentStateModel';
import {ComponentOptionsModel} from '../../models/ComponentOptionsModel';
import {QueryController} from '../../controllers/QueryController';
import {Model, IAttributeChangedEventArg} from '../../models/Model';
import {QueryEvents, IBuildingQueryEventArgs, INewQueryEventArgs} from '../../events/QueryEvents';
import {IBeforeRedirectEventArgs, StandaloneSearchInterfaceEvents} from '../../events/StandaloneSearchInterfaceEvents';
import {HistoryController} from '../../controllers/HistoryController';
import {LocalStorageHistoryController} from '../../controllers/LocalStorageHistoryController';
import {InitializationEvents} from '../../events/InitializationEvents';
import {IAnalyticsClient} from '../Analytics/AnalyticsClient';
import {NoopAnalyticsClient} from '../Analytics/NoopAnalyticsClient';
import {Utils} from '../../utils/Utils';
import {RootComponent} from '../Base/RootComponent';
import {BaseComponent} from '../Base/BaseComponent';
import {Debug} from '../Debug/Debug';
import {HashUtils} from '../../utils/HashUtils';
import _ = require('underscore');

declare let FastClick;
declare let jstz;

export interface ISearchInterfaceOptions {
  enableHistory?: boolean;
  enableAutomaticResponsiveMode?: boolean;
  useLocalStorageForHistory?: boolean;
  resultsPerPage?: number;
  excerptLength?: number;
  expression?: string;
  filterField?: string;
  hideUntilFirstQuery?: boolean;
  firstLoadingAnimation?: HTMLElement;
  autoTriggerQuery?: boolean;
  timezone?: string;
  enableDebugInfo?: boolean;
  enableCollaborativeRating?: boolean;
  enableDuplicateFiltering?: boolean;
  pipeline?: string;
  maximumAge?: number;
  searchPageUri?: string;
  initOptions?: any;
  endpoint?: SearchEndpoint;
  originalOptionsObject?: any;
}

/**
 * This component is the root and main component of your search interface.<br/>
 * You should place every other component inside this component.<br/>
 * It is also on this component that you call the initialization function.<br/>
 * Since this component is the root of your search UI, it is recommended that you give it a unique HTML id attribute in order to reference it easily.
 */
export class SearchInterface extends RootComponent {
  static ID = 'SearchInterface';
  /**
   * The options for the search interface
   * @componentOptions
   */
  static options: ISearchInterfaceOptions = {
    /**
     * Specifies whether your search interface allows users to navigate in the search history using the browser back/forward buttons.<br/>
     * When enabled, the search interface saves the state of the current query in the hash portion of the URL.<br/>
     * For example #q=foobar.<br/>
     * The default value is `false`.
     */
    enableHistory: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies wether the UI should use an automatic responsive mode (eg : The tab(s) and facet(s) being placed automatically under the search box)<br/>
     * This can be disabled for design reasons, if it does not fit with the implementation needs.<br/>
     * The default value is `true`
     */
    enableAutomaticResponsiveMode: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies that you wish to use the local storage of the browser to store the state of the interface.<br/>
     * This can be used for very specific purpose, and only if you know what you are doing.<br/>
     * Default value is false.
     */
    useLocalStorageForHistory: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the number of results that each page displays.<br/>
     * Default is 10.
     */
    resultsPerPage: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 0 }),
    /**
     * Specifies the number of characters of the excerpt to get at query time and display for each query result.<br/>
     * This setting is global and can not be modified on a per result basis.<br/>
     * The default value is 200.
     */
    excerptLength: ComponentOptions.buildNumberOption({ defaultValue: 200, min: 0 }),
    /**
     * Specifies an expression to add to each query.<br/>
     * This should be use if you wish to add a global filter for your whole search interface that applies for all tab.<br/>
     * Do not use this for security concern ... (It's javascript after all).<br/>
     * By default none is added.
     */
    expression: ComponentOptions.buildStringOption({ defaultValue: '' }),
    /**
     * Specifies the name of a field to use as a custom filter when executing the query (also referred to as 'folding').<br/>
     * Setting this option causes the index to return only one result having any particular value inside the filter field. Any other matching result is 'folded' inside the childResults member of each JSON query result.<br/>
     * This feature is typically used with threaded conversations to include only one top-level result per conversation. Thus, the field specified in this option typically is a value unique to each thread that is shared by all items (e.g., posts, emails, etc.) in the thread.<br/>
     * This is obviously an advanced feature. Instead, look into using the {@link Folding} component, which covers a lot of different use cases.<br/>
     * By default none is added
     */
    filterField: ComponentOptions.buildStringOption({ defaultValue: '' }),
    /**
     * Specifies whether the interface should display a loading animation before the first query has completed successfully.<br/>
     * Note that if you set autoTriggerQuery to false, this means that the loading animation won't go away automatically.<br/>
     * Default is true.
     */
    hideUntilFirstQuery: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the animation that you wish to use for your interface.<br/>
     * This can be either a selector, or an element that matches the correct css class.<br/>
     * Eg : firstLoadingAnimation : '.CustomFirstLoadingAnimation' / data-first-loading-animation='.CustomFirstLoadingAnimation'.</br>
     * Eg : &lt;element class='CoveoSearchInterface'&gt;&lt;element class='coveo-first-loading-animation'/&gt;&lt;/element&gt;<br/>
     * By default, this will be a Coveo CSS animation (which can also be customized with css)
     */
    firstLoadingAnimation: ComponentOptions.buildChildHtmlElementOption({
      childSelector: '.coveo-first-loading-animation',
      defaultFunction: () => DomUtils.getBasicLoadingAnimation()
    }),
    /**
     * Specifies whether the init function should trigger the first query automatically when the page is loaded.<br/>
     * Note that if you set this to false, then the hideUntilFirstQuery option still applies. This means that the animation will still show until a query is triggered.<br/>
     * Default is true.
     */
    autoTriggerQuery: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    endpoint: ComponentOptions.buildCustomOption((endpoint) => endpoint != null && endpoint in SearchEndpoint.endpoints ? SearchEndpoint.endpoints[endpoint] : null, { defaultFunction: () => SearchEndpoint.endpoints['default'] }),
    /**
     * Specifies the timezone in which the search interface is loaded. This allows the index to recognize some special query syntax.<br/>
     * This must be an IANA zone info key (aka the Olson time zone database). For example : 'America/New_York'.<br/>
     * By default, we use a library that tries to detect the timezone automatically.<br/>
     */
    timezone: ComponentOptions.buildStringOption({ defaultFunction: () => jstz.determine().name() }),
    /**
     * Specifies whether to enable the feature that allows users to ALT + double click on any results to get the Debug page with a detailed view of all the properties and fields for a given result.<br/>
     * This has no security concern (as all those informations are visible to users through the browser developer console or by calling the Coveo API directly).<br/>
     * The default value is true.
     */
    enableDebugInfo: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies whether to enable the collaborative rating for the index and and include the user rating on each results to the normal index ranking.<br/>
     * If activated, this option can be leveraged with the {@link ResultRating} component.<br/>
     * The default value is false.
     */
    enableCollaborativeRating: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether to filter duplicates on the search results.<br/>
     * When true, duplicates do not appear in search results, but they however are included in facet counts, which can be sometimes confusing for the users. This is a limitation of the index.<br/>
     * Example: The user narrows a query to one document that has a duplicate. Only one document appears in search results, but the facet count is 2.<br/>
     * The default value is false.
     */
    enableDuplicateFiltering: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the name of the query pipeline to use for the queries. If not specified, the default value is default, which means the default query pipeline will be used.<br/>
     * You can use this parameter for example when your index is in a Coveo Cloud Organization where you created pipelines (see https://onlinehelp.coveo.com/en/cloud/creating_and_managing_query_pipelines.htm).<br/>
     * Default value is 'default'.
     */
    pipeline: ComponentOptions.buildStringOption(),
    /**
     * Specifies the maximum age in milliseconds that cached query results can have in order to be used (instead of performing a new query on the index).<br/>
     * If cached results are available but are older than the specified age, a new query will be performed on the index.<br/>
     * On high-volume public web sites, having a larger maximum age can greatly improve query response time at the cost of result freshness.<br/>
     * By default, the Coveo Search API will determine the cache length. This is typically 15 minutes.
     */
    maximumAge: ComponentOptions.buildNumberOption(),
    /**
     * Specifies the search page you wish to navigate to when instantiating a standalone search box interface.<br/>
     * By default this is undefined, meaning the search interface will not redirect.
     */
    searchPageUri: ComponentOptions.buildStringOption()
  };

  public static SMALL_INTERFACE_CLASS_NAME = 'coveo-small-search-interface';

  private attachedComponents: { [type: string]: BaseComponent[] };
  private isNewDesignAttribute = false;

  public root: HTMLElement;
  public queryStateModel: QueryStateModel;
  public componentStateModel: ComponentStateModel;
  public queryController: QueryController;
  public componentOptionsModel: ComponentOptionsModel;
  public usageAnalytics: IAnalyticsClient;

  /**
   * Create a new search interface. Initialize letious singleton for the interface (eg : Usage analytic, query controller, state model, etc.)<br/>
   * Bind event related to the query.<br/>
   * Will hide and show the loading animation, if activated.<br/>
   * @param element The HTMLElement on which the element will be instantiated. This cannot be an HTMLInputElement for technical reason
   * @param options The options for the querybox.
   * @param analyticsOptions The options for the analytics component. Since the analytics component is normally global, it needs to be passed at initialization of the whole interface
   * @param _window The window object for the search interface. Used for unit tests, which can pass a mock. Default is the global window object.
   */
  constructor(public element: HTMLElement, public options?: ISearchInterfaceOptions, public analyticsOptions?, _window = window) {
    super(element, SearchInterface.ID);

    if (DeviceUtils.isMobileDevice()) {
      $$(document.body).addClass('coveo-mobile-device');
    }

    FastClick.attach(element);

    this.options = ComponentOptions.initComponentOptions(element, SearchInterface, options);
    Assert.exists(element);
    Assert.exists(this.options);

    if (this.options.hideUntilFirstQuery) {
      this.showAndHideFirstQueryAnimation();
    }

    this.root = element;
    this.queryStateModel = new QueryStateModel(element);
    this.componentStateModel = new ComponentStateModel(element);
    this.componentOptionsModel = new ComponentOptionsModel(element);
    this.usageAnalytics = this.initializeAnalytics();
    this.queryController = new QueryController(element, this.options, this.usageAnalytics, this);


    let eventName = this.queryStateModel.getEventName(Model.eventTypes.preprocess);
    $$(this.element).on(eventName, (e, args) => this.handlePreprocessQueryStateModel(args));
    $$(this.element).on(QueryEvents.buildingQuery, (e, args) => this.handleBuildingQuery(args));

    if (this.options.enableHistory) {
      if (!this.options.useLocalStorageForHistory) {
        new HistoryController(element, _window, this.queryStateModel, this.queryController);
      } else {
        new LocalStorageHistoryController(element, _window, this.queryStateModel, this.queryController);
      }
    } else {
      $$(this.element).on(InitializationEvents.restoreHistoryState, () => this.queryStateModel.setMultiple(this.queryStateModel.defaultAttributes))
    }

    let eventNameQuickview = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.quickview);
    $$(this.element).on(eventNameQuickview, (e, args) => this.handleQuickviewChanged(args));
    // shows the UI, since it's been hidden while loading
    this.element.style.display = element.style.display || 'block';
    this.setupDebugInfo();
    this.isNewDesignAttribute = this.root.getAttribute('data-design') == 'new';
  }

  /**
   * Display the first query animation.<br/>
   * This is normally the Coveo logo with a css animation (which can be customized with options or css)
   */
  public showWaitAnimation() {
    $$(this.options.firstLoadingAnimation).detach();
    $$(this.element).addClass('coveo-waiting-for-first-query');
    this.element.appendChild(this.options.firstLoadingAnimation);
  }

  /**
   * Hide the first query animation.<br/>
   * This is normally the Coveo logo with a css animation (which can be customized with options or css)
   */
  public hideWaitAnimation() {
    $$(this.options.firstLoadingAnimation).detach();
    $$(this.element).removeClass('coveo-waiting-for-first-query');
  }

  /**
   * Attach a component to the interface. This allows the interface to easily list and traverse it's component.
   * @param type Normally a unique identifier without the Coveo prefix. Eg : CoveoFacet -> Facet, CoveoPager -> Pager, CoveoQuerybox -> Querybox, etc.
   * @param component The component instance to attach
   */
  public attachComponent(type: string, component: BaseComponent) {
    this.getComponents(type).push(component);
  }

  /**
   * Detach a component from the interface.
   * @param type Normally a unique identifier without the Coveo prefix. Eg : CoveoFacet -> Facet, CoveoPager -> Pager, CoveoQuerybox -> Querybox, etc.
   * @param component The component instance to detach
   */
  public detachComponent(type: string, component: BaseComponent) {
    let components = this.getComponents(type);
    let index = _.indexOf(components, component);
    if (index > -1) {
      components.splice(index, 1);
    }
  }

  /**
   * Return the bindings, or environment, for the current component
   * @returns {IComponentBindings}
   */
  public getBindings() {
    return {
      root: this.root,
      queryStateModel: this.queryStateModel,
      queryController: this.queryController,
      searchInterface: <SearchInterface>this,
      componentStateModel: this.componentStateModel,
      componentOptionsModel: this.componentOptionsModel,
      usageAnalytics: this.usageAnalytics
    };
  }

  /**
   * Get all the components for a given type
   * @param type Normally a unique identifier without the Coveo prefix. Eg : CoveoFacet -> Facet, CoveoPager -> Pager, CoveoQuerybox -> Querybox, etc.
   */
  public getComponents<T>(type: string): T[];
  /**
   * Get all the components for a given type
   * @param type Normally a unique identifier without the Coveo prefix. Eg : CoveoFacet -> Facet, CoveoPager -> Pager, CoveoQuerybox -> Querybox, etc.
   */
  public getComponents(type: string): BaseComponent[] {
    if (this.attachedComponents == null) {
      this.attachedComponents = {};
    }
    if (!(type in this.attachedComponents)) {
      this.attachedComponents[type] = [];
    }
    return this.attachedComponents[type];
  }

  /**
   * Determines whether the interface is using the new design.<br/>
   * This changes the rendering of multiple components.
   */
  public isNewDesign() {
    return this.isNewDesignAttribute;
  }

  public isSmallInterface(): boolean {
    return $$(this.root).hasClass(SearchInterface.SMALL_INTERFACE_CLASS_NAME);
  }

  public setSmallInterface(): void {
    $$(this.root).addClass(SearchInterface.SMALL_INTERFACE_CLASS_NAME);
  }

  public unsetSmallInterface(): void {
    $$(this.root).removeClass(SearchInterface.SMALL_INTERFACE_CLASS_NAME);
  }

  protected initializeAnalytics(): IAnalyticsClient {
    let analyticsRef = BaseComponent.getComponentRef('Analytics');
    if (analyticsRef) {
      return analyticsRef.create(this.element, this.analyticsOptions);
    }
    return new NoopAnalyticsClient();
  }

  private setupDebugInfo() {
    if (this.options.enableDebugInfo) {
      setTimeout(() => new Debug(this.element, this.queryController));
    }
  }

  private showAndHideFirstQueryAnimation() {
    this.showWaitAnimation();
    // On first query success or error, wait for call stack to finish, then remove the animation
    $$(this.element).one(QueryEvents.querySuccess, () => {
      _.defer(() => this.hideWaitAnimation());
    })
    $$(this.element).one(QueryEvents.queryError, () => {
      _.defer(() => this.hideWaitAnimation());
    })
  }

  private handlePreprocessQueryStateModel(args: any) {
    let tgFromModel = this.queryStateModel.get(QueryStateModel.attributesEnum.tg);
    let tFromModel = this.queryStateModel.get(QueryStateModel.attributesEnum.t);

    let tg = tgFromModel;
    let t = tFromModel;

    // if you want to set the tab group
    if (args.tg !== undefined) {
      args.tg = this.getTabGroupId(args.tg);
      if (tg != args.tg) {
        args.t = args.t || QueryStateModel.defaultAttributes.t;
        args.sort = args.sort || QueryStateModel.defaultAttributes.sort;
        tg = args.tg;
      }
    }

    if (args.t !== undefined) {
      args.t = this.getTabId(tg, args.t);
      if (t != args.t) {
        args.sort = args.sort || QueryStateModel.defaultAttributes.sort;
        t = args.t;
      }
    }

    if (args.sort !== undefined) {
      args.sort = this.getSort(t, args.sort);
    }

    if (args.quickview !== undefined) {
      args.quickview = this.getQuickview(args.quickview);
    }
  }

  private getTabGroupId(tabGroupId: string) {
    let tabGroupRef = BaseComponent.getComponentRef('TabGroup')
    if (tabGroupRef) {
      let tabGroups = this.getComponents<any>(tabGroupRef.ID);
      // check if the tabgroup is correct
      if (tabGroupId != QueryStateModel.defaultAttributes.tg && _.any(tabGroups, (tabGroup: any) => !tabGroup.disabled && tabGroupId == tabGroup.options.id)) {
        return tabGroupId;
      }
      // select the first tabGroup
      if (tabGroups.length > 0) {
        return tabGroups[0].options.id
      }
    }
    return QueryStateModel.defaultAttributes.tg;
  }

  private getTabId(tabGroupId: string, tabId: string) {
    let tabRef = BaseComponent.getComponentRef('Tab');
    let tabGroupRef = BaseComponent.getComponentRef('TabGroup');
    if (tabRef) {
      let tabs = this.getComponents<any>(tabRef.ID);
      if (tabGroupRef) {
        // if has a tabGroup
        if (tabGroupId != QueryStateModel.defaultAttributes.tg) {
          let tabGroups = this.getComponents<any>(tabGroupRef.ID);
          let tabGroup = _.find(tabGroups, (tabGroup: any) => tabGroupId == tabGroup.options.id);
          // check if the tabgroup contain this tab
          if (tabId != QueryStateModel.defaultAttributes.t && _.any(tabs, (tab: any) => tabId == tab.options.id && tabGroup.isElementIncludedInTabGroup(tab.element))) {
            return tabId;
          }
          // select the first tab in the tabGroup
          let tab = _.find(tabs, (tab: any) => tabGroup.isElementIncludedInTabGroup(tab.element));
          if (tab != null) {
            return tab.options.id;
          }
          return QueryStateModel.defaultAttributes.t;
        }
      }
      // check if the tab is correct
      if (tabId != QueryStateModel.defaultAttributes.t && _.any(tabs, (tab: any) => tabId == tab.options.id)) {
        return tabId;
      }
      // select the first tab
      if (tabs.length > 0) {
        return tabs[0].options.id
      }
    }
    return QueryStateModel.defaultAttributes.t;
  }

  private getSort(tabId: string, sortId: string) {
    let sortRef = BaseComponent.getComponentRef('Sort');
    if (sortRef) {
      let sorts = this.getComponents<any>(sortRef.ID);
      // if has a selected tab
      let tabRef = BaseComponent.getComponentRef('Tab');
      if (tabRef) {
        if (tabId != QueryStateModel.defaultAttributes.t) {
          let tabs = this.getComponents<any>(tabRef.ID);
          let tab = _.find(tabs, (tab: any) => tabId == tab.options.id);
          let sortCriteria = tab.options.sort;

          // check if the tab contain this sort
          if (sortId != QueryStateModel.defaultAttributes.sort && _.any(sorts, (sort: any) => tab.isElementIncludedInTab(sort.element) && sort.match(sortId))) {
            return sortId;
          } else if (sortCriteria != null) {
            // if not and tab.options.sort is set apply it
            return sortCriteria.toString();
          }
          // select the first sort in the tab
          let sort = _.find(sorts, (sort: any) => tab.isElementIncludedInTab(sort.element));
          if (sort != null) {
            return sort.options.sortCriteria[0].toString();
          }
          return QueryStateModel.defaultAttributes.sort;
        }
      }
      // check if the sort is correct
      if (sortId != QueryStateModel.defaultAttributes.sort && _.any(sorts, (sort: any) => sort.match(sortId))) {
        return sortId;
      }
      // select the first sort
      if (sorts.length > 0) {
        return sorts[0].options.sortCriteria[0].toString();
      }
    }
    return QueryStateModel.defaultAttributes.sort;
  }

  private getQuickview(quickviewId: string) {
    let quickviewRef = BaseComponent.getComponentRef('Quickview');
    if (quickviewRef) {
      let quickviews = this.getComponents<any>(quickviewRef.ID);
      if (_.any(quickviews, (quickview: any) => quickview.getHashId() == quickviewId)) {
        return quickviewId;
      }
    }
    return QueryStateModel.defaultAttributes.quickview;
  }

  private handleQuickviewChanged(args: IAttributeChangedEventArg) {
    let quickviewRef = BaseComponent.getComponentRef('Quickview');
    if (quickviewRef) {
      let quickviews = this.getComponents<any>(quickviewRef.ID);
      if (args.value != '') {
        let quickviewsPartition = _.partition(quickviews, (quickview) => quickview.getHashId() == args.value)
        if (quickviewsPartition[0].length != 0) {
          _.first(quickviewsPartition[0]).open();
          _.forEach(_.tail(quickviewsPartition[0]), (quickview) => quickview.close());
        }
        _.forEach(quickviewsPartition[1], (quickview) => quickview.close());
      } else {
        _.forEach(quickviews, (quickview) => {
          quickview.close()
        });
      }
    }
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    if (this.options.enableDuplicateFiltering) {
      data.queryBuilder.enableDuplicateFiltering = true;
    }

    if (!Utils.isNullOrUndefined(this.options.pipeline)) {
      data.queryBuilder.pipeline = this.options.pipeline;
    }

    if (!Utils.isNullOrUndefined(this.options.maximumAge)) {
      data.queryBuilder.maximumAge = this.options.maximumAge;
    }

    if (!Utils.isNullOrUndefined(this.options.resultsPerPage)) {
      data.queryBuilder.numberOfResults = this.options.resultsPerPage;
    }

    if (!Utils.isNullOrUndefined(this.options.excerptLength)) {
      data.queryBuilder.excerptLength = this.options.excerptLength;
    }

    if (Utils.isNonEmptyString(this.options.expression)) {
      data.queryBuilder.advancedExpression.add(this.options.expression);
    }

    if (Utils.isNonEmptyString(this.options.filterField)) {
      data.queryBuilder.filterField = this.options.filterField;
    }

    if (Utils.isNonEmptyString(this.options.timezone)) {
      data.queryBuilder.timezone = this.options.timezone;
    }

    data.queryBuilder.enableCollaborativeRating = this.options.enableCollaborativeRating;

    data.queryBuilder.enableDuplicateFiltering = this.options.enableDuplicateFiltering;
  }
}


export interface IStandaloneSearchInterfaceOptions extends ISearchInterfaceOptions {
  redirectIfEmpty?: boolean;
}

export class StandaloneSearchInterface extends SearchInterface {
  static ID = 'StandaloneSearchInterface'

  public static options: IStandaloneSearchInterfaceOptions = {
    redirectIfEmpty: ComponentOptions.buildBooleanOption({ defaultValue: true })
  }

  constructor(public element: HTMLElement, public options?: IStandaloneSearchInterfaceOptions, public analyticsOptions?, _window = window) {
    super(element, ComponentOptions.initComponentOptions(element, StandaloneSearchInterface, options), analyticsOptions, _window);
    $$(this.root).on(QueryEvents.newQuery, (e: Event, args: INewQueryEventArgs) => this.handleRedirect(e, args));
  }

  public handleRedirect(e: Event, data: INewQueryEventArgs) {

    let dataToSendOnBeforeRedirect: IBeforeRedirectEventArgs = {
      searchPageUri: this.options.searchPageUri,
      cancel: false
    }

    $$(this.root).trigger(StandaloneSearchInterfaceEvents.beforeRedirect, dataToSendOnBeforeRedirect);

    if (dataToSendOnBeforeRedirect.cancel) {
      return;
    }

    data.cancel = true;

    if (!this.searchboxIsEmpty() || this.options.redirectIfEmpty) {
      this.redirectToSearchPage(dataToSendOnBeforeRedirect.searchPageUri);
    }
  }

  public redirectToSearchPage(searchPage: string) {
    let stateValues = this.queryStateModel.getAttributes();
    let uaCausedBy = this.usageAnalytics.getCurrentEventCause();
    if (uaCausedBy != null) {
      stateValues['firstQueryCause'] = uaCausedBy;
    }
    let uaMeta = this.usageAnalytics.getCurrentEventMeta();
    if (uaMeta != null) {
      stateValues['firstQueryMeta'] = uaMeta;
    }
    window.location.href = searchPage + '#' + HashUtils.encodeValues(stateValues);
  }

  private searchboxIsEmpty(): boolean {
    return Utils.isEmptyString(this.queryStateModel.get(QueryStateModel.attributesEnum.q))
  }
}
