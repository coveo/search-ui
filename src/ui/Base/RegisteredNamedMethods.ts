import { Initialization, LazyInitialization, EagerInitialization } from './Initialization';
import { Assert } from '../../misc/Assert';
import { QueryController } from '../../controllers/QueryController';
import { QueryStateModel, setState } from '../../models/QueryStateModel';
import { IQueryResult } from '../../rest/QueryResult';
import { IQueryResults } from '../../rest/QueryResults';
import { IAnalyticsClient } from '../Analytics/AnalyticsClient';
import { InitializationEvents } from '../../events/InitializationEvents';
import { $$ } from '../../utils/Dom';
import { IAnalyticsActionCause, IAnalyticsDocumentViewMeta } from '../Analytics/AnalyticsActionListMeta';
import { IStringMap } from '../../rest/GenericParam';
import { BaseComponent } from '../Base/BaseComponent';
import { Component } from '../Base/Component';
import { IStandaloneSearchInterfaceOptions } from '../SearchInterface/SearchInterface';
import { IRecommendationOptions } from '../Recommendation/Recommendation';
import * as _ from 'underscore';
import { PublicPathUtils } from '../../utils/PublicPathUtils';

/**
 * Initialize the framework with a basic search interface. Calls {@link Initialization.initSearchInterface}.
 *
 * If using the jQuery extension, this is called using <code>$('#root').coveo('init');</code>.
 * @param element The root of the interface to initialize.
 * @param options JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType : true}}</code>).
 * @returns {Promise<{elem: HTMLElement}>}
 */
export function init(element: HTMLElement, options: any = {}) {
  return Initialization.initializeFramework(element, options, () => {
    return Initialization.initSearchInterface(element, options);
  });
}

Initialization.registerNamedMethod('init', (element: HTMLElement, options: any = {}) => {
  return init(element, options);
});

/**
 * Initialize the framework with a standalone search box. Calls {@link Initialize.initStandaloneSearchInterface}.
 *
 * If using the jQuery extension, this is called using <code>$('#root').coveo('initSearchbox');</code>.
 * @param element The root of the interface to initialize.
 * @param searchPageUri The search page on which to redirect when there is a query.
 * @param options JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType : true}}</code>).
 * @returns {Promise<{elem: HTMLElement}>}
 */
export function initSearchbox(element: HTMLElement, searchPageUri: string, options: any = {}) {
  Assert.isNonEmptyString(searchPageUri);
  var searchInterfaceOptions = <IStandaloneSearchInterfaceOptions>{};
  searchInterfaceOptions.searchPageUri = searchPageUri;
  searchInterfaceOptions.autoTriggerQuery = false;
  searchInterfaceOptions.enableHistory = false;
  options = _.extend({}, options, { StandaloneSearchInterface: searchInterfaceOptions });
  return Initialization.initializeFramework(element, options, () => {
    return Initialization.initStandaloneSearchInterface(element, options);
  });
}

Initialization.registerNamedMethod('initSearchbox', (element: HTMLElement, searchPageUri: string, options: any = {}) => {
  initSearchbox(element, searchPageUri, options);
});

/**
 * Initialize the framework with a recommendation interface. Calls {@link Initialization.initRecommendationInterface}.
 *
 * If using the jQuery extension, this is called using <code>$('#root').coveo('initRecommendation');</code>.
 * @param element The root of the interface to initialize.
 * @param mainSearchInterface The search interface to link with the recommendation interface (see {@link Recommendation}).
 * @param userContext The user context to pass with the query generated in the recommendation interface (see {@link Recommendation}).
 * @param options JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType: true}}</code>).
 * @returns {Promise<{elem: HTMLElement}>}
 */
