import { SearchEndpoint } from '../../rest/SearchEndpoint';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { $$ } from '../../utils/Dom';
import { DomUtils } from '../../utils/DomUtils';
import { Assert } from '../../misc/Assert';
import { QueryStateModel } from '../../models/QueryStateModel';
import { ComponentStateModel } from '../../models/ComponentStateModel';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import { QueryController } from '../../controllers/QueryController';
import { Model, IAttributeChangedEventArg } from '../../models/Model';
import { QueryEvents, IBuildingQueryEventArgs, INewQueryEventArgs, IQuerySuccessEventArgs, IQueryErrorEventArgs } from '../../events/QueryEvents';
import { IBeforeRedirectEventArgs, StandaloneSearchInterfaceEvents } from '../../events/StandaloneSearchInterfaceEvents';
import { HistoryController } from '../../controllers/HistoryController';
import { LocalStorageHistoryController } from '../../controllers/LocalStorageHistoryController';
import { InitializationEvents } from '../../events/InitializationEvents';
import { IAnalyticsClient } from '../Analytics/AnalyticsClient';
import { NoopAnalyticsClient } from '../Analytics/NoopAnalyticsClient';
import { Utils } from '../../utils/Utils';
import { RootComponent } from '../Base/RootComponent';
import { BaseComponent } from '../Base/BaseComponent';
import { Debug } from '../Debug/Debug';
import { HashUtils } from '../../utils/HashUtils';
import * as fastclick from 'fastclick';
import jstz = require('jstimezonedetect');
import { SentryLogger } from '../../misc/SentryLogger';
import { IComponentBindings } from '../Base/ComponentBindings';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { ResponsiveComponents } from '../ResponsiveComponents/ResponsiveComponents';
import _ = require('underscore');

export interface ISearchInterfaceOptions {
  enableHistory?: boolean;
  enableAutomaticResponsiveMode?: boolean;
  useLocalStorageForHistory?: boolean;
  resultsPerPage?: number;
  excerptLength?: number;
  expression?: string;
  filterField?: IFieldOption;
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
 * The SearchInterface component is the root and main component of your Coveo search interface. You should place all
 * other Coveo components inside the SearchInterface component.
 *
 * It is also on the HTMLElement of the SearchInterface component that you call the {@link init} function.
 *
 * It is advisable to specify a unique HTML `id` attribute for the SearchInterface component in order to be able to
 * reference it easily.
 *
 * **Example:**
 *
 * ```html
 * <head>
 *
 * [ ... ]
 *
 * <script>
 *   document.addEventListener('DOMContentLoaded', function() {
 *
 *     [ ... ]
 *     // The init function is called on the SearchInterface element, in this case, the body of the page.
 *     Coveo.init(document.body);
 *
 *     [ ... ]
 *
 *     });
 * </script>
 *
 * [ ... ]
 * </head>
 *
 * <!-- Specifying a unique HTML id attribute for the SearchInterface component is good practice. -->
 * <body id='search' class='CoveoSearchInterface' [ ... other options ... ]>
 *
 *   [ ... ]
 *
 *   <!-- You should place all other Coveo components here, inside the SearchInterface component. -->
 *
 *   [ ... ]
 *
 * </body>
 * ```
 */
export class SearchInterface extends RootComponent implements IComponentBindings {
  static ID = 'SearchInterface';

  /**
   * The options for the search interface
   * @componentOptions
   */
  static options: ISearchInterfaceOptions = {

    /**
     * Specifies whether to allow the end user to navigate search history using the **Back** and **Forward** buttons
     * of the browser.
     *
     * If this options is `true`, the SearchInterface component saves the state of the current query in the hash portion
     * of the URL when the user submits the query.
     *
     * **Example:**
     * > If the `enableHistory` option is `true` and the current query is `foobar`, the SearchInterface component
     * > saves `q=foobar` in the URL hash when the user submits the query.
     *
     * Default value is `false`.
     */
    enableHistory: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether to enable automatic responsive mode (i.e., automatically placing {@link Facet} and {@link Tab}
     * components in dropdown menus under the search box when the width of the SearchInterface HTML element reaches or
     * falls behind certain pixel thresholds).
     *
     * You might want to set this option to `false` if automatic responsive mode does not suit the specific design needs
     * of your implementation.
     *
     * **Note:**
     *
     * > If this option is `true`, you can also specify whether to enable responsive mode for Facet components (see
     * > {@link Facet.options.enableResponsiveMode}) and for Tab components (see
     * > {@link Tab.options.enableResponsiveMode}).
     * >
     * > In addition, you can specify the label you wish to display on the dropdown buttons (see
     * > {@link Facet.options.dropdownHeaderLabel} and {@link Tab.options.dropdownHeaderLabel}).
     * >
     * > Furthermore, it is possible to specify the pixel threshold at which Facet components will go in responsive
     * > mode (see {@link Facet.options.responsiveBreakpoint}.
     *
     * Default value is `true`.
     */
    enableAutomaticResponsiveMode: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to save the interface state in the local storage of the browser.
     *
     * You might want to set this option to `true` for reasons specifically important for your implementation.
     *
     * Default value is `false`.
     */
    useLocalStorageForHistory: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the number of results to display on each page.
     *
     * For more advanced features, see the {@link ResultsPerPage} component.
     *
     * Default value is `10`. Minimum value is `0`.
     */
    resultsPerPage: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 0 }),

