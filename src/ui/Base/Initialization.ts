import { IQueryResult } from '../../rest/QueryResult';
import { Logger } from '../../misc/Logger';
import { IComponentDefinition, Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Utils } from '../../utils/Utils';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import { InitializationEvents } from '../../events/InitializationEvents';
import { SearchInterface, StandaloneSearchInterface } from '../SearchInterface/SearchInterface';
import { QueryController } from '../../controllers/QueryController';
import { HashUtils } from '../../utils/HashUtils';
import { QueryStateModel } from '../../models/QueryStateModel';
import { ComponentStateModel } from '../../models/ComponentStateModel';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import { IAnalyticsNoMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { JQueryUtils } from '../../utils/JQueryutils';
import { IJQuery } from './CoveoJQuery';
import * as _ from 'underscore';
import { IStringMap } from '../../rest/GenericParam';
import { get, state } from './RegisteredNamedMethods';

/**
 * Represent the initialization parameters required to init a new component.
 */
export interface IInitializationParameters {
  options: any;
  result?: IQueryResult;
  bindings: IComponentBindings;
}

export interface IInitResult {
  initResult: Promise<boolean>;
  isLazyInit: boolean;
}

/**
 * The main purpose of this class is to initialize the framework (a.k.a the code executed when calling `Coveo.init`).<br/>
 * It's also in charge or registering the available components, as well as the method that we expost to the global Coveo scope.<br/>
 * For example, the `Coveo.executeQuery` function will be registed in this class by the {@link QueryController}.
 */
export class Initialization {
  // This is the only difference between an "eager" initialization and a "lazy" initialization
  // This function will be set to EagerInitialization.functionGeneratorForComponents or LazyInitialization.functionGeneratorForComponents
  // This is done in Eager.ts or Lazy.ts (the entry point)
  // In eager mode, the generator return an array of function. Each function returns "void" when called. After all the function have been called, all the components are initialized, synchronously.
  // In lazy mode, the generator return an array of function. Each function return an array of Promise when called. When all the promises are resolved, the components are correctly initialized, asynchronously.
  // We need the 2 different mode for a specific reason :
  // In eager mode, when someone calls Coveo.init, this means the initialization is synchronous, and someone can then immediately start interacting with components.
  // In lazy mode, when someone calls Coveo.init, they have to wait for the returned promise to resolve before interacting with components.
  public static componentsFactory: (
    elements: HTMLElement[],
    componentClassId: string,
    initParameters: IInitializationParameters
  ) => { factory: () => Promise<Component>[] | void; isLazyInit: boolean };

  private static logger = new Logger('Initialization');
  public static registeredComponents: String[] = [];
  private static namedMethods: { [s: string]: any } = {};

  // List of every fields that are needed by components when doing a query (the fieldsToInclude property in the query)
  // Since results components are lazy loaded after the first query (when doing the rendering) we need to register the needed fields before their implementation are loaded in the page.
  private static fieldsNeededForQuery: string[] = [];
  // List of every fields that are needed by components when doing a query (the fieldsToInclude property in the query), linked to the component that needs them
  // It is a bit different from `fieldsNeededForQuery` because we can, in some scenarios, optimize to only get fields for components that are actually in the page
  private static fieldsNeededForQueryByComponent: IStringMap<string[]> = {};

  /**
   * Register a new set of options for a given element.<br/>
   * When the element is eventually initialized as a component, those options will be used / merged to create the final option set to use for this component.<br/>
   * Note that this function should not normally be called directly, but instead using the global `Coveo.options` function
   * @param element
   * @param options
   */
  public static registerDefaultOptions(element: HTMLElement, options: {}): void {
    const existing = element['CoveoDefaultOptions'] || {};
    const updated = Utils.extendDeep(existing, options);
    element['CoveoDefaultOptions'] = updated;
  }

  public static resolveDefaultOptions(element: HTMLElement, options: {}): {} {
    const optionsForThisElement = element['CoveoDefaultOptions'];

    let optionsSoFar: {};
    if (Utils.exists(optionsForThisElement)) {
      optionsSoFar = Utils.extendDeep(optionsForThisElement, options);
    } else {
      optionsSoFar = options;
    }

    if (element.parentElement) {
      return Initialization.resolveDefaultOptions(element.parentElement, optionsSoFar);
    } else {
      return optionsSoFar;
    }
  }

  /**
   * Register a new Component to be recognized by the framework.
   * This essentially mean that when we call `Coveo.init`, the Initialization class will scan the DOM for known component (which have registed themselves with this call) and create a new component on each element.
   *
   * This is meant to register the component to be loaded "eagerly" (Immediately available when the UI scripts are included)
   * @param componentClass
   */
  public static registerAutoCreateComponent(componentClass: IComponentDefinition): void {
    Assert.exists(componentClass);
    Assert.exists(componentClass.ID);
    Assert.doesNotExists(Initialization.namedMethods[componentClass.ID]);

    if (!_.contains(Initialization.registeredComponents, componentClass.ID)) {
      Initialization.registeredComponents.push(componentClass.ID);
    }

    if (EagerInitialization.eagerlyLoadedComponents[componentClass.ID] == null) {
      EagerInitialization.eagerlyLoadedComponents[componentClass.ID] = componentClass;
    }

    if (LazyInitialization.lazyLoadedComponents[componentClass.ID] == null) {
      LazyInitialization.lazyLoadedComponents[componentClass.ID] = () => {
        return new Promise((resolve, reject) => {
          resolve(componentClass);
        });
      };
    }
  }

  /**
   * Set the fields that the component needs to add to the query.
   *
   * This is used when the {@link ResultList.options.autoSelectFieldsToInclude } is set to `true` (which is `true` by default).
   *
   * The framework tries to only include the needed fields from the index, for performance reasons.
   *
   * @param componentId The id for the component (eg: CoveoFacet)
   * @param fields
   */
  public static registerComponentFields(componentId: string, fields: string[]) {
    Initialization.fieldsNeededForQuery = Utils.concatWithoutDuplicate(Initialization.fieldsNeededForQuery, fields);

    // Register with both name (eg : Facet and CoveoFacet) to reduce possible confusion.
    // The id concept for component is fuzzy for a lot of people (include the Coveo prefix or not)
    const registerById = id => {
      if (Initialization.fieldsNeededForQueryByComponent[id] == null) {
        Initialization.fieldsNeededForQueryByComponent[id] = fields;
      } else {
        Initialization.fieldsNeededForQueryByComponent[id] = Utils.concatWithoutDuplicate(
          Initialization.fieldsNeededForQueryByComponent[id],
          fields
        );
      }
    };

    registerById(componentId);
    registerById(Component.computeCssClassNameForType(componentId));
  }

  /**
   * Returns all the fields that the framework currently knows should be added to the query.
   *
   * This is used when the {@link ResultList.options.autoSelectFieldsToInclude } is set to `true` (which is `true` by default).
   *
   * The framework tries to only include the needed fields from the index, for performance reasons.
   * @returns {string[]}
   */
  public static getRegisteredFieldsForQuery() {
    return Initialization.fieldsNeededForQuery;
  }

  /**
   * Returns all the fields that the framework currently knows should be added to the query, for a given component.
   *
   * This is used when the {@link ResultList.options.autoSelectFieldsToInclude } is set to `true` (which is `true` by default).
   *
   * The framework tries to only include the needed fields from the index, for performance reasons.
   * @param componentId
   * @returns {string[]|Array}
   */
  public static getRegisteredFieldsComponentForQuery(componentId: string): string[] {
    const basicId = Initialization.fieldsNeededForQueryByComponent[componentId] || [];
    const coveoId = Initialization.fieldsNeededForQueryByComponent[Component.computeCssClassNameForType(componentId)] || [];
    return Utils.concatWithoutDuplicate(basicId, coveoId);
  }

  /**
   * Check if a component is already registered, using it's ID (e.g. : 'Facet').
   * @param componentClassId
   * @returns {boolean}
   */
  public static isComponentClassIdRegistered(componentClassId: string): boolean {
    return (
      _.contains(Initialization.registeredComponents, componentClassId) ||
      _.contains(Initialization.registeredComponents, Component.computeCssClassNameForType(componentClassId))
    );
  }

  /**
   * Return the list of all known components (the list of ID for each component), whether they are actually loaded or not.
   * @returns {string[]}
   */
  public static getListOfRegisteredComponents() {
    return Initialization.registeredComponents;
  }

  /**
   * Return the list of all components that are currently eagerly loaded.
   * @returns {string[]}
   */
  public static getListOfLoadedComponents() {
    return _.keys(EagerInitialization.eagerlyLoadedComponents);
  }

  /**
   * Return the component class definition, using it's ID (e.g. : 'CoveoFacet').
   *
   * This means the component needs to be eagerly loaded.
   *
   * @param name
   * @returns {IComponentDefinition}
   */
  public static getRegisteredComponent(name: string) {
    return EagerInitialization.eagerlyLoadedComponents[name];
  }

  /**
   * Initialize the framework. Note that this function should not normally be called directly, but instead using a globally registered function (e.g.: Coveo.init), or {@link Initialization.initSearchInterface} or {@link Initialization.initStandaloneSearchInterface} <br/>
   * (e.g. : `Coveo.init` or `Coveo.initSearchbox`).
   * @param element The element on which to initialize the interface.
   * @param options The options for all components (eg: {Searchbox : {enableSearchAsYouType : true}}).
   * @param initSearchInterfaceFunction The function to execute to create the {@link SearchInterface} component. Different init call will create different {@link SearchInterface}.
   */
  public static initializeFramework(
    element: HTMLElement,
    options: any,
    initSearchInterfaceFunction: (...args: any[]) => IInitResult
  ): Promise<{ elem: HTMLElement }> {
    Assert.exists(element);
    const alreadyInitialized = Component.get(element, QueryController, true);
    if (alreadyInitialized) {
      this.logger.error('This DOM element has already been initialized as a search interface, skipping initialization', element);
      return new Promise((resolve, reject) => {
        resolve({ elem: element });
      });
    }

    options = Initialization.resolveDefaultOptions(element, options);

    Initialization.performInitFunctionsOption(options, InitializationEvents.beforeInitialization);
    $$(element).trigger(InitializationEvents.beforeInitialization);

    const toExecuteOnceSearchInterfaceIsInitialized = () => {
      return Initialization.initExternalComponents(element, options).then(result => {
        Initialization.performInitFunctionsOption(options, InitializationEvents.afterComponentsInitialization);
        $$(element).trigger(InitializationEvents.afterComponentsInitialization);

        $$(element).trigger(InitializationEvents.restoreHistoryState);

        Initialization.performInitFunctionsOption(options, InitializationEvents.afterInitialization);
        $$(element).trigger(InitializationEvents.afterInitialization);

        const searchInterface = <SearchInterface>Component.get(element, SearchInterface);
        if (Initialization.shouldExecuteFirstQueryAutomatically(searchInterface)) {
          Initialization.logFirstQueryCause(searchInterface);
          let shouldLogInActionHistory = true;
          // We should not log an action history if the interface is a standalone recommendation component.
          if (Coveo['Recommendation']) {
            shouldLogInActionHistory = !(searchInterface instanceof Coveo['Recommendation']);
          }
          (<QueryController>Component.get(element, QueryController)).executeQuery({
            logInActionsHistory: shouldLogInActionHistory,
            isFirstQuery: true
          });
        }
        return result;
      });
    };

    const resultOfSearchInterfaceInitialization = initSearchInterfaceFunction(element, options);

    // We are executing a "lazy" initialization, which returns a Promise
    // eg : CoveoJsSearch.Lazy.js was included in the page
    // this means that we can only execute the function after the promise has resolved
    if (resultOfSearchInterfaceInitialization.isLazyInit) {
      return resultOfSearchInterfaceInitialization.initResult.then(toExecuteOnceSearchInterfaceIsInitialized).then(() => {
        return {
          elem: element
        };
      });
    } else {
      // Else, we are executing an "eager" initialization, which returns void;
      // eg : CoveoJsSearch.js was included in the page
      // this mean that this function gets executed immediately
      return toExecuteOnceSearchInterfaceIsInitialized().then(() => {
        return {
          elem: element
        };
      });
    }
  }

  /**
   * Create a new standard search interface. This is the function executed when calling `Coveo.init`.
   * @param element
   * @param options
   * @returns {IInitResult}
   */
  public static initSearchInterface(element: HTMLElement, options: any = {}): IInitResult {
    options = Initialization.resolveDefaultOptions(element, options);
    const searchInterface = new SearchInterface(element, options.SearchInterface, options.Analytics);
    searchInterface.options.originalOptionsObject = options;
    const initParameters: IInitializationParameters = { options: options, bindings: searchInterface.getBindings() };
    return Initialization.automaticallyCreateComponentsInside(element, initParameters, ['Recommendation']);
  }

  /**
   * Create a new standalone search interface (standalone search box). This is the function executed when calling `Coveo.initSearchbox`.
   * @param element
   * @param options
   * @returns {IInitResult}
   */
  public static initStandaloneSearchInterface(element: HTMLElement, options: any = {}): IInitResult {
    options = Initialization.resolveDefaultOptions(element, options);

    // Set trigger query on clear to false for standalone search interface automatically
    // Take care of not overriding any options that could have been set by external code.
    if (!options.Querybox) {
      options.Querybox = {};
    }
    if (!options.Omnibox) {
      options.Omnibox = {};
    }
    if (!options.Searchbox) {
      options.Searchbox = {};
    }
    if (!options.Querybox.triggerQueryOnClear || !options.Omnibox.triggerQueryOnClear || !options.Searchbox.triggerOnQueryClear) {
      options.Querybox.triggerQueryOnClear = false;
      options.Omnibox.triggerQueryOnClear = false;
      options.Searchbox.triggerQueryOnClear = false;
    }

    const searchInterface = new StandaloneSearchInterface(element, options.StandaloneSearchInterface, options.Analytics);
    searchInterface.options.originalOptionsObject = options;
    const initParameters: IInitializationParameters = { options: options, bindings: searchInterface.getBindings() };
    return Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  /**
   * Create a new recommendation search interface. This is the function executed when calling `Coveo.initRecommendation`.
   * @param element
   * @param options
   * @returns {IInitResult}
   */
  public static initRecommendationInterface(element: HTMLElement, options: any = {}): IInitResult {
    options = Initialization.resolveDefaultOptions(element, options);
    // Since a recommendation interface inherits from a search interface, we need to merge those if passed on init
    const optionsForRecommendation = _.extend({}, options.SearchInterface, options.Recommendation);
    // If there is a main search interface, modify the loading animation for the recommendation interface to a "noop" element
    // We don't want 2 animation overlapping
    if (optionsForRecommendation.mainSearchInterface) {
      optionsForRecommendation.firstLoadingAnimation = $$('span').el;
    }
    const recommendation = new window['Coveo']['Recommendation'](element, optionsForRecommendation, options.Analytics);
    recommendation.options.originalOptionsObject = options;
    const initParameters: IInitializationParameters = { options: options, bindings: recommendation.getBindings() };
    return Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  /**
   * Scan the element and all its children for known components. Initialize every known component found.
   * @param element
   * @param initParameters
   * @param ignore
   * @returns {IInitResult}
   */
  public static automaticallyCreateComponentsInside(
    element: HTMLElement,
    initParameters: IInitializationParameters,
    ignore?: string[]
  ): IInitResult {
    Assert.exists(element);

    const codeToExecute: { (): Promise<Component>[] | void }[] = [];

    let htmlElementsToIgnore: HTMLElement[] = [];

    // Scan for elements to ignore which can be a container component (with other component inside)
    // When a component is ignored, all it's children component should be ignored too.
    // Add them to the array of html elements that should be skipped.
    _.each(ignore, toIgnore => {
      const rootsToIgnore = $$(element).findAll(`.${Component.computeCssClassNameForType(toIgnore)}`);
      if (rootsToIgnore && rootsToIgnore.length > 0) {
        _.each(rootsToIgnore, rootToIgnore => {
          const childsElementsToIgnore = $$(rootToIgnore).findAll('*');
          htmlElementsToIgnore = htmlElementsToIgnore.concat(childsElementsToIgnore);
        });
      }
    });

    let isLazyInit;

    _.each(Initialization.getListOfRegisteredComponents(), (componentClassId: string) => {
      if (!_.contains(ignore, componentClassId)) {
        const classname = Component.computeCssClassNameForType(`${componentClassId}`);
        let elements = $$(element).findAll('.' + classname);
        // From all the component we found which match the current className, remove those that should be ignored
        elements = _.difference(elements, htmlElementsToIgnore);
        if ($$(element).hasClass(classname) && !_.contains(htmlElementsToIgnore, element)) {
          elements.push(element);
        }
        if (elements.length != 0) {
          const resultsOfFactory = this.componentsFactory(elements, componentClassId, initParameters);
          isLazyInit = resultsOfFactory.isLazyInit;
          codeToExecute.push(resultsOfFactory.factory);
        }
      }
    });

    // We log the fatal error on init, but then we try to continue the initialization for the rest of the components.
    // In most case, this would be caused by a fatal error in a component constructor.
    // In some cases, it might be for a minor component not essential to basic function of the interface, meaning we could still salvage things here.
    const logFatalErrorOnComponentInitialization = (e: Error) => {
      this.logger.error(e);
      this.logger.warn(`Skipping initialization of previous component in error ... `);
    };

    if (isLazyInit) {
      return {
        initResult: Promise.all(
          _.map(codeToExecute, code => {
            const resultsOfFactory = code();
            if (_.isArray(resultsOfFactory)) {
              return Promise.all(resultsOfFactory).then(() => true);
            } else {
              return Promise.resolve(true);
            }
          })
        )
          .then(() => true)
          .catch((e: Error) => {
            logFatalErrorOnComponentInitialization(e);
            return true;
          }),
        isLazyInit: true
      };
    } else {
      _.each(codeToExecute, code => {
        try {
          code();
        } catch (e) {
          logFatalErrorOnComponentInitialization(e);
        }
      });
      return {
        initResult: Promise.resolve(true),
        isLazyInit: false
      };
    }
  }

  /**
   * Register a new globally available method in the Coveo namespace (e.g.: `Coveo.init`).
   * @param methodName The method name to register.
   * @param handler The function to execute when the method is called.
   */
  public static registerNamedMethod(methodName: string, handler: (...args: any[]) => any) {
    Assert.isNonEmptyString(methodName);
    Assert.doesNotExists(EagerInitialization.eagerlyLoadedComponents[methodName]);
    Assert.doesNotExists(Initialization.namedMethods[methodName]);
    Assert.exists(handler);
    Initialization.namedMethods[methodName] = handler;
  }

  /**
   * Check if the method is already registed.
   * @param methodName
   * @returns {boolean}
   */
  public static isNamedMethodRegistered(methodName: string): boolean {
    return Utils.exists(Initialization.namedMethods[methodName]);
  }

  /**
   * 'Monkey patch' (replace the function with a new one) a given method on a component instance.
   * @param methodName
   * @param element
   * @param handler
   */
  public static monkeyPatchComponentMethod(methodName: string, element: HTMLElement, handler: (...args: any[]) => any) {
    Assert.isNonEmptyString(methodName);
    Assert.exists(handler);

    let componentClass;
    if (methodName.indexOf('.') > 0) {
      const splitArg = methodName.split('.');
      Assert.check(splitArg.length == 2, 'Invalid method name, correct syntax is CoveoComponent.methodName.');
      componentClass = splitArg[0];
      methodName = <string>splitArg[1];
    }

    const boundComponent = Component.get(element, componentClass);
    Assert.exists(boundComponent);
    Assert.exists(boundComponent[methodName]);

    const originalMethodName = '__' + methodName;
    if (!Utils.exists(boundComponent[originalMethodName])) {
      boundComponent[originalMethodName] = boundComponent[methodName];
    }

    boundComponent[methodName] = handler;
  }

  public static initBoxInterface(
    element: HTMLElement,
    options: any = {},
    type: string = 'Standard',
    injectMarkup: boolean = true
  ): IInitResult {
    options = Initialization.resolveDefaultOptions(element, options);
    let fromInitTypeToBoxReference = 'Box';
    if (type != 'Standard') {
      fromInitTypeToBoxReference += 'For' + type;
    }
    const boxRef = Component.getComponentRef(fromInitTypeToBoxReference);
    if (boxRef) {
      new Logger(element).info('Initializing box of type ' + fromInitTypeToBoxReference);
      const injectFunction: () => any = injectMarkup ? boxRef.getInjection : () => {};
      const box = new boxRef(element, options[fromInitTypeToBoxReference], options.Analytics, injectFunction, options);
      box.options.originalOptionsObject = options;
      const initParameters: IInitializationParameters = { options: options, bindings: box.getBindings() };
      return Initialization.automaticallyCreateComponentsInside(element, initParameters);
    } else {
      return {
        initResult: new Promise((resolve, reject) => {
          new Logger(element).error(
            'Trying to initialize box of type : ' + fromInitTypeToBoxReference + ' but not found in code (not compiled)!'
          );
          Assert.fail('Cannot initialize unknown type of box');
          reject(false);
        }),
        isLazyInit: false
      };
    }
  }

  public static dispatchNamedMethodCall(methodName: string, element: HTMLElement, args: any[]): any {
    Assert.isNonEmptyString(methodName);
    Assert.exists(element);

    const namedMethodHandler: (element: HTMLElement, ...args: any[]) => any = Initialization.namedMethods[methodName];
    Assert.exists(namedMethodHandler);

    Initialization.logger.trace('Dispatching named method call of ' + methodName, element, args);
    if (args.length != 0) {
      return namedMethodHandler.apply(null, [element].concat(args));
    } else {
      return namedMethodHandler.apply(null, [element]);
    }
  }

  public static dispatchNamedMethodCallOrComponentCreation(token: string, element: HTMLElement, args: any[]): any {
    Assert.isNonEmptyString(token);
    Assert.exists(element);

    if (Initialization.isNamedMethodRegistered(token)) {
      return Initialization.dispatchNamedMethodCall(token, element, args);
    } else if (Initialization.isThereASingleComponentBoundToThisElement(element)) {
      return Initialization.dispatchMethodCallOnBoundComponent(token, element, args);
    } else {
      Assert.fail('No method or component named ' + token + ' are registered.');
    }
  }

  public static isSearchFromLink(searchInterface: SearchInterface) {
    return Utils.isNonEmptyString(searchInterface.getBindings().queryStateModel.get('q'));
  }

  public static isThereASingleComponentBoundToThisElement(element: HTMLElement): boolean {
    Assert.exists(element);
    return Utils.exists(Component.get(element, null, true));
  }

  public static isThereANonSearchInterfaceComponentBoundToThisElement(element: HTMLElement): boolean {
    // We automatically consider "Recommendation" component to be a special case of search interface
    // and thus do not check those.
    if ($$(element).hasClass('CoveoRecommendation')) {
      return true;
    }
    return (
      Initialization.isThereASingleComponentBoundToThisElement(element) &&
      !get(element, SearchInterface, true) &&
      !$$(element).hasClass('CoveoRecommendation')
    );
  }

  private static dispatchMethodCallOnBoundComponent(methodName: string, element: HTMLElement, args: any[]): any {
    Assert.isNonEmptyString(methodName);
    Assert.exists(element);

    const boundComponent = Component.get(element);
    Assert.exists(boundComponent);

    const method = boundComponent[methodName];
    if (Utils.exists(method)) {
      return method.apply(boundComponent, args);
    } else {
      Assert.fail('No method named ' + methodName + ' exist on component ' + boundComponent.type);
    }
  }

  private static logFirstQueryCause(searchInterface: SearchInterface) {
    const firstQueryCause = HashUtils.getValue('firstQueryCause', HashUtils.getHash());
    if (firstQueryCause != null) {
      const meta = HashUtils.getValue('firstQueryMeta', HashUtils.getHash()) || {};
      searchInterface.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList[firstQueryCause], meta);
    } else {
      if (Initialization.isSearchFromLink(searchInterface)) {
        searchInterface.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchFromLink, {});
      } else {
        searchInterface.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.interfaceLoad, {});
      }
    }
  }

  private static performInitFunctionsOption(options, event: string) {
    if (Utils.exists(options)) {
      Initialization.performFunctions(options[event]);
    }
  }

  private static performFunctions(option) {
    if (Utils.exists(option)) {
      _.each(option, (func: () => void) => {
        if (typeof func == 'function') {
          func();
        }
      });
    }
  }

  private static initExternalComponents(element: HTMLElement, options?: any): Promise<Boolean> {
    if (options && options['externalComponents']) {
      const searchInterface = <SearchInterface>Component.get(element, SearchInterface);
      const queryStateModel = <QueryStateModel>Component.get(element, QueryStateModel);
      const componentStateModel = <ComponentStateModel>Component.get(element, ComponentStateModel);
      const queryController = <QueryController>Component.get(element, QueryController);
      const componentOptionsModel = <ComponentOptionsModel>Component.get(element, ComponentOptionsModel);
      const usageAnalytics = searchInterface.usageAnalytics;
      Assert.exists(searchInterface);
      Assert.exists(queryStateModel);
      Assert.exists(queryController);
      Assert.exists(componentStateModel);
      Assert.exists(usageAnalytics);
      const initParameters: IInitializationParameters = {
        options: options,
        bindings: {
          searchInterface: searchInterface,
          queryStateModel: queryStateModel,
          queryController: queryController,
          usageAnalytics: usageAnalytics,
          componentStateModel: componentStateModel,
          componentOptionsModel: componentOptionsModel,
          root: element
        }
      };
      const initializationOfExternalComponents = _.map(options['externalComponents'], (externalComponent: HTMLElement | IJQuery) => {
        const elementToInstantiate = externalComponent;
        if (Utils.isHtmlElement(elementToInstantiate)) {
          return Initialization.automaticallyCreateComponentsInside(<HTMLElement>elementToInstantiate, initParameters).initResult;
        } else if (JQueryUtils.isInstanceOfJQuery(elementToInstantiate)) {
          return Initialization.automaticallyCreateComponentsInside(<HTMLElement>(<any>elementToInstantiate).get(0), initParameters)
            .initResult;
        }
      });
      return Promise.all(initializationOfExternalComponents)
        .then(results => _.first(results))
        .catch(err => {
          this.logger.error(err);
          return false;
        });
    } else {
      return Promise.resolve(false);
    }
  }

  private static shouldExecuteFirstQueryAutomatically(searchInterface: SearchInterface) {
    const options = searchInterface.options;

    if (!options) {
      return true;
    }

    if (options.autoTriggerQuery === false) {
      return false;
    }

    if (options.allowQueriesWithoutKeywords === true) {
      return true;
    }

    const currentStateOfQuery = state(searchInterface.element).get('q');
    return currentStateOfQuery != '';
  }
}