export function initRecommendation(
  element: HTMLElement,
  mainSearchInterface?: HTMLElement,
  userContext?: { [name: string]: any },
  options: any = {}
) {
  var recommendationOptions = <IRecommendationOptions>{};
  recommendationOptions.mainSearchInterface = mainSearchInterface;
  recommendationOptions.userContext = userContext;
  recommendationOptions.enableHistory = false;
  options = _.extend({}, options, { Recommendation: recommendationOptions });

  // Recommendation component is special : It is not explicitely registered like other "basic" components since it's a full search interface.
  // Since it's not done using the "standard" path, we need to register this manually here
  // This ensure that we can always call `getLazyRegisteredComponent`, no matter if it was loaded from eager or lazy mode.
  if (window['Coveo']['Recommendation'] != null) {
    LazyInitialization.registerLazyComponent('Recommendation', () => Promise.resolve(window['Coveo']['Recommendation']));
    EagerInitialization.eagerlyLoadedComponents['Recommendation'] = window['Coveo']['Recommendation'];
  }

  return LazyInitialization.getLazyRegisteredComponent('Recommendation').then(() => {
    return Initialization.initializeFramework(element, options, () => {
      return Initialization.initRecommendationInterface(element, options);
    });
  });
}

Initialization.registerNamedMethod(
  'initRecommendation',
  (element: HTMLElement, mainSearchInterface: HTMLElement, userContext: any = {}, options: any = {}) => {
    initRecommendation(element, mainSearchInterface, userContext, options);
  }
);

/**
 * Execute a standard query. Active component in the interface will react to events/ push data in the query / handle the query success or failure as needed.
 *
 * It triggers a standard query flow for which the standard component will perform their expected behavior.
 *
 * If you wish to only perform a query on the index to retrieve results (without the component reacting), look into {@link SearchInterface} instead.
 *
 * Calling this method is the same as calling {@link QueryController.executeQuery}.
 *
 * @param element The root of the interface to initialize.
 * @returns {Promise<IQueryResults>}
 */
export function executeQuery(element: HTMLElement): Promise<IQueryResults> {
  Assert.exists(element);

  var queryController = <QueryController>Component.resolveBinding(element, QueryController);
  Assert.exists(queryController);
  return queryController.executeQuery();
}

Initialization.registerNamedMethod('executeQuery', (element: HTMLElement) => {
  return executeQuery(element);
});

/**
 * Performs read and write operations on the [`QueryStateModel`]{@link QueryStateModel} instance of the search
 * interface. See [State](https://developers.coveo.com/x/RYGfAQ).
 *
 * Can perform the following actions:
 *
 * - Get the `QueryStateModel` instance:
 * ```javascript
 * Coveo.state(element);
 * ```
 *
 * - Get the value of a single state attribute from the `QueryStateModel` instance:
 * ```javascript
 * // You can replace `q` with any registered state attribute.
 * Coveo.state(element, "q");
 * ```
 *
 * - Set the value of a single state attribute in the `QueryStateModel` instance:
 * ```javascript
 * // You can replace `q` with any registered state attribute.
 * Coveo.state(element, "q", "my new value");
 * ```
 *
 * - Set multiple state attribute values in the `QueryStateModel` instance:
 * ```javascript
 * // You can replace `q` and `sort` with any registered state attributes.
 * Coveo.state(element, {
 *     "q" : "my new value",
 *     "sort" : "relevancy"
 * });
 * ```
 *
 * **Note:**
 * > When setting one or several state attribute values with this function, you can pass an additional argument to set
 * > the `silent` attribute to `true` in order to prevent the state change from triggering state change events.
 * >
 * > **Example:**
 * > ```javascript
 * > Coveo.state(element, "q", "my new value", { "silent" : true });
 * > ```
 *
 * @param element The root of the interface whose `QueryStateModel` instance the function should interact with.
 * @param args The arguments that determine the action to perform on the `QueryStateModel` instance.
 * @returns {any} Depends on the action performed.
 */
export function state(element: HTMLElement, ...args: any[]): any {
  Assert.exists(element);
  var model = <QueryStateModel>Component.resolveBinding(element, QueryStateModel);
  return setState(model, args);
}

Initialization.registerNamedMethod('state', (element: HTMLElement, ...args: any[]): any => {
  if (args.length != 0) {
    return state.apply(undefined, [element].concat(args));
  } else {
    return state.apply(undefined, [element]);
  }
});

