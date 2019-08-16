import * as jstz from 'jstimezonedetect';
import 'styling/Globals';
import 'styling/_SearchButton';
import 'styling/_SearchInterface';
import 'styling/_SearchModalBox';
import { any, chain, each, find, first, indexOf, isEmpty, partition, tail } from 'underscore';
import { HistoryController } from '../../controllers/HistoryController';
import { IHistoryManager } from '../../controllers/HistoryManager';
import { LocalStorageHistoryController } from '../../controllers/LocalStorageHistoryController';
import { NoopHistoryController } from '../../controllers/NoopHistoryController';
import { QueryController } from '../../controllers/QueryController';
import { InitializationEvents } from '../../events/InitializationEvents';
import {
  IBuildingQueryEventArgs,
  IDoneBuildingQueryEventArgs,
  INewQueryEventArgs,
  IQueryErrorEventArgs,
  IQuerySuccessEventArgs,
  QueryEvents
} from '../../events/QueryEvents';
import { IBeforeRedirectEventArgs, StandaloneSearchInterfaceEvents } from '../../events/StandaloneSearchInterfaceEvents';
import { Assert } from '../../misc/Assert';
import { SentryLogger } from '../../misc/SentryLogger';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import { ComponentStateModel } from '../../models/ComponentStateModel';
import { IAttributeChangedEventArg, Model } from '../../models/Model';
import { QueryStateModel, QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { SearchEndpoint } from '../../rest/SearchEndpoint';
import { ComponentsTypes } from '../../utils/ComponentsTypes';
import { $$ } from '../../utils/Dom';
import { HashUtils } from '../../utils/HashUtils';
import { Utils } from '../../utils/Utils';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { IAnalyticsClient } from '../Analytics/AnalyticsClient';
import { NoopAnalyticsClient } from '../Analytics/NoopAnalyticsClient';
import { AriaLive, IAriaLive } from '../AriaLive/AriaLive';
import { BaseComponent } from '../Base/BaseComponent';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption, IQueryExpression } from '../Base/ComponentOptions';
import { InitializationPlaceholder } from '../Base/InitializationPlaceholder';
import { RootComponent } from '../Base/RootComponent';
import { Debug } from '../Debug/Debug';
import { MissingTermManager } from '../MissingTerm/MissingTermManager';
import { Context, IPipelineContextProvider } from '../PipelineContext/PipelineGlobalExports';
import {
  MEDIUM_SCREEN_WIDTH,
  ResponsiveComponents,
  SMALL_SCREEN_WIDTH,
  ValidResponsiveMode
} from '../ResponsiveComponents/ResponsiveComponents';
import { FacetColumnAutoLayoutAdjustment } from './FacetColumnAutoLayoutAdjustment';
import { FacetValueStateHandler } from './FacetValueStateHandler';
import RelevanceInspectorModule = require('../RelevanceInspector/RelevanceInspector');
import { OmniboxAnalytics } from '../Omnibox/OmniboxAnalytics';

export interface ISearchInterfaceOptions {
  enableHistory?: boolean;
  enableAutomaticResponsiveMode?: boolean;
  useLocalStorageForHistory?: boolean;
  resultsPerPage?: number;
  excerptLength?: number;
  expression?: IQueryExpression;
  filterField?: IFieldOption;
  autoTriggerQuery?: boolean;
  timezone?: string;
  enableDebugInfo?: boolean;
  enableCollaborativeRating?: boolean;
  enableDuplicateFiltering?: boolean;
  hideUntilFirstQuery?: boolean;
  firstLoadingAnimation?: any;
  pipeline?: string;
  maximumAge?: number;
  searchPageUri?: string;
  initOptions?: any;
  endpoint?: SearchEndpoint;
  originalOptionsObject?: any;
  allowQueriesWithoutKeywords?: boolean;
  responsiveMediumBreakpoint?: number;
  responsiveSmallBreakpoint?: number;
  responsiveMode?: ValidResponsiveMode;
}

