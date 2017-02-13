import { Initialization } from './Initialization';
import { Assert } from '../../misc/Assert';
import { QueryController } from '../../controllers/QueryController';
import { QueryStateModel, setState } from '../../models/QueryStateModel';
import { IQueryResult } from '../../rest/QueryResult';
import { IQueryResults } from '../../rest/QueryResults';
import { Analytics } from '../Analytics/Analytics';
import { IAnalyticsClient } from '../Analytics/AnalyticsClient';
import { InitializationEvents } from '../../events/InitializationEvents';
import { $$ } from '../../utils/Dom';
import { IAnalyticsActionCause, IAnalyticsDocumentViewMeta } from '../Analytics/AnalyticsActionListMeta';
import { IStringMap } from '../../rest/GenericParam';
import { BaseComponent } from '../Base/BaseComponent';
import { Component } from '../Base/Component';
import { IStandaloneSearchInterfaceOptions } from '../SearchInterface/SearchInterface';
import { IRecommendationOptions } from '../Recommendation/Recommendation';
import _ = require('underscore');

/**
 * Initialize the framework with a basic search interface. Calls {@link Initialization.initSearchInterface}.<br/>
 * If using the jQuery extension, this is called using <code>$('#root').coveo('init');</code>.
 * @param element The root of the interface to initialize.
 * @param options JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType : true}}</code>).
 */
export function init(element: HTMLElement, options: any = {}) {
  Initialization.initializeFramework(element, options, () => {
    Initialization.initSearchInterface(element, options);
  });
}

Initialization.registerNamedMethod('init', (element: HTMLElement, options: any = {}) => {
  init(element, options);
});

/**
 * Initialize the framework with a standalone search box. Calls {@link Initialize.initStandaloneSearchInterface}.<br/>
 * If using the jQuery extension, this is called using <code>$('#root').coveo('initSearchbox');</code>.
 * @param element The root of the interface to initialize.
 * @param searchPageUri The search page on which to redirect when there is a query.
 * @param options JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType : true}}</code>).
 */
export function initSearchbox(element: HTMLElement, searchPageUri: string, options: any = {}): void {
  Assert.isNonEmptyString(searchPageUri);
  var searchInterfaceOptions = <IStandaloneSearchInterfaceOptions>{};
  searchInterfaceOptions.searchPageUri = searchPageUri;
  searchInterfaceOptions.autoTriggerQuery = false;
  searchInterfaceOptions.hideUntilFirstQuery = false;
  searchInterfaceOptions.enableHistory = false;
  options = _.extend({}, options, { StandaloneSearchInterface: searchInterfaceOptions });
  Initialization.initializeFramework(element, options, () => {
    Initialization.initStandaloneSearchInterface(element, options);
  });
}

Initialization.registerNamedMethod('initSearchbox', (element: HTMLElement, searchPageUri: string, options: any = {}) => {
  initSearchbox(element, searchPageUri, options);
});

/**
 * Initialize the framework with a recommendation interface. Calls {@link Initialization.initRecommendationInterface}.<br/>
 * If using the jQuery extension, this is called using <code>$('#root').coveo('initRecommendation');</code>.
 * @param element The root of the interface to initialize.
 * @param mainSearchInterface The search interface to link with the recommendation interface (see {@link Recommendation}).
 * @param userContext The user context to pass with the query generated in the recommendation interface (see {@link Recommendation}).
 * @param options JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType: true}}</code>).
 */
export function initRecommendation(element: HTMLElement, mainSearchInterface?: HTMLElement, userContext?: { [name: string]: any }, options: any = {}): void {
  var recommendationOptions = <IRecommendationOptions>{};
  recommendationOptions.mainSearchInterface = mainSearchInterface;
  recommendationOptions.userContext = JSON.stringify(userContext);
  recommendationOptions.enableHistory = false;
  options = _.extend({}, options, { Recommendation: recommendationOptions });
  Initialization.initializeFramework(element, options, () => {
    Initialization.initRecommendationInterface(element, options);
  });
}

Initialization.registerNamedMethod('initRecommendation', (element: HTMLElement, mainSearchInterface: HTMLElement, userContext: any = {}, options: any = {}) => {
  initRecommendation(element, mainSearchInterface, userContext, options);
});