export class LazyInitialization {
  private static logger = new Logger('LazyInitialization');

  // Map of every component to a promise that resolve with their implementation (lazily loaded)
  public static lazyLoadedComponents: IStringMap<() => Promise<IComponentDefinition>> = {};
  public static lazyLoadedModule: IStringMap<() => Promise<any>> = {};

  public static getLazyRegisteredComponent(name: string): Promise<IComponentDefinition> {
    return LazyInitialization.lazyLoadedComponents[name]();
  }

  public static getLazyRegisteredModule(name: string): Promise<any> {
    return LazyInitialization.lazyLoadedModule[name]();
  }

  public static registerLazyComponent(id: string, load: () => Promise<IComponentDefinition>): void {
    if (LazyInitialization.lazyLoadedComponents[id] == null) {
      Assert.exists(load);
      if (!_.contains(Initialization.registeredComponents, id)) {
        Initialization.registeredComponents.push(id);
      }
      LazyInitialization.lazyLoadedComponents[id] = load;
    } else {
      this.logger.warn('Component being registered twice', id);
    }
  }

  public static buildErrorCallback(chunkName: string, resolve: Function) {
    return error => {
      LazyInitialization.logger.warn(
        `Cannot load chunk for ${
          chunkName
        }. You may need to configure the paths of the resources using Coveo.configureResourceRoot. Current path is ${
          __webpack_public_path__
        }.`
      );
      resolve(() => {});
    };
  }