    /**
     * Specifies the number of characters to get at query time to create an excerpt of the result.
     *
     * This setting is global and cannot be modified on a per-result basis.
     *
     * See also the {@link Excerpt} component.
     *
     * Default value is `200`. Minimum value is `0`.
     */
    excerptLength: ComponentOptions.buildNumberOption({ defaultValue: 200, min: 0 }),

    /**
     * Specifies an expression to add to each query.
     *
     * You might want to use this options to add a global filter to your entire search interface that applies for all
     * tabs.
     *
     * You should not use this option to address security concerns (it is JavaScript, after all).
     *
     * **Note:**
     *
     * > It also is possible to set this option separately for each {@link Tab} component
     * > (see {@link Tab.options.expression}).
     *
     * Default value is `''`.
     */
    expression: ComponentOptions.buildStringOption({ defaultValue: '' }),

    /**
     * Specifies the name of a field to use as a custom filter when executing the query (also referred to as
     * "folding").
     *
     * Setting a value for this option causes the index to return only one result having any particular value inside the
     * filter field. Any other matching result is "folded" inside the childResults member of each JSON query result.
     *
     * This feature is typically useful with threaded conversations to include only one top-level result per
     * conversation. Thus, the field you specify for this option will typically be value unique to each thread that is
     * shared by all items (e.g., posts, emails, etc) in the thread.
     *
     * For more advanced features, see the {@link Folding} component.
     *
     * Default value is `''`
     */
    filterField: ComponentOptions.buildFieldOption({ defaultValue: '' }),

    /**
     * Specifies whether to display a loading animation before the first query successfully returns.
     *
     * **Note:**
     *
     * > If you do not set this options to `false`, the loading animation will still run until the first query
     * > successfully returns even if {@link SearchInterface.options.autoTriggerQuery} is `false`.
     *
     * Default value is `true`.
     */
    hideUntilFirstQuery: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies the animation that you wish to use for your interface.
     *
     * This can be a selector or an HTML element that matches the correct CSS class (`coveo-first-loading-animation`).
     *
     * **Examples:**
     *
     * Specifying the animation using a CSS selector in the {@link init} call:
     * ```javascript
     * Coveo.init(document.querySelector('#search'), {
     *   SearchInterface : {
     *     firstLoadingAnimation : '.CustomFirstLoadingAnimation'
     *   }
     * }
     * ```
     *
     * Specifying the animation using a CSS selector in the markup:
     * ```html
     * <element id='search' class='CoveoSearchInterface data-first-loading-animation='.CustomFirstLoadingAnimation'>
     * ```
     *
     * Specifying the animation using an HTML element matching the correct CSS class:
     * ```html
     *   <element id='search' class='CoveoSearchInterface'>
     *     <element class='coveo-first-loading-animation'/>
     *   </element>
     * ```
     *
     * By default, the loading animation is a Coveo CSS animation (which you can customize with CSS).
     */
    firstLoadingAnimation: ComponentOptions.buildChildHtmlElementOption({
      childSelector: '.coveo-first-loading-animation',
      defaultFunction: () => DomUtils.getBasicLoadingAnimation()
    }),

    /**
     * Specifies whether to trigger the first query automatically when the page finishes loading.
     *
     *
     * **Note:**
     *
     * > If you set this option to `false` while {@link SearchInterface.options.hideUntilFirstQuery} is `true`, the
     * > loading animation will still run until the first query successfully returns.
     *
     * Default value is `true`.
     */
    autoTriggerQuery: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    endpoint: ComponentOptions.buildCustomOption((endpoint) => endpoint != null && endpoint in SearchEndpoint.endpoints ? SearchEndpoint.endpoints[endpoint] : null, { defaultFunction: () => SearchEndpoint.endpoints['default'] }),