/**
 * Get the component bound on the given `HTMLElement`.
 * @param element The `HTMLElement` for which to get the component instance.
 * @param componentClass If multiple components are bound to a single `HTMLElement`, you need to specify which components you wish to get.
 * @param noThrow By default, the GET method will throw if there is no component bound, or if there are multiple component and no `componentClass` is specified. This deletes the error if set to true.
 * @returns {Component}
 */
export function get(element: HTMLElement, componentClass?, noThrow?: boolean): BaseComponent {
  Assert.exists(element);
  return Component.get(element, componentClass, noThrow);
}

Initialization.registerNamedMethod('get', (element: HTMLElement, componentClass?: any, noThrow?: boolean): BaseComponent => {
  return get(element, componentClass, noThrow);
});

export function result(element: HTMLElement, noThrow?: boolean): IQueryResult {
  Assert.exists(element);
  return Component.getResult(element, noThrow);
}

Initialization.registerNamedMethod('result', (element: HTMLElement, noThrow?: boolean): IQueryResult => {
  return result(element, noThrow);
});

function getCoveoAnalyticsClient(element: HTMLElement): IAnalyticsClient {
  var analytics = <any>getCoveoAnalytics(element);
  if (analytics) {
    return analytics.client;
  } else {
    return undefined;
  }
}

function getCoveoAnalytics(element: HTMLElement) {
  var analyticsElement = $$(element).find('.' + Component.computeCssClassNameForType(`Analytics`));
  if (analyticsElement) {
    return Component.get(analyticsElement);
  } else {
    return undefined;
  }
}

/**
 * Finds the [`Analytics`]{@link Analytics} component instance, and uses it to log a `Custom` usage analytics event.
 *
 * You can use `Custom` events to create custom reports, or to track events which are neither queries nor item
 * views.
 *
 * @param element The root of the search interface which contains the [`Analytics`]{@link Analytics} component.
 * @param customEventCause The cause of the event.
 * @param metadata The metadata you want to use to create custom dimensions. Metadata can contain as many key-value
 * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
 * service automatically converts white spaces to underscores, and uppercase characters to lowercase characters in key
 * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
 * ( `{}` ).
 */
export function logCustomEvent(element: HTMLElement, customEventCause: IAnalyticsActionCause, metadata: IStringMap<string>) {
  var client = getCoveoAnalyticsClient(element);
  if (client) {
    client.logCustomEvent<any>(customEventCause, metadata, element);
  }
}

Initialization.registerNamedMethod('logCustomEvent', (element: HTMLElement, customEventCause: IAnalyticsActionCause, metadata: any) => {
  logCustomEvent(element, customEventCause, metadata);
});

/**
 * Finds the [`Analytics`]{@link Analytics} component instance, and uses it to log a `Search` usage analytics event.
 *
 * A `Search` event is actually sent to the Coveo Usage Analytics service only after the query successfully returns (not
 * immediately after calling this method). Therefore, it is important to call this method **before** executing the
 * query. Otherwise, the `Search` event will not be logged, and you will get a warning message in the console. See
 * [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
 *
 * @param element The root of the search interface which contains the [`Analytics`]{@link Analytics} component.
 * @param searchEventCause The cause of the event.
 * @param metadata The metadata you want to use to create custom dimensions. Metadata can contain as many key-value
 * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
 * service automatically converts white spaces to underscores, and uppercase characters to lowercase characters in key
 * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
 * ( `{}` ).
 */
export function logSearchEvent(element: HTMLElement, searchEventCause: IAnalyticsActionCause, metadata: IStringMap<string>) {
  var client = getCoveoAnalyticsClient(element);
  if (client) {
    client.logSearchEvent<any>(searchEventCause, metadata);
  }
}

Initialization.registerNamedMethod(
  'logSearchEvent',
  (element: HTMLElement, searchEventCause: IAnalyticsActionCause, metadata: IStringMap<string>) => {
    logSearchEvent(element, searchEventCause, metadata);
  }
);