  public static registerLazyModule(id: string, load: () => Promise<any>): void {
    if (LazyInitialization.lazyLoadedModule[id] == null) {
      Assert.exists(load);
      LazyInitialization.lazyLoadedModule[id] = load;
    } else {
      this.logger.warn('Module being registered twice', id);
    }
  }

  public static componentsFactory(
    elements: Element[],
    componentClassId: string,
    initParameters: IInitializationParameters
  ): { factory: () => Promise<Component>[]; isLazyInit: boolean } {
    const factory = () => {
      const promises: Promise<Component>[] = [];
      _.each(elements, (matchingElement: HTMLElement) => {
        if (Component.get(matchingElement, componentClassId) == null) {
          // If options were provided, lookup options for this component class and
          // also for the element id. Merge them and pass those to the factory method.
          let optionsToUse = undefined;
          if (Utils.exists(initParameters.options)) {
            const optionsForComponentClass = initParameters.options[componentClassId];
            const optionsForElementId = initParameters.options[matchingElement.id];
            const initOptions = initParameters.options['initOptions'] ? initParameters.options['initOptions'][componentClassId] : {};
            optionsToUse = Utils.extendDeep(optionsForElementId, initOptions);
            optionsToUse = Utils.extendDeep(optionsForComponentClass, optionsToUse);
          }
          const initParamToUse = _.extend({}, initParameters, { options: optionsToUse });

          promises.push(LazyInitialization.createComponentOfThisClassOnElement(componentClassId, matchingElement, initParamToUse));
        }
      });
      return promises;
    };

    return {
      factory: factory,
      isLazyInit: true
    };
  }