export interface IMissingTermManagerArgs {
  element: HTMLElement;
  queryStateModel: QueryStateModel;
  queryController: QueryController;
  usageAnalytics: IAnalyticsClient;
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
     * falls behind a certain pixel threshold).
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
     * **Note:**
     *
     * > When the {@link ResultsPerPage} component is present in the page, this option gets overridden and is useless.
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
    expression: ComponentOptions.buildQueryExpressionOption({ defaultValue: '' }),

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
     * Default value is the empty string (`''`).
     */
    filterField: ComponentOptions.buildFieldOption({ defaultValue: '' }),

    /**
     * Specifies whether to display a loading animation before the first query successfully returns.
     *
     * **Note:**
     *
     * > If you do not set this options to `false`, the loading animation will still run until the first query
     * > successfully returns even if the [autoTriggerQuery]{@link SearchInterface.options.autoTriggerQuery} option is
     * `false`.
     *
     * See also the [firstLoadingAnimation]{@link SearchInterface.options.firstLoadingAnimation} option.
     *
     * Default value is `true`.
     *
     * @deprecated This option is exposed for legacy reasons. Since the
     * [July 2017 Release (v2.2900.23)](https://developers.coveo.com/x/gSMvAg), the loading animation is composed of
     * placeholders, making this option is obsolete.
     */
    hideUntilFirstQuery: ComponentOptions.buildBooleanOption({
      deprecated: 'Exposed for legacy reasons. The loading animation is now composed of placeholders, and this option is obsolete.'
    }),

    /**
     * Specifies the animation that you wish to display while your interface is loading.
     *
     * You can either specify the CSS selector of an HTML element that matches the default CSS class
     * (`coveo-first-loading-animation`), or add `-selector` to the markup attribute of this option to specify the CSS
     * selector of an HTML element that matches any CSS class.
     *
     * See also the [hideUntilFirstQuery]{@link SearchInterface.options.hideUntilFirstQuery} option.
     *
     * **Examples:**
     *
     * In this first case, the SearchInterface uses the HTML element whose `id` attribute is `MyAnimation` as the
     * loading animation only if the `class` attribute of this element also matches `coveo-first-loading-animation`.
     * Default loading animation CSS, which you can customize as you see fit, applies to this HTML element.
     * ```html
     * <div class='CoveoSearchInterface' data-first-loading-animation='#MyAnimation'>
     *   <div id='MyAnimation' class='coveo-first-loading-animation'>
     *     <!-- ... -->
     *   </div>
     *   <!-- ... -->
     * </div>
     * ```
     *
     * In this second case, the SearchInterface uses the HTML element whose `id` attribute is `MyAnimation` as the
     * loading animation no matter what CSS class it matches. However, if the `class` attribute of the HTML element does
     * not match `coveo-first-loading-animation`, no default loading animation CSS applies to this HTML element.
     * Normally, you should only use `data-first-loading-animation-selector` if you want to completely override the
     * default loading animation CSS.
     * ```html
     * <div class='CoveoSearchInterface' data-first-loading-animation-selector='#MyAnimation'>
     *   <div id='MyAnimation' class='my-custom-loading-animation-class'>
     *     <!-- ... -->
     *   </div>
     *   <!-- ... -->
     * </div>
     * ```
     *
     * By default, the loading animation is a Coveo CSS animation (which you can customize with CSS).
     *
     * @deprecated This option is exposed for legacy reasons. Since the
     * [July 2017 Release (v2.2900.23)](https://developers.coveo.com/x/gSMvAg), the loading animation is composed of
     * placeholders, making this option is obsolete.
     */
    firstLoadingAnimation: ComponentOptions.buildChildHtmlElementOption({
      deprecated: 'Exposed for legacy reasons. The loading animation is now composed of placeholder, and this options is obsolete.'
    }),

    /**
     * Specifies whether to trigger the first query automatically when the page finishes loading.
     *
     * Default value is `true`.
     */
    autoTriggerQuery: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies if the search interface should perform queries when no keywords are entered by the end user.
     *
     * When this option is set to true, the interface will initially only load with the search box, as long as you have a search box component in your interface.
     *
     * Once the user submits a query, the full search interface loads to display the results.
     *
     * When using the Coveo for Salesforce Free edition, this option is automatically set to false, and should not be changed.
     *
     * This option interacts closely with the {@link SearchInterface.options.autoTriggerQuery} option, as the automatic query is not triggered when there are no keywords.
     *
     * It also modifies the {@link IQuery.allowQueriesWithoutKeywords} query parameter.
     *
     * Default value is `true`, except in Coveo for Salesforce Free edition in which it is `false`.
     */
    allowQueriesWithoutKeywords: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    endpoint: ComponentOptions.buildCustomOption(
      endpoint => (endpoint != null && endpoint in SearchEndpoint.endpoints ? SearchEndpoint.endpoints[endpoint] : null),
      { defaultFunction: () => SearchEndpoint.endpoints['default'] }
    ),

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
     * **Note:**
     *
     * > The Coveo Cloud V2 platform does not support collaborative rating. Therefore, this option is obsolete in Coveo Cloud V2.
     *
     * Specifies whether to enable collaborative rating, which you can leverage using the
     * [`ResultRating`]{@link ResultRating} component.
     *
     * Setting this option to `true` has no effect unless collaborative rating is also enabled on your Coveo index.
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
     * > The end user narrows a query down to a single item that has a duplicate. If the enableDuplicateFiltering
     * > option is `true`, then only one item appears in the search results while the Facet count is still 2.
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
    searchPageUri: ComponentOptions.buildStringOption(),
    /**
     * Specifies the search interface width that should be considered "medium" size, in pixels.
     *
     * When the width of the window/device that displays the search page reaches or falls short of this threshold (but still exceeds the [responsiveSmallBreakpoint]{@link SearchInterface.options.responsiveSmallBreakpoint} value), the search page layout will change so that, for instance, facets within the element that has the coveo-facet-column class will be accessible from a dropdown menu on top of the result list rather than being fully rendered next to the result list.
     *
     * This option is only taken into account when [enableAutomaticResponsiveMode]{@link SearchInterface.options.enableAutomaticResponsiveMode} is set to true.
     *
     * Default value is `800`.
     */
    responsiveMediumBreakpoint: ComponentOptions.buildNumberOption({
      defaultValue: MEDIUM_SCREEN_WIDTH,
      depend: 'enableAutomaticResponsiveMode'
    }),
    /**
     * Specifies the search interface width that should be considered "small" size, in pixels.
     *
     * When the width of the window/device that displays the search page reaches or falls short of this threshold, the search page layout will change so that, for instance, some result list layouts which are not suited for being rendered on a small screen/area will be disabled.
     *
     * This option is only taken into account when [enableAutomaticResponsiveMode]{@link SearchInterface.options.enableAutomaticResponsiveMode} is set to true.
     *
     * Default value is `480`.
     */
    responsiveSmallBreakpoint: ComponentOptions.buildNumberOption({
      defaultValue: SMALL_SCREEN_WIDTH,
      depend: 'enableAutomaticResponsiveMode'
    }),
    /**
     * Specifies the search interface responsive mode that should be used.
     *
     * When the mode is auto, the width of the window/device that displays the search page is used to determine which layout the search page should use
     * (see [enableAutomaticResponsiveMode]{@link SearchInterface.options.enableAutomaticResponsiveMode}, [responsiveMediumBreakpoint]{@link SearchInterface.options.responsiveMediumBreakpoint}
     * and [responsiveSmallBreakpoint{@link SearchInterface.options.responsiveSmallBreakpoint}])
     *
     * When it's not on auto, the width is ignored and the the layout used depends on this option
     * (e.g. If set to "small", then the search interface layout will be the same as if it was on a narrow window/device)
     */
    responsiveMode: ComponentOptions.buildCustomOption<ValidResponsiveMode>(
      value => {
        // Validator function for the string passed, verify it's one of the accepted values.
        if (value === 'auto' || value === 'small' || value === 'medium' || value === 'large') {
          return value;
        } else {
          console.warn(`${value} is not a proper value for responsiveMode, auto has been used instead.`);
          return 'auto';
        }
      },
      {
        defaultValue: 'auto'
      }
    )
  };

  public static SMALL_INTERFACE_CLASS_NAME = 'coveo-small-search-interface';

  public root: HTMLElement;
  public queryStateModel: QueryStateModel;
  public componentStateModel: ComponentStateModel;
  public queryController: QueryController;
  public componentOptionsModel: ComponentOptionsModel;
  public usageAnalytics: IAnalyticsClient;
  public historyManager: IHistoryManager;
  /**
   * Allows to get and set the different breakpoints for mobile and tablet devices.
   *
   * This is useful, amongst other, for {@link Facet}, {@link Tab} and {@link ResultList}
   */
  public responsiveComponents: ResponsiveComponents;
  public isResultsPerPageModifiedByPipeline = false;
  public ariaLive: IAriaLive;

  private attachedComponents: { [type: string]: BaseComponent[] };
  private facetValueStateHandler: FacetValueStateHandler;
  private queryPipelineConfigurationForResultsPerPage: number;
  private relevanceInspector: RelevanceInspectorModule.RelevanceInspector;
  private omniboxAnalytics: OmniboxAnalytics;

  /**
   * Creates a new SearchInterface. Initialize various singletons for the interface (e.g., usage analytics, query
   * controller, state model, etc.). Binds events related to the query.
   * @param element The HTMLElement on which to instantiate the component. This cannot be an `HTMLInputElement` for
   * technical reasons.
   * @param options The options for the SearchInterface.
   * @param analyticsOptions The options for the {@link Analytics} component. Since the Analytics component is normally
   * global, it needs to be passed at initialization of the whole interface.
   * @param _window The window object for the search interface. Used for unit tests, which can pass a mock. Default is
   * the global window object.
   */
  constructor(public element: HTMLElement, public options?: ISearchInterfaceOptions, public analyticsOptions?, public _window = window) {
    super(element, SearchInterface.ID);

    this.options = ComponentOptions.initComponentOptions(element, SearchInterface, options);
    Assert.exists(element);
    Assert.exists(this.options);
    this.root = element;

    this.setupQueryMode();

    this.queryStateModel = new QueryStateModel(element);
    this.componentStateModel = new ComponentStateModel(element);
    this.componentOptionsModel = new ComponentOptionsModel(element);
    this.usageAnalytics = this.initializeAnalytics();
    this.queryController = new QueryController(element, this.options, this.usageAnalytics, this);
    this.facetValueStateHandler = new FacetValueStateHandler(this.element);
    new SentryLogger(this.queryController);

    const missingTermManagerArgs: IMissingTermManagerArgs = {
      element: this.element,
      queryStateModel: this.queryStateModel,
      queryController: this.queryController,
      usageAnalytics: this.usageAnalytics
    };

    new MissingTermManager(missingTermManagerArgs);
    this.omniboxAnalytics = new OmniboxAnalytics();

    this.setupEventsHandlers();
    this.setupHistoryManager(element, _window);

    this.element.style.display = element.style.display || 'block';

    this.setupDebugInfo();
    this.setupResponsiveComponents();
    this.ariaLive = new AriaLive(element);
  }

  public set resultsPerPage(resultsPerPage: number) {
    this.options.resultsPerPage = this.queryController.options.resultsPerPage = resultsPerPage;
  }

  public get resultsPerPage() {
    if (this.queryPipelineConfigurationForResultsPerPage != null && this.queryPipelineConfigurationForResultsPerPage != 0) {
      return this.queryPipelineConfigurationForResultsPerPage;
    }
    if (this.queryController.options.resultsPerPage != null && this.queryController.options.resultsPerPage != 0) {
      return this.queryController.options.resultsPerPage;
    }
    // Things would get weird if somehow the number of results per page was set to 0 or not available.
    // Specially for the pager component. As such, we try to cover that corner case.
    this.logger.warn('Results per page is incoherent in the search interface.', this);
    return 10;
  }

  public getOmniboxAnalytics() {
    return this.omniboxAnalytics;
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
    const components = this.getComponents(type);
    const index = indexOf(components, component);
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
   * Gets the query context for the current search interface.
   *
   * If the search interface has performed at least one query, it will try to resolve the context from the last query sent to the Coveo Search API.
   *
   * If the search interface has not performed a query yet, it will try to resolve the context from any avaiable {@link PipelineContext} component.
   *
   * If multiple {@link PipelineContext} components are available, it will merge all context values together.
   *
   * **Note:**
   * Having multiple PipelineContext components in the same search interface is not recommended, especially if some context keys are repeated across those components.
   *
   * If no context is found, returns `undefined`
   */
  public getQueryContext(): Context {
    let ret: Context;

    const lastQuery = this.queryController.getLastQuery();
    if (lastQuery.context) {
      ret = lastQuery.context;
    } else {
      const pipelines = this.getComponents<IPipelineContextProvider>('PipelineContext');

      if (pipelines && !isEmpty(pipelines)) {
        const contextMerged = chain(pipelines)
          .map(pipeline => pipeline.getContext())
          .reduce((memo, context) => ({ ...memo, ...context }), {})
          .value();
        if (!isEmpty(contextMerged)) {
          ret = contextMerged;
        }
      }
    }

    return ret;
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
   * Detaches from the SearchInterface every component that is inside the given element.
   * @param element
   */
  public detachComponentsInside(element: HTMLElement) {
    each(this.attachedComponents, (components, type) => {
      components
        .filter(component => element != component.element && element.contains(component.element))
        .forEach(component => this.detachComponent(type, component));
    });
  }

  protected initializeAnalytics(): IAnalyticsClient {
    const analyticsRef = BaseComponent.getComponentRef('Analytics');
    if (analyticsRef) {
      return analyticsRef.create(this.element, this.analyticsOptions, this.getBindings());
    }
    return new NoopAnalyticsClient();
  }

  private setupHistoryManager(element: HTMLElement, _window: Window) {
    if (!this.options.enableHistory) {
      this.historyManager = new NoopHistoryController();

      $$(this.element).on(InitializationEvents.restoreHistoryState, () =>
        this.queryStateModel.setMultiple({ ...this.queryStateModel.defaultAttributes })
      );
      return;
    }

    if (this.options.useLocalStorageForHistory) {
      this.historyManager = new LocalStorageHistoryController(element, _window, this.queryStateModel, this.queryController);
      return;
    }

    this.historyManager = new HistoryController(element, _window, this.queryStateModel, this.queryController, this.usageAnalytics);
  }

  private setupQueryMode() {
    if (this.options.allowQueriesWithoutKeywords) {
      this.initializeEmptyQueryAllowed();
    } else {
      this.initializeEmptyQueryNotAllowed();
    }
  }

  private setupEventsHandlers() {
    const eventName = this.queryStateModel.getEventName(Model.eventTypes.preprocess);
    $$(this.element).on(eventName, (e, args) => this.handlePreprocessQueryStateModel(args));
    $$(this.element).on(QueryEvents.buildingQuery, (e, args) => this.handleBuildingQuery(args));
    $$(this.element).on(QueryEvents.querySuccess, (e, args) => this.handleQuerySuccess(args));
    $$(this.element).on(QueryEvents.queryError, (e, args) => this.handleQueryError(args));
    $$(this.element).on(InitializationEvents.afterComponentsInitialization, () => this.handleAfterComponentsInitialization());
    const debugChanged = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.debug);
    $$(this.element).on(debugChanged, (e, args: IAttributeChangedEventArg) => this.handleDebugModeChange(args));

    this.queryStateModel.registerNewAttribute(QueryStateModel.attributesEnum.fv, {});

    const eventNameQuickview = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.quickview);
    $$(this.element).on(eventNameQuickview, (e, args) => this.handleQuickviewChanged(args));
  }

  private setupDebugInfo() {
    if (this.options.enableDebugInfo) {
      setTimeout(() => new Debug(this.element, this.getBindings()));
    }
  }

  private setupResponsiveComponents() {
    this.responsiveComponents = new ResponsiveComponents();
    this.responsiveComponents.setMediumScreenWidth(this.options.responsiveMediumBreakpoint);
    this.responsiveComponents.setSmallScreenWidth(this.options.responsiveSmallBreakpoint);
    this.responsiveComponents.setResponsiveMode(this.options.responsiveMode);
  }

  private handleDebugModeChange(args: IAttributeChangedEventArg) {
    if (args.value && !this.relevanceInspector && this.options.enableDebugInfo) {
      require.ensure(
        ['../RelevanceInspector/RelevanceInspector'],
        () => {
          const loadedModule = require('../RelevanceInspector/RelevanceInspector.ts');
          const relevanceInspectorCtor = loadedModule.RelevanceInspector as RelevanceInspectorModule.IRelevanceInspectorConstructor;
          const relevanceInspectorElement = $$('btn');
          $$(this.element).prepend(relevanceInspectorElement.el);
          this.relevanceInspector = new relevanceInspectorCtor(relevanceInspectorElement.el, this.getBindings());
        },
        null,
        'RelevanceInspector'
      );
    }
  }

  private handlePreprocessQueryStateModel(args: Record<string, any>) {
    const tgFromModel = this.queryStateModel.get(QueryStateModel.attributesEnum.tg);
    const tFromModel = this.queryStateModel.get(QueryStateModel.attributesEnum.t);

    let tg = tgFromModel;
    let t = tFromModel;

    // if you want to set the tab group
    if (args && args.tg !== undefined) {
      args.tg = this.getTabGroupId(args.tg);
      if (tg != args.tg) {
        args.t = args.t || QueryStateModel.defaultAttributes.t;
        args.sort = args.sort || QueryStateModel.defaultAttributes.sort;
        tg = args.tg;
      }
    }

    if (args && args.t !== undefined) {
      args.t = this.getTabId(tg, args.t);
      if (t != args.t) {
        args.sort = args.sort || QueryStateModel.defaultAttributes.sort;
        t = args.t;
      }
    }

    if (args && args.sort !== undefined) {
      args.sort = this.getSort(t, args.sort);
    }

    if (args && args.quickview !== undefined) {
      args.quickview = this.getQuickview(args.quickview);
    }

    // `fv:` states are intended to be redirected and used on a standard Search Interface,
    // else the state gets transformed to `hd` before the redirection.
    if (args && args.fv && !(this instanceof StandaloneSearchInterface)) {
      this.facetValueStateHandler.handleFacetValueState(args);
    }
  }

  private getTabGroupId(tabGroupId: string) {
    const tabGroupRef = BaseComponent.getComponentRef('TabGroup');
    if (tabGroupRef) {
      const tabGroups = this.getComponents<any>(tabGroupRef.ID);
      // check if the tabgroup is correct
      if (
        tabGroupId != QueryStateModel.defaultAttributes.tg &&
        any(tabGroups, (tabGroup: any) => !tabGroup.disabled && tabGroupId == tabGroup.options.id)
      ) {
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
    const tabRef = BaseComponent.getComponentRef('Tab');
    const tabGroupRef = BaseComponent.getComponentRef('TabGroup');
    if (tabRef) {
      const tabs = this.getComponents<any>(tabRef.ID);
      if (tabGroupRef) {
        // if has a tabGroup
        if (tabGroupId != QueryStateModel.defaultAttributes.tg) {
          const tabGroups = this.getComponents<any>(tabGroupRef.ID);
          const tabGroup = find(tabGroups, (tabGroup: any) => tabGroupId == tabGroup.options.id);
          // check if the tabgroup contain this tab
          if (
            tabId != QueryStateModel.defaultAttributes.t &&
            any(tabs, (tab: any) => tabId == tab.options.id && tabGroup.isElementIncludedInTabGroup(tab.element))
          ) {
            return tabId;
          }
          // select the first tab in the tabGroup
          const tab = find(tabs, (tab: any) => tabGroup.isElementIncludedInTabGroup(tab.element));
          if (tab != null) {
            return tab.options.id;
          }
          return QueryStateModel.defaultAttributes.t;
        }
      }
      // check if the tab is correct
      if (tabId != QueryStateModel.defaultAttributes.t && any(tabs, (tab: any) => tabId == tab.options.id)) {
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
    const sortRef = BaseComponent.getComponentRef('Sort');
    if (sortRef) {
      const sorts = this.getComponents<any>(sortRef.ID);
      // if has a selected tab
      const tabRef = BaseComponent.getComponentRef('Tab');
      if (tabRef) {
        if (tabId != QueryStateModel.defaultAttributes.t) {
          const tabs = this.getComponents<any>(tabRef.ID);
          const tab = find(tabs, (tab: any) => tabId == tab.options.id);
          const sortCriteria = tab.options.sort;

          // check if the tab contain this sort
          if (
            sortId != QueryStateModel.defaultAttributes.sort &&
            any(sorts, (sort: any) => tab.isElementIncludedInTab(sort.element) && sort.match(sortId))
          ) {
            return sortId;
          } else if (sortCriteria != null) {
            // if not and tab.options.sort is set apply it
            return sortCriteria.toString();
          }
          // select the first sort in the tab
          const sort = find(sorts, (sort: any) => tab.isElementIncludedInTab(sort.element));
          if (sort != null) {
            return sort.options.sortCriteria[0].toString();
          }
          return QueryStateModel.defaultAttributes.sort;
        }
      }
      // check if the sort is correct
      if (sortId != QueryStateModel.defaultAttributes.sort && any(sorts, (sort: any) => sort.match(sortId))) {
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
    const quickviewRef = BaseComponent.getComponentRef('Quickview');
    if (quickviewRef) {
      const quickviews = this.getComponents<any>(quickviewRef.ID);
      if (any(quickviews, (quickview: any) => quickview.getHashId() == quickviewId)) {
        return quickviewId;
      }
    }
    return QueryStateModel.defaultAttributes.quickview;
  }

  private handleQuickviewChanged(args: IAttributeChangedEventArg) {
    const quickviewRef = BaseComponent.getComponentRef('Quickview');
    if (quickviewRef) {
      const quickviews = this.getComponents<any>(quickviewRef.ID);
      if (args.value != '') {
        const quickviewsPartition = partition(quickviews, quickview => quickview.getHashId() == args.value);
        if (quickviewsPartition[0].length != 0) {
          first(quickviewsPartition[0]).open();
          each(tail(quickviewsPartition[0]), quickview => quickview.close());
        }
        each(quickviewsPartition[1], quickview => quickview.close());
      } else {
        each(quickviews, quickview => {
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
      data.queryBuilder.constantExpression.add(this.options.expression);
    }

    if (Utils.isNonEmptyString(<string>this.options.filterField)) {
      data.queryBuilder.filterField = <string>this.options.filterField;
    }

    if (Utils.isNonEmptyString(this.options.timezone)) {
      data.queryBuilder.timezone = this.options.timezone;
    }

    data.queryBuilder.enableCollaborativeRating = this.options.enableCollaborativeRating;

    data.queryBuilder.enableDuplicateFiltering = this.options.enableDuplicateFiltering;

    data.queryBuilder.allowQueriesWithoutKeywords = this.options.allowQueriesWithoutKeywords;

    const endpoint = this.queryController.getEndpoint();
    if (endpoint != null && endpoint.options) {
      if (this.queryStateModel.get(QueryStateModel.attributesEnum.debug)) {
        data.queryBuilder.maximumAge = 0;
        data.queryBuilder.enableDebug = true;
        data.queryBuilder.fieldsToExclude = ['allmetadatavalues'];
        data.queryBuilder.fieldsToInclude = null;
      }
    }
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    const noResults = data.results.results.length == 0;
    this.toggleSectionState('coveo-no-results', noResults);
    this.handlePossiblyModifiedNumberOfResultsInQueryPipeline(data);
    const resultsHeader = $$(this.element).find('.coveo-results-header');
    if (resultsHeader) {
      $$(resultsHeader).removeClass('coveo-query-error');
    }
  }

  private handlePossiblyModifiedNumberOfResultsInQueryPipeline(data: IQuerySuccessEventArgs) {
    if (!data || !data.query || !data.results) {
      return;
    }

    const numberOfRequestedResults = data.query.numberOfResults;
    const numberOfResultsActuallyReturned = data.results.results.length;
    const areLastPageResults = data.results.totalCountFiltered - data.query.firstResult === numberOfResultsActuallyReturned;
    const moreResultsAvailable = !areLastPageResults && data.results.totalCountFiltered > numberOfResultsActuallyReturned;

    if (numberOfRequestedResults != numberOfResultsActuallyReturned && moreResultsAvailable) {
      this.isResultsPerPageModifiedByPipeline = true;
      this.queryPipelineConfigurationForResultsPerPage = numberOfResultsActuallyReturned;
    } else {
      this.isResultsPerPageModifiedByPipeline = false;
      this.queryPipelineConfigurationForResultsPerPage = null;
    }
  }

  private handleQueryError(data: IQueryErrorEventArgs) {
    this.toggleSectionState('coveo-no-results');
    const resultsHeader = $$(this.element).find('.coveo-results-header');
    if (resultsHeader) {
      $$(resultsHeader).addClass('coveo-query-error');
    }
  }

  private handleAfterComponentsInitialization() {
    each(this.attachedComponents, components => {
      components.forEach(component => {
        if (FacetColumnAutoLayoutAdjustment.isAutoLayoutAdjustable(component)) {
          FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(this.element, component);
        }
      });
    });
    if (this.duplicatesFacets.length) {
      this.logger.warn(
        `The following facets have duplicate id/field:`,
        this.duplicatesFacets,
        `Ensure that each facet in your search interface has a unique id.`
      );
    }
  }

  private get duplicatesFacets() {
    const duplicate = [];
    const facets = ComponentsTypes.getAllFacetsInstance(this.root);

    facets.forEach(facet => {
      facets.forEach(cmp => {
        if (facet == cmp) {
          return;
        }
        if (facet.options.id === cmp.options.id) {
          duplicate.push(facet);
          return;
        }
      });
    });
    return duplicate;
  }

  private toggleSectionState(cssClass: string, toggle = true) {
    const facetSection = $$(this.element).find('.coveo-facet-column');
    const resultsSection = $$(this.element).find('.coveo-results-column');
    const resultsHeader = $$(this.element).find('.coveo-results-header');
    const facetSearchs = $$(this.element).findAll('.coveo-facet-search-results');
    const recommendationSection = $$(this.element).find('.coveo-recommendation-main-section');

    if (facetSection) {
      $$(facetSection).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
    }
    if (resultsSection) {
      $$(resultsSection).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
    }
    if (resultsHeader) {
      $$(resultsHeader).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
    }
    if (recommendationSection) {
      $$(recommendationSection).toggleClass(cssClass, toggle);
    }
    if (facetSearchs && facetSearchs.length > 0) {
      each(facetSearchs, facetSearch => {
        $$(facetSearch).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
      });
    }
  }

  private initializeEmptyQueryAllowed() {
    new InitializationPlaceholder(this.element).withFullInitializationStyling().withAllPlaceholders();
  }

  private initializeEmptyQueryNotAllowed() {
    const placeholder = new InitializationPlaceholder(this.element)
      .withEventToRemovePlaceholder(QueryEvents.newQuery)
      .withFullInitializationStyling()
      .withHiddenRootElement()
      .withPlaceholderForFacets()
      .withPlaceholderForResultList();

    $$(this.root).on(InitializationEvents.restoreHistoryState, () => {
      placeholder.withVisibleRootElement();
      if (this.queryStateModel.get('q') == '') {
        placeholder.withWaitingForFirstQueryMode();
      }
    });

    $$(this.element).on(QueryEvents.doneBuildingQuery, (e, args: IDoneBuildingQueryEventArgs) => {
      if (!args.queryBuilder.containsEndUserKeywords()) {
        const lastQuery = this.queryController.getLastQuery().q;
        if (Utils.isNonEmptyString(lastQuery)) {
          this.queryStateModel.set(QUERY_STATE_ATTRIBUTES.Q, lastQuery);
          args.queryBuilder.expression.add(lastQuery);
        } else {
          this.logger.info('Query cancelled by the Search Interface', 'Configuration does not allow empty query', this, this.options);
          args.cancel = true;
          this.queryStateModel.reset();

          new InitializationPlaceholder(this.element)
            .withEventToRemovePlaceholder(QueryEvents.newQuery)
            .withFullInitializationStyling()
            .withVisibleRootElement()
            .withPlaceholderForFacets()
            .withPlaceholderForResultList()
            .withWaitingForFirstQueryMode();
        }
      }
    });
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

  constructor(
    public element: HTMLElement,
    public options?: IStandaloneSearchInterfaceOptions,
    public analyticsOptions?,
    public _window = window
  ) {
    super(element, ComponentOptions.initComponentOptions(element, StandaloneSearchInterface, options), analyticsOptions, _window);
    $$(this.root).on(QueryEvents.newQuery, (e: Event, args: INewQueryEventArgs) => this.handleRedirect(e, args));
  }

  public handleRedirect(e: Event, data: INewQueryEventArgs) {
    if (data.shouldRedirectStandaloneSearchbox === false) {
      return;
    }

    const dataToSendOnBeforeRedirect: IBeforeRedirectEventArgs = {
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
    const stateValues = this.queryStateModel.getAttributes();
    let uaCausedBy = this.usageAnalytics.getCurrentEventCause();

    if (uaCausedBy != null) {
      // for legacy reason, searchbox submit were always logged a search from link in an external search box.
      // transform them if that's what we hit.
      if (uaCausedBy == analyticsActionCauseList.searchboxSubmit.name) {
        uaCausedBy = analyticsActionCauseList.searchFromLink.name;
      }
      stateValues['firstQueryCause'] = uaCausedBy;
    }
    const uaMeta = this.usageAnalytics.getCurrentEventMeta();
    if (uaMeta != null && !isEmpty(uaMeta)) {
      stateValues['firstQueryMeta'] = uaMeta;
    }

    const link = document.createElement('a');
    link.href = searchPage;
    link.href = link.href; // IE11 needs this to correctly fill the properties that are used below.

    const pathname = link.pathname.indexOf('/') == 0 ? link.pathname : '/' + link.pathname; // IE11 does not add a leading slash to this property.
    const hash = link.hash ? link.hash + '&' : '#';

    // By using a setTimeout, we allow other possible code related to the search box / magic box time to complete.
    // eg: onblur of the magic box.
    setTimeout(() => {
      this._window.location.href = `${link.protocol}//${link.host}${pathname}${link.search}${hash}${HashUtils.encodeValues(stateValues)}`;
    }, 0);
  }

  private searchboxIsEmpty(): boolean {
    return Utils.isEmptyString(this.queryStateModel.get(QueryStateModel.attributesEnum.q));
  }
}