/**
 * Finds the [`Analytics`]{@link Analytics} component instance, and uses it to log a `SearchAsYouType` usage analytics
 * event.
 *
 * This function is very similar to the `logSearchEvent` function, except that `logSearchAsYouTypeEvent` should, by
 * definition, be called more frequently. Consequently, in order to avoid logging every single partial query, the
 * `PendingSearchAsYouTypeEvent` takes care of logging only the "relevant" last event: an event that occurs after 5
 * seconds have elapsed without any event being logged, or an event that occurs after another part of the interface
 * triggers a search event.
 *
 * It is important to call this method **before** executing the query. Otherwise, no `SearchAsYouType` event will be
 * logged, and you will get a warning message in the console. See
 * [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
 *
 * @param element The root of the search interface which contains the [`Analytics`]{@link Analytics} component.
 * @param searchAsYouTypeEventCause The cause of the event.
 * @param metadata The metadata you want to use to create custom dimensions. Metadata can contain as many key-value
 * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
 * service automatically converts white spaces to underscores, and uppercase characters to lowercase characters in key
 * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
 * ( `{}` ).
 */
export function logSearchAsYouTypeEvent(
  element: HTMLElement,
  searchAsYouTypeEventCause: IAnalyticsActionCause,
  metadata: IStringMap<string>
) {
  var client = getCoveoAnalyticsClient(element);
  if (client) {
    client.logSearchAsYouType<any>(searchAsYouTypeEventCause, metadata);
  }
}

Initialization.registerNamedMethod(
  'logSearchAsYouTypeEvent',
  (element: HTMLElement, searchAsYouTypeEventCause: IAnalyticsActionCause, metadata: IStringMap<string>) => {
    logSearchAsYouTypeEvent(element, searchAsYouTypeEventCause, metadata);
  }
);

/**
 * Finds the [`Analytics`]{@link Analytics} component instance, and uses it to log a `Click` usage analytics event.
 *
 * A `Click` event corresponds to an item view (e.g., clicking on a {@link ResultLink} or opening a {@link Quickview}).
 *
 * `Click` events are immediately sent to the Coveo Usage Analytics service.
 *
 * @param element The root of the search interface which contains the [`Analytics`]{@link Analytics} component.
 * @param clickEventCause The cause of the event.
 * @param metadata The metadata you want to use to create custom dimensions. Metadata can contain as many key-value
 * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
 * service automatically converts white spaces to underscores, and uppercase characters to lowercase characters in key
 * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
 * ( `{}` ).
 * @param result The result that was clicked.
 */
export function logClickEvent(
  element: HTMLElement,
  clickEventCause: IAnalyticsActionCause,
  metadata: IStringMap<any>,
  result: IQueryResult
) {
  var client = getCoveoAnalyticsClient(element);
  if (client) {
    client.logClickEvent(clickEventCause, <IAnalyticsDocumentViewMeta>metadata, result, element);
  }
}

Initialization.registerNamedMethod(
  'logClickEvent',
  (element: HTMLElement, clickEventCause: IAnalyticsActionCause, metadata: IStringMap<string>, result: IQueryResult) => {
    logClickEvent(element, clickEventCause, metadata, result);
  }
);

/**
 * Pass options to the framework, before it is initialized ({@link init}).<br/>
 * All the options passed with this calls will be merged together on initialization.
 * @param element The root of the interface for which you wish to set options.
 * @param optionsToSet JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType: true}}</code>).
 */
export function options(element: HTMLElement, optionsToSet: any = {}) {
  Initialization.registerDefaultOptions(element, optionsToSet);
}

Initialization.registerNamedMethod('options', (element: HTMLElement, optionsToSet: any = {}) => {
  options(element, optionsToSet);
});

/**
 * Patch the given `methodName` on an instance of a component bound to an `HTMLElement` with a new handler.
 * @param element
 * @param methodName
 * @param handler
 */
export function patch(element: HTMLElement, methodName: string, handler: (...args: any[]) => any) {
  Initialization.monkeyPatchComponentMethod(methodName, element, handler);
}