  private static createComponentOfThisClassOnElement(
    componentClassId: string,
    element: HTMLElement,
    initParameters?: IInitializationParameters
  ): Promise<Component> {
    Assert.isNonEmptyString(componentClassId);
    Assert.exists(element);

    // If another component exist on that element, we do not want to re-initialize again.
    // The exception being the "SearchInterface", since in some case we want end user to initialize directly on the root of the interface
    // For example, when we are initializing a standalone search box, we might want to target the div for the search box directly.
    if (Initialization.isThereANonSearchInterfaceComponentBoundToThisElement(element)) {
      return null;
    }

    return LazyInitialization.getLazyRegisteredComponent(componentClassId).then((lazyLoadedComponent: IComponentDefinition) => {
      Assert.exists(lazyLoadedComponent);

      if (Initialization.isThereANonSearchInterfaceComponentBoundToThisElement(element)) {
        return null;
      }

      const bindings: IComponentBindings = {};
      let options = {};
      let result: IQueryResult = undefined;

      if (initParameters != undefined) {
        _.each(<{ [key: string]: any }>initParameters.bindings, (value, key) => {
          bindings[key] = value;
        });
        options = initParameters.options;
        result = initParameters.result;
      }

      LazyInitialization.logger.trace('Creating component of class ' + componentClassId, element, options);
      return new lazyLoadedComponent(element, options, bindings, result);
    });
  }
}