    /**
     * Specifies the timezone in which the search interface is loaded. This allows the index to recognize some special
     * query syntax.
     *
     * This option must have a valid IANA zone info key (AKA the Olson time zone database) as its value.
     *
     * **Example:** `America/New_York`.
     *
     * By default, the search interface allows a library to try to detect the timezone automatically.
     */
    timezone: ComponentOptions.buildStringOption({ defaultFunction: () => jstz.determine().name() }),
    /**
     * Specifies whether to enable the feature that allows the end user to ALT + double click any result to open a debug
     * page with detailed information about all properties and fields for that result.
     *
     * Enabling this feature causes no security concern; the entire debug information is always visible to the end user
     * through the browser developer console or by calling the Coveo API directly.
     *
     * Default value is `true`.
     */
    enableDebugInfo: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to enable the collaborative rating for the index and to include user ratings on each results
     * in addition to the normal index ranking.
     *
     * If you set this option to `true`, you can leverage it with the {@link ResultRating} component.
     *
     * Default value is `false`.
     */
    enableCollaborativeRating: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether to filter duplicates in the search results.
     *
     * Setting this option to `true` forces duplicates to not appear in search results. However, {@link Facet} counts
     * still include the duplicates, which can be confusing for the end user. This is a limitation of the index.
     *
     * **Example:**
     *
     * > The end user narrows a query down to a single document that has a duplicate. If the enableDuplicateFiltering
     * > option is `true`, then only one document appears in the search results while the Facet count is still 2.
     *
     * **Note:**
     *
     * > It also is possible to set this option separately for each {@link Tab} component
     * > (see {@link Tab.options.enableDuplicateFiltering}).
     *
     * Default value is `false`.
     */
    enableDuplicateFiltering: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the name of the query pipeline to use for the queries.
     *
     * You can specify a value for this option if your index is in a Coveo Cloud organization in which pipelines have
     * been created (see [Managing Query Pipelines](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=128)).
     *
     * **Note:**
     *
     * > It also is possible to set this option separately for each {@link Tab} component
     * > (see {@link Tab.options.pipeline}).
     *
     * Default value is `undefined`, which means that the search interface uses the default pipeline.
     */
    pipeline: ComponentOptions.buildStringOption(),

    /**
     * Specifies the maximum age (in milliseconds) that cached query results can have to still be usable as results
     * instead of performing a new query on the index. The cache is located in the Coveo Search API (which resides
     * between the index and the search interface).
     *
     * If cached results that are older than the age you specify in this option are available, the framework will not
     * use these results; it will rather perform a new query on the index.
     *
     * On high-volume public web sites, specifying a higher value for this option can greatly improve query response
     * time at the cost of result freshness.
     *
     * **Note:**
     *
     * > It also is possible to set this option separately for each {@link Tab} component
     * > (see {@link Tab.options.maximumAge}).
     *
     * Default value is `undefined`, which means that the search interface lets the Coveo Search API determine the
     * maximum cache age. This is typically equivalent to 30 minutes (see
     * [Query Parameters - maximumAge](https://developers.coveo.com/x/iwEv#QueryParameters-maximumAge)).
     */
    maximumAge: ComponentOptions.buildNumberOption(),

    /**
     * Specifies the search page you wish to navigate to when instantiating a standalone search box interface.
     *
     * Default value is `undefined`, which means that the search interface does not redirect.
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
   * Allow to get and set the different breakpoint for mobile and tablet devices.
   *
   * This is useful, amongst other, for {@link Facet}, {@link Tab} and {@link ResultList}
   */
  public responsiveComponents: ResponsiveComponents;