Initialization.registerNamedMethod('patch', (element?: HTMLElement, methodName?: string, handler?: (...args: any[]) => any) => {
  patch(element, methodName, handler);
});

export function initBox(element: HTMLElement, ...args: any[]) {
  var type,
    options: any = {},
    injectMarkup;
  // This means : initBox, no type (no injection) and no options
  if (args.length == 0) {
    type = 'Standard';
    injectMarkup = false;
  } else if (args.length == 1) {
    // 1 arg, might be options or type
    // This mean a type (with injection) and no options
    if (typeof args[0] == 'string') {
      type = args[0];
      injectMarkup = true;
    } else if (typeof args[0] == 'object') {
      // This means no type(no injection) and with options
      type = 'Standard';
      injectMarkup = false;
      options = args[0];
    } else {
      Assert.fail('Invalid parameters to init a box');
    }
  } else if (args.length == 2) {
    // 2 args means both options and type (with injection);
    type = args[0];
    options = args[1];
    injectMarkup = true;
  }
  var merged: any = {};
  merged[type || 'Container'] = _.extend({}, options.SearchInterface, options[type]);
  options = _.extend({}, options, merged);
  Initialization.initializeFramework(element, options, () => {
    return Initialization.initBoxInterface(element, options, type, injectMarkup);
  });
}

Initialization.registerNamedMethod('initBox', (element?: HTMLElement, ...args: any[]) => {
  initBox(element, args);
});

export function nuke(element: HTMLElement) {
  $$(element).trigger(InitializationEvents.nuke);
}

Initialization.registerNamedMethod('nuke', (element: HTMLElement) => {
  nuke(element);
});

/**
 * Sets the path from where the chunks used for lazy loading will be loaded. In some cases, in IE11, we cannot automatically detect it, use this instead.
 * @param path This should be the path of the Coveo script. It should also have a trailing slash.
 */
export function configureResourceRoot(path: string) {
  PublicPathUtils.configureResourceRoot(path);
}

Initialization.registerNamedMethod('configureResourceRoot', (path: string) => {
  configureResourceRoot(path);
});

/**
 * Asynchronously loads a module, or chunk.
 *
 * This is especially useful when you want to extend a base component, and make sure the lazy component loading process
 * recognizes it (see [Lazy Versus Eager Component Loading](https://developers.coveo.com/x/YBgvAg)).
 *
 * **Example:**
 *
 * ```typescript
 * export function lazyCustomFacet() {
 *   return Coveo.load<Facet>('Facet').then((Facet) => {
 *     class CustomFacet extends Facet {
 *       [ ... ]
 *     };
 *     Coveo.Initialization.registerAutoCreateComponent(CustomFacet);
 *     return CustomFacet;
 *   });
 * };
 *
 * Coveo.LazyInitialization.registerLazyComponent('CustomFacet', lazyCustomFacet);
 * ```
 *
 * You can also use this function to assert a component is fully loaded in your page before executing any code relating
 * to it.
 *
 * **Example:**
 *
 * > You could do `Coveo.load('Searchbox').then((Searchbox) => {})` to load the [`Searchbox`]{@link Searchbox}
 * > component, if it is not already loaded in your search page.
 *
 * @param id The identifier of the module you wish to load. In the case of components, this identifier is the component
 * name (e.g., `Facet`, `Searchbox`).
 * @returns {Promise} A Promise of the module, or chunk.
 */
export function load<T>(id: string): Promise<T> {
  if (LazyInitialization.lazyLoadedComponents[id] != null) {
    return <Promise<T>>(<any>LazyInitialization.getLazyRegisteredComponent(id));
  } else if (LazyInitialization.lazyLoadedModule[id] != null) {
    return <Promise<T>>LazyInitialization.getLazyRegisteredModule(id);
  } else {
    return Promise.reject(`Module ${id} is not available`);
  }
}

Initialization.registerNamedMethod('require', (modules: string) => {
  return load(modules);
});