/**
 * Execute a standard query. Active component in the interface will react to events/ push data in the query / handle the query success or failure as needed.<br/>
 * It triggers a standard query flow for which the standard component will perform their expected behavior.<br/>
 * If you wish to only perform a query on the index to retrieve results (without the component reacting), look into {@link SearchInterface} instead.<br/>
 * Calling this method is the same as calling {@link QueryController.executeQuery}.
 * @param element The root of the interface to initialize.
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
 * Perform operation on the state ({@link QueryStateModel} of the interface.<br/>
 * Get the complete {@link QueryStateModel} object: <code>Coveo.state(element)</code><br/>.
 * Get an attribute from the {@link QueryStateModel}: <code>Coveo.state(element, 'q')</code> Can be any attribute.<br/>
 * Set an attribute on the {@link QueryStateModel}: <code>Coveo.state(element, 'q', 'foobar')</code>. Can be any attribute.<br/>
 * Set multiple attribute on the {@link QueryStateModel}: <code>Coveo.state(element, {'q' : 'foobar' , sort : 'relevancy'})</code>. Can be any attribute.<br/>
 * If using the jQuery extension, this is called using <code>$('#root').coveo('state');</code>.
 * @param element The root of the interface for which to access the {@link QueryStateModel}.
 * @param args
 * @returns {any}
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
  var analytics = getCoveoAnalytics(element);
  if (analytics) {
    return analytics.client;
  } else {
    return undefined;
  }
}

function getCoveoAnalytics(element: HTMLElement): Analytics {
  var analyticsElement = $$(element).find('.' + Component.computeCssClassName(Analytics));
  if (analyticsElement) {
    return <Analytics>Component.get(analyticsElement);
  } else {
    return undefined;
  }
}

/**
 * Log a custom event on the Coveo Usage Analytics service.
 * @param element The root of the interface for which to log analytics events.
 * @param customEventCause The cause of the event.
 * @param metadata The metadata associated with the event (JSON key value).
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
 * Log a `SearchEvent` on the Coveo Usage Analytics service.
 * @param element The root of the interface for which to log analytics events.
 * @param searchEventCause The cause of the event.
 * @param metadata The metadata associated with the event (JSON key value).
 */
export function logSearchEvent(element: HTMLElement, searchEventCause: IAnalyticsActionCause, metadata: IStringMap<string>) {
  var client = getCoveoAnalyticsClient(element);
  if (client) {
    client.logSearchEvent<any>(searchEventCause, metadata);
  }
}

Initialization.registerNamedMethod('logSearchEvent', (element: HTMLElement, searchEventCause: IAnalyticsActionCause, metadata: IStringMap<string>) => {
  logSearchEvent(element, searchEventCause, metadata);
});

/**
 * Log a `SearchAsYouTypeEvent` on the Coveo Usage Analytics service.<br/>
 * It is a bit different from a standard search event, as it will wait 5 seconds before sending the final `SearchAsYouType` event.
 * @param element The root of the interface for which to log analytics events.
 * @param searchAsYouTypeEventCause The cause of the event.
 * @param metadata The metadata associated with the event (JSON key value).
 */
export function logSearchAsYouTypeEvent(element: HTMLElement, searchAsYouTypeEventCause: IAnalyticsActionCause, metadata: IStringMap<string>) {
  var client = getCoveoAnalyticsClient(element);
  if (client) {
    client.logSearchAsYouType<any>(searchAsYouTypeEventCause, metadata);
  }
}

Initialization.registerNamedMethod('logSearchAsYouTypeEvent', (element: HTMLElement, searchAsYouTypeEventCause: IAnalyticsActionCause, metadata: IStringMap<string>) => {
  logSearchAsYouTypeEvent(element, searchAsYouTypeEventCause, metadata);
});

/**
 * Log a `ClickEvent` on the Coveo Usage Analytics service.
 * @param element The root of the interface for which to log analytics events.
 * @param clickEventCause The cause of the event.
 * @param metadata The metadata associated with the event (JSON key value).
 * @param result The result that was clicked.
 */
export function logClickEvent(element: HTMLElement, clickEventCause: IAnalyticsActionCause, metadata: IStringMap<any>, result: IQueryResult) {
  var client = getCoveoAnalyticsClient(element);
  if (client) {
    client.logClickEvent(clickEventCause, <IAnalyticsDocumentViewMeta>metadata, result, element);
  }
}

Initialization.registerNamedMethod('logClickEvent', (element: HTMLElement, clickEventCause: IAnalyticsActionCause, metadata: IStringMap<string>, result: IQueryResult) => {
  logClickEvent(element, clickEventCause, metadata, result);
});

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
  var type, options: any = {}, injectMarkup;
  // This means : initBox, no type (no injection) and no options
  if (args.length == 0) {
    type = 'Standard';
    injectMarkup = false;
  } else if (args.length == 1) { // 1 arg, might be options or type
    // This mean a type (with injection) and no options
    if (typeof args[0] == 'string') {
      type = args[0];
      injectMarkup = true;
    } else if (typeof args[0] == 'object') { // This means no type(no injection) and with options
      type = 'Standard';
      injectMarkup = false;
      options = args[0];
    } else {
      Assert.fail('Invalid parameters to init a box');
    }
  } else if (args.length == 2) { // 2 args means both options and type (with injection);
    type = args[0];
    options = args[1];
    injectMarkup = true;
  }
  var merged: any = {};
  merged[type || 'Container'] = _.extend({}, options.SearchInterface, options[type]);
  options = _.extend({}, options, merged);
  Initialization.initializeFramework(element, options, () => {
    Initialization.initBoxInterface(element, options, type, injectMarkup);
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