export class EagerInitialization {
  private static logger = new Logger('EagerInitialization');

  // Map of every component with their implementation (eagerly loaded)
  public static eagerlyLoadedComponents: IStringMap<IComponentDefinition> = {};

  public static componentsFactory(
    elements: Element[],
    componentClassId: string,
    initParameters: IInitializationParameters
  ): { factory: () => void; isLazyInit: boolean } {
    const factory = () => {
      _.each(elements, (matchingElement: HTMLElement) => {
        if (Component.get(matchingElement, componentClassId) == null) {
          // If options were provided, lookup options for this component class and
          // also for the element id. Merge them and pass those to the factory method.
          let optionsToUse = undefined;
          if (Utils.exists(initParameters.options)) {
            const optionsForComponentClass = initParameters.options[componentClassId];
            const optionsForElementId = initParameters.options[matchingElement.id];
            const initOptions = initParameters.options['initOptions'] ? initParameters.options['initOptions'][componentClassId] : {};
            optionsToUse = Utils.extendDeep(optionsForElementId, initOptions);
            optionsToUse = Utils.extendDeep(optionsForComponentClass, optionsToUse);
          }
          const initParamToUse = _.extend({}, initParameters, { options: optionsToUse });
          EagerInitialization.createComponentOfThisClassOnElement(componentClassId, matchingElement, initParamToUse);
        }
      });
    };

    return {
      factory: factory,
      isLazyInit: false
    };
  }