  /**
   * Creates a new SearchInterface. Initialize various singletons for the interface (e.g., usage analytics, query
   * controller, state model, etc.). Binds events related to the query. Hides and shows the loading animation, if
   * activated (see {@link SearchInterface.options.hideUntilFirstQuery}).
   * @param element The HTMLElement on which to instantiate the component. This cannot be an `HTMLInputElement` for
   * technical reasons.
   * @param options The options for the SearchInterface.
   * @param analyticsOptions The options for the {@link Analytics} component. Since the Analytics component is normally
   * global, it needs to be passed at initialization of the whole interface.
   * @param _window The window object for the search interface. Used for unit tests, which can pass a mock. Default is
   * the global window object.
   */
  constructor(public element: HTMLElement, public options?: ISearchInterfaceOptions, public analyticsOptions?, _window = window) {
    super(element, SearchInterface.ID);

    if (DeviceUtils.isMobileDevice()) {
      $$(document.body).addClass('coveo-mobile-device');
    }

    // The definition file for fastclick does not match the way that fast click gets loaded (AMD)
    if ((<any>fastclick).attach) {
      (<any>fastclick).attach(element);
    }


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
    new SentryLogger(this.queryController);

    let eventName = this.queryStateModel.getEventName(Model.eventTypes.preprocess);
    $$(this.element).on(eventName, (e, args) => this.handlePreprocessQueryStateModel(args));
    $$(this.element).on(QueryEvents.buildingQuery, (e, args) => this.handleBuildingQuery(args));
    $$(this.element).on(QueryEvents.querySuccess, (e, args) => this.handleQuerySuccess(args));
    $$(this.element).on(QueryEvents.queryError, (e, args) => this.handleQueryError(args));

    if (this.options.enableHistory) {
      if (!this.options.useLocalStorageForHistory) {
        new HistoryController(element, _window, this.queryStateModel, this.queryController);
      } else {
        new LocalStorageHistoryController(element, _window, this.queryStateModel, this.queryController);
      }
    } else {
      $$(this.element).on(InitializationEvents.restoreHistoryState, () => this.queryStateModel.setMultiple(this.queryStateModel.defaultAttributes));
    }

    let eventNameQuickview = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.quickview);
    $$(this.element).on(eventNameQuickview, (e, args) => this.handleQuickviewChanged(args));
    // shows the UI, since it's been hidden while loading
    this.element.style.display = element.style.display || 'block';
    this.setupDebugInfo();
    this.isNewDesignAttribute = this.root.getAttribute('data-design') == 'new';
    this.responsiveComponents = new ResponsiveComponents();
  }

  /**
   * Displays the first query animation (see {@link SearchInterface.options.firstLoadingAnimation}).
   *
   * By default, this is the Coveo logo with a CSS animation (which can be customized with options or CSS).
   */
  public showWaitAnimation() {
    $$(this.options.firstLoadingAnimation).detach();
    $$(this.element).addClass('coveo-waiting-for-first-query');
    this.element.appendChild(this.options.firstLoadingAnimation);
  }

  /**
   * Hides the first query animation (see {@link SearchInterface.options.firstLoadingAnimation}).
   *
   * By default, this is the Coveo logo with a CSS animation (which can be customized with options or CSS).
   */
  public hideWaitAnimation() {
    $$(this.options.firstLoadingAnimation).detach();
    $$(this.element).removeClass('coveo-waiting-for-first-query');
  }

  /**
   * Attaches a component to the search interface. This allows the search interface to easily list and iterate over its
   * components.
   * @param type Normally, the component type is a unique identifier without the `Coveo` prefix (e.g., `CoveoFacet` ->
   * `Facet`, `CoveoPager` -> `Pager`, `CoveoQuerybox` -> `Querybox`, etc.).
   * @param component The component instance to attach.
   */
  public attachComponent(type: string, component: BaseComponent) {
    this.getComponents(type).push(component);
  }

  /**
   * Detaches a component from the search interface.
   * @param type Normally, the component type is a unique identifier without the `Coveo` prefix (e.g., `CoveoFacet` ->
   * `Facet`, `CoveoPager` -> `Pager`, `CoveoQuerybox` -> `Querybox`, etc.).
   * @param component The component instance to detach.
   */
  public detachComponent(type: string, component: BaseComponent) {
    let components = this.getComponents(type);
    let index = _.indexOf(components, component);
    if (index > -1) {
      components.splice(index, 1);
    }
  }

  /**
   * Returns the bindings, or environment, for the current component.
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
   * Gets all the components of a given type.
   * @param type Normally, the component type is a unique identifier without the `Coveo` prefix (e.g., `CoveoFacet` ->
   * `Facet`, `CoveoPager` -> `Pager`, `CoveoQuerybox` -> `Querybox`, etc.).
   */
  public getComponents<T>(type: string): T[];