  private static createComponentOfThisClassOnElement(
    componentClassId: string,
    element: HTMLElement,
    initParameters?: IInitializationParameters
  ): Component {
    Assert.isNonEmptyString(componentClassId);
    Assert.exists(element);

    const eagerlyLoadedComponent: IComponentDefinition = Initialization.getRegisteredComponent(componentClassId);
    const bindings: IComponentBindings = {};
    let options = {};
    let result: IQueryResult = undefined;

    if (initParameters != undefined) {
      _.each(<{ [key: string]: any }>initParameters.bindings, (value, key) => {
        bindings[key] = value;
      });
      options = initParameters.options;
      result = initParameters.result;
    }

    // If another component exist on that element, we do not want to re-initialize again.
    // The exception being the "SearchInterface", since in some case we want end user to initialize directly on the root of the interface
    // For example, when we are initializing a standalone search box, we might want to target the div for the search box directly.
    if (Initialization.isThereANonSearchInterfaceComponentBoundToThisElement(element)) {
      return null;
    }

    EagerInitialization.logger.trace(`Creating component of class ${componentClassId}`, element, options);
    // This is done so that external code that extends a base component does not have to have two code path for lazy vs eager;
    // If we do not find the eager component registered, we can instead try to load the one found in lazy mode.
    // If it still fails there... tough luck. The component simply won't work.
    if (eagerlyLoadedComponent == null) {
      LazyInitialization.getLazyRegisteredComponent(componentClassId)
        .then(lazyLoadedComponent => {
          EagerInitialization.logger.warn(
            `Component of class ${componentClassId} was not found in "Eager" mode. Using lazy mode as a fallback.`
          );
          new lazyLoadedComponent(element, options, bindings, result);
        })
        .catch(() => {
          EagerInitialization.logger.error(
            `Component of class ${componentClassId} was not found in "Eager" mode nor "Lazy" mode. It will not be initialized properly...`
          );
        });
      return null;
    } else {
      return new eagerlyLoadedComponent(element, options, bindings, result);
    }
  }
}