  /**
   * Gets all the components of a given type.
   * @param type Normally, the component type is a unique identifier without the `Coveo` prefix (e.g., `CoveoFacet` ->
   * `Facet`, `CoveoPager` -> `Pager`, `CoveoQuerybox` -> `Querybox`, etc.).
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
   * Indicates whether the search interface is using the new design.
   * This changes the rendering of multiple components.
   */
  public isNewDesign() {
    return this.isNewDesignAttribute;
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
    });
    $$(this.element).one(QueryEvents.queryError, () => {
      _.defer(() => this.hideWaitAnimation());
    });
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
    let tabGroupRef = BaseComponent.getComponentRef('TabGroup');
    if (tabGroupRef) {
      let tabGroups = this.getComponents<any>(tabGroupRef.ID);
      // check if the tabgroup is correct
      if (tabGroupId != QueryStateModel.defaultAttributes.tg && _.any(tabGroups, (tabGroup: any) => !tabGroup.disabled && tabGroupId == tabGroup.options.id)) {
        return tabGroupId;
      }
      // select the first tabGroup
      if (tabGroups.length > 0) {
        return tabGroups[0].options.id;
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
        return tabs[0].options.id;
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
        let quickviewsPartition = _.partition(quickviews, (quickview) => quickview.getHashId() == args.value);
        if (quickviewsPartition[0].length != 0) {
          _.first(quickviewsPartition[0]).open();
          _.forEach(_.tail(quickviewsPartition[0]), (quickview) => quickview.close());
        }
        _.forEach(quickviewsPartition[1], (quickview) => quickview.close());
      } else {
        _.forEach(quickviews, (quickview) => {
          quickview.close();
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

    if (Utils.isNonEmptyString(<string>this.options.filterField)) {
      data.queryBuilder.filterField = <string>this.options.filterField;
    }

    if (Utils.isNonEmptyString(this.options.timezone)) {
      data.queryBuilder.timezone = this.options.timezone;
    }

    data.queryBuilder.enableCollaborativeRating = this.options.enableCollaborativeRating;

    data.queryBuilder.enableDuplicateFiltering = this.options.enableDuplicateFiltering;
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    let noResults = data.results.results.length == 0;
    this.toggleSectionState('coveo-no-results', noResults);
    let resultsHeader = $$(this.element).find('.coveo-results-header');
    if (resultsHeader) {
      $$(resultsHeader).removeClass('coveo-query-error');
    }
  }

  private handleQueryError(data: IQueryErrorEventArgs) {
    this.toggleSectionState('coveo-no-results');
    let resultsHeader = $$(this.element).find('.coveo-results-header');
    if (resultsHeader) {
      $$(resultsHeader).addClass('coveo-query-error');
    }
  }

  private toggleSectionState(cssClass: string, toggle = true) {
    let facetSection = $$(this.element).find('.coveo-facet-column');
    let resultsSection = $$(this.element).find('.coveo-results-column');
    let resultsHeader = $$(this.element).find('.coveo-results-header');
    let facetSearchs = $$(this.element).findAll('.coveo-facet-search-results');

    if (facetSection) {
      $$(facetSection).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
    }
    if (resultsSection) {
      $$(resultsSection).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
    }
    if (resultsHeader) {
      $$(resultsHeader).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
    }
    if (facetSearchs && facetSearchs.length > 0) {
      _.each(facetSearchs, (facetSearch) => {
        $$(facetSearch).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
      });
    }
  }
}


export interface IStandaloneSearchInterfaceOptions extends ISearchInterfaceOptions {
  redirectIfEmpty?: boolean;
}

export class StandaloneSearchInterface extends SearchInterface {
  static ID = 'StandaloneSearchInterface';

  public static options: IStandaloneSearchInterfaceOptions = {
    redirectIfEmpty: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  constructor(public element: HTMLElement, public options?: IStandaloneSearchInterfaceOptions, public analyticsOptions?, public _window = window) {
    super(element, ComponentOptions.initComponentOptions(element, StandaloneSearchInterface, options), analyticsOptions, _window);
    $$(this.root).on(QueryEvents.newQuery, (e: Event, args: INewQueryEventArgs) => this.handleRedirect(e, args));
  }

  public handleRedirect(e: Event, data: INewQueryEventArgs) {

    let dataToSendOnBeforeRedirect: IBeforeRedirectEventArgs = {
      searchPageUri: this.options.searchPageUri,
      cancel: false
    };

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
      // for legacy reason, searchbox submit were always logged a search from link in an external search box.
      // transform them if that's what we hit.
      if (uaCausedBy == analyticsActionCauseList.searchboxSubmit.name) {
        uaCausedBy = analyticsActionCauseList.searchFromLink.name;
      }
      stateValues['firstQueryCause'] = uaCausedBy;
    }
    let uaMeta = this.usageAnalytics.getCurrentEventMeta();
    if (uaMeta != null) {
      stateValues['firstQueryMeta'] = uaMeta;
    }

    let link = document.createElement('a');
    link.href = searchPage;

    // By using a setTimeout, we allow other possible code related to the search box / magic box time to complete.
    // eg: onblur of the magic box.
    setTimeout(() => {
      this._window.location.href = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash ? link.hash + '&' : '#'}${HashUtils.encodeValues(stateValues)}`;
    }, 0);
  }

  private searchboxIsEmpty(): boolean {
    return Utils.isEmptyString(this.queryStateModel.get(QueryStateModel.attributesEnum.q));
  }
}
