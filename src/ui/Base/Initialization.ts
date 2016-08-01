import {IQueryResult} from '../../rest/QueryResult';
import {Logger} from '../../misc/Logger';
import {IComponentDefinition, Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Utils} from '../../utils/Utils';
import {Assert} from '../../misc/Assert';
import {$$} from '../../utils/Dom';
import {InitializationEvents} from '../../events/InitializationEvents';
import {SearchInterface, StandaloneSearchInterface} from '../SearchInterface/SearchInterface';
import {QueryController} from '../../controllers/QueryController';
import {HashUtils} from '../../utils/HashUtils';
import {QueryStateModel} from '../../models/QueryStateModel';
import {ComponentStateModel} from '../../models/ComponentStateModel';
import {ComponentOptionsModel} from '../../models/ComponentOptionsModel';
import {IAnalyticsNoMeta, analyticsActionCauseList} from '../Analytics/AnalyticsActionListMeta';
import {BaseComponent} from '../Base/BaseComponent';

/**
 * Represent the initialization parameters required to init a new component
 */
export interface IInitializationParameters {
  options: any;
  result?: IQueryResult;
  bindings: IComponentBindings;
}

/**
 * The main purpose of this class is to initialize the framework (a.k.a the code executed when calling Coveo.init).<br/>
 * It's also in charge or registering the available components, as well as the method that we expost to the global Coveo scope.<br/>
 * For example, the Coveo.executeQuery function will be registed in this class by the {@link QueryController}.
 */
export class Initialization {
  private static logger = new Logger('Initialization');
  private static autoCreateComponents: { [s: string]: any; } = {};
  private static namedMethods: { [s: string]: any; } = {};

  /**
   * Register a new set of options for a given element.<br/>
   * When the element is eventually initialized as a component, those options will be used / merged to create the final option set to use for this component.<br/>
   * Note that this function should not normally be called directly, but instead using the global Coveo.options function
   * @param element
   * @param options
   */
  public static registerDefaultOptions(element: HTMLElement, options: {}): void {
    let existing = element['CoveoDefaultOptions'] || {};
    let updated = Utils.extendDeep(existing, options);
    element['CoveoDefaultOptions'] = updated;
  }

  public static resolveDefaultOptions(element: HTMLElement, options: {}): {} {
    let optionsForThisElement = element['CoveoDefaultOptions'];

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
   * Register a new Component to be recognized by the framework.<br/>
   * This essentially mean that when we call Coveo.init, the Initialization class will scan the DOM for known component (which have registed themselves with this call) and create a new component on each element.
   * @param componentClass
   */
  public static registerAutoCreateComponent(componentClass: IComponentDefinition): void {
    Assert.exists(componentClass);
    Assert.exists(componentClass.ID);
    Assert.doesNotExists(Initialization.autoCreateComponents[componentClass.ID]);
    Assert.doesNotExists(Initialization.namedMethods[componentClass.ID]);
    Initialization.autoCreateComponents[componentClass.ID] = componentClass;
  }

  /**
   * Check if a component is already registed, using it's ID (eg : 'Facet')
   * @param componentClassId
   * @returns {boolean}
   */
  public static isComponentClassIdRegistered(componentClassId: string): boolean {
    return Utils.exists(Initialization.autoCreateComponents[componentClassId]);
  }

  /**
   * Return the list of all known components (the list of ID for each component)
   * @returns {string[]}
   */
  public static getListOfRegisteredComponents() {
    return _.keys(Initialization.autoCreateComponents);
  }

  /**
   * Return the component class definition, using it's ID (eg : 'CoveoFacet')
   * @param name
   * @returns {IComponentDefinition}
   */
  public static getRegisteredComponent(name: string) {
    return Initialization.autoCreateComponents[name];
  }

  /**
   * Initialize the framework. Note that this function should not normally be called directly, but instead using a globally registered function (eg: Coveo.init), or {@link Initialization.initSearchInterface} or {@link Initialization.initStandaloneSearchInterface} <br/>
   * Eg : Coveo.init or Coveo.initSearchbox
   * @param element The element on which to initialize the interface
   * @param options The options for all component (eg: {Searchbox : {enableSearchAsYouType : true}})
   * @param initSearchInterfaceFunction The function to execute to create the {@link SearchInterface} component. Different init call will create different {@link SearchInterface}.
   */
  public static initializeFramework(element: HTMLElement, options?: any, initSearchInterfaceFunction?: (...args: any[]) => void) {
    Assert.exists(element);
    let alreadyInitialized = Component.get(element, QueryController, true);
    if (alreadyInitialized) {
      this.logger.error('This DOM element has already been initialized as a search interface, skipping initialization', element);
      return;
    }

    options = Initialization.resolveDefaultOptions(element, options);

    Initialization.performInitFunctionsOption(options, InitializationEvents.beforeInitialization);
    $$(element).trigger(InitializationEvents.beforeInitialization);

    initSearchInterfaceFunction(element, options);
    Initialization.initExternalComponents(element, options);

    Initialization.performInitFunctionsOption(options, InitializationEvents.afterComponentsInitialization);
    $$(element).trigger(InitializationEvents.afterComponentsInitialization);

    $$(element).trigger(InitializationEvents.restoreHistoryState);

    Initialization.performInitFunctionsOption(options, InitializationEvents.afterInitialization);
    $$(element).trigger(InitializationEvents.afterInitialization);

    let searchInterface = <SearchInterface>Component.get(element, SearchInterface);


    // Elements that have the coveo-hide-until-loaded class are hidden by default.
    // Now that we're loaded (and before the first query returns), we can remove
    // the class. Also, we add a class that gives the opportunity for an animation
    // to apply at startup, such as a fade-in that comes in by default.
    let elemsHidden = $$(element).findAll('.coveo-hide-until-loaded');
    _.each(elemsHidden, (e: HTMLElement) => {
      $$(e).removeClass('coveo-hide-until-loaded');
      $$(e).addClass('coveo-show-after-loaded');
    })

    if (searchInterface.options.autoTriggerQuery) {
      Initialization.logFirstQueryCause(searchInterface);
      (<QueryController>Component.get(element, QueryController)).executeQuery();
    }
  }

  /**
   * Create a new standard search interface. This is the function executed when calling Coveo.init
   * @param element
   * @param options
   */
  public static initSearchInterface(element: HTMLElement, options: any = {}) {
    options = Initialization.resolveDefaultOptions(element, options);
    let searchInterface = new SearchInterface(element, options.SearchInterface, options.Analytics);
    searchInterface.options.originalOptionsObject = options;
    let initParameters: IInitializationParameters = { options: options, bindings: searchInterface.getBindings() };
    Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  /**
   * Create a new standalone search interface ( standalone search box ). This is the function executed when calling Coveo.initSearchbox
   * @param element
   * @param options
   */
  public static initStandaloneSearchInterface(element: HTMLElement, options: any = {}) {
    options = Initialization.resolveDefaultOptions(element, options);
    let searchInterface = new StandaloneSearchInterface(element, options.StandaloneSearchInterface, options.Analytics);
    searchInterface.options.originalOptionsObject = options;
    let initParameters: IInitializationParameters = { options: options, bindings: searchInterface.getBindings() };
    Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  /**
   * Create a new recommendation search interface. This is the function executed when calling Coveo.initRecommendation
   * @param element
   * @param options
   */
  public static initRecommendationInterface(element: HTMLElement, options: any = {}) {
    options = Initialization.resolveDefaultOptions(element, options);
    let recommendation = new window['Coveo']['Recommendation'](element, options.Recommendation, options.Analytics);
    recommendation.options.originalOptionsObject = options;
    let initParameters: IInitializationParameters = { options: options, bindings: recommendation.getBindings() };
    Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  /**
   * Scan the element and all it's children for known component. Initialize every known component found
   * @param element The element for which to scan it's children
   * @param initParameters Needed parameters to initialize all the children components
   * @param ignore An optional list of component ID to ignore and skip when scanning for known components
   */
  public static automaticallyCreateComponentsInside(element: HTMLElement, initParameters: IInitializationParameters, ignore?: string[]) {
    Assert.exists(element);

    let codeToExecute: { (): void }[] = [];

    for (let componentClassId in Initialization.autoCreateComponents) {
      if (!_.contains(ignore, componentClassId)) {
        let componentClass = Initialization.autoCreateComponents[componentClassId];
        let classname = Component.computeCssClassName(componentClass);
        let elements = $$(element).findAll('.' + classname);
        if ($$(element).hasClass(classname)) {
          elements.push(element);
        }
        if (elements.length != 0) {
          // Queue the code that will scan the now resolved selector to after we've
          // finished evaluating all selectors. This ensures that if a component
          // constructor adds child components under his tags, those won't get auto-
          // initialize by this invocation of this method. Components inserting child
          // components are responsible of invoking this method again if they want
          // child components to be auto-initialized.
          //
          // Explanation: If we don't do that, child components for which selector have
          // already been evaluated won't be initialized, whereas those that are next
          // in the list will be.
          codeToExecute.push(Initialization.createFunctionThatInitializesComponentOnElements(elements, componentClassId, componentClass, initParameters));
        }
      }
    }

    // Now that all selectors are executed, let's really initialize the components.
    _.each(codeToExecute, (code) => code());
  }

  /**
   * Create a new component on the given element
   * @param componentClassId The ID of the component to initialize (eg : 'CoveoFacet')
   * @param element The HTMLElement on which to initialize
   * @param initParameters Needed parameters to initialize the component
   * @returns {Component}
   */
  public static createComponentOfThisClassOnElement(componentClassId: string, element: HTMLElement, initParameters?: IInitializationParameters): Component {
    Assert.isNonEmptyString(componentClassId);
    Assert.exists(element);

    let componentClass = Initialization.autoCreateComponents[componentClassId];
    Assert.exists(componentClass);

    let bindings: IComponentBindings = {};
    let options = {};
    let result: IQueryResult = undefined;

    if (initParameters != undefined) {
      _.each(<{ [key: string]: any }>initParameters.bindings, (value, key) => {
        bindings[key] = value;
      });
      options = initParameters.options;
      result = initParameters.result;
    }

    Initialization.logger.trace('Creating component of class ' + componentClassId, element, options);
    return new componentClass(element, options, bindings, result);
  }

  /**
   * Register a new globally available method in the Coveo namespace. (eg: Coveo.init)
   * @param methodName The method name to register
   * @param handler The function to execute when the method is called
   */
  public static registerNamedMethod(methodName: string, handler: (element: HTMLElement, ...args: any[]) => any) {
    Assert.isNonEmptyString(methodName);
    Assert.doesNotExists(Initialization.autoCreateComponents[methodName]);
    Assert.doesNotExists(Initialization.namedMethods[methodName]);
    Assert.exists(handler);
    Initialization.namedMethods[methodName] = handler;
  }

  /**
   * Check if the method is already registed
   * @param methodName
   * @returns {boolean}
   */
  public static isNamedMethodRegistered(methodName: string): boolean {
    return Utils.exists(Initialization.namedMethods[methodName]);
  }

  /**
   * 'Monkey patch' (replace the function with a new one) a given method on a component instance
   * @param methodName
   * @param element
   * @param handler
   */
  public static monkeyPatchComponentMethod(methodName: string, element: HTMLElement, handler: (...args: any[]) => any) {
    Assert.isNonEmptyString(methodName);
    Assert.exists(handler);

    let componentClass;
    if (methodName.indexOf('.') > 0) {
      let splitArg = methodName.split('.');
      Assert.check(splitArg.length == 2, 'Invalid method name, correct syntax is CoveoComponent.methodName.');
      componentClass = splitArg[0];
      methodName = <string>splitArg[1];
    }

    let boundComponent = Component.get(element, componentClass);
    Assert.exists(boundComponent);
    Assert.exists(boundComponent[methodName]);

    let originalMethodName = '__' + methodName;
    if (!Utils.exists(boundComponent[originalMethodName])) {
      boundComponent[originalMethodName] = boundComponent[methodName];
    }

    boundComponent[methodName] = handler;
  }

  public static initBoxInterface(element: HTMLElement, options: any = {}, type: string = 'Standard', injectMarkup: boolean = true) {
    options = Initialization.resolveDefaultOptions(element, options);
    let fromInitTypeToBoxReference = 'Box';
    if (type != 'Standard') {
      fromInitTypeToBoxReference += 'For' + type;
    }
    let boxRef = Component.getComponentRef(fromInitTypeToBoxReference);
    if (boxRef) {
      new Logger(element).info('Initializing box of type ' + fromInitTypeToBoxReference);
      let injectFunction: () => any = injectMarkup ? boxRef.getInjection : () => {
      };
      let box = new boxRef(element, options[fromInitTypeToBoxReference], options.Analytics, injectFunction, options);
      box.options.originalOptionsObject = options;
      let initParameters: IInitializationParameters = { options: options, bindings: box.getBindings() };
      Initialization.automaticallyCreateComponentsInside(element, initParameters);
    } else {
      new Logger(element).error('Trying to initialize box of type : ' + fromInitTypeToBoxReference + ' but not found in code (not compiled)!');
      Assert.fail('Cannot initialize unknown type of box');
    }
  }

  public static dispatchNamedMethodCall(methodName: string, element: HTMLElement, args: any[]): any {
    Assert.isNonEmptyString(methodName);
    Assert.exists(element);

    let namedMethodHandler: (element: HTMLElement, ...args: any[]) => any = Initialization.namedMethods[methodName];
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
    } else if (Initialization.isComponentClassIdRegistered(token)) {
      return Initialization.createComponentOfThisClassOnElement(token, element, args[0]);
    } else if (Initialization.isThereASingleComponentBoundToThisElement(element)) {
      return Initialization.dispatchMethodCallOnBoundComponent(token, element, args);
    } else {
      Assert.fail('No method or component named ' + token + ' are registered.');
    }
  }

  private static isThereASingleComponentBoundToThisElement(element: HTMLElement): boolean {
    Assert.exists(element);
    return Utils.exists(Component.get(element));
  }

  private static dispatchMethodCallOnBoundComponent(methodName: string, element: HTMLElement, args: any[]): any {
    Assert.isNonEmptyString(methodName);
    Assert.exists(element);

    let boundComponent = Component.get(element);
    Assert.exists(boundComponent);

    let method = boundComponent[methodName];
    if (Utils.exists(method)) {
      return method.apply(boundComponent, args);
    } else {
      Assert.fail('No method named ' + methodName + ' exist on component ' + boundComponent.type);
    }
  }

  private static logFirstQueryCause(searchInterface: SearchInterface) {
    let firstQueryCause = HashUtils.getValue('firstQueryCause', HashUtils.getHash());
    if (firstQueryCause != null) {
      let meta = HashUtils.getValue('firstQueryMeta', HashUtils.getHash()) || {};
      searchInterface.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList[firstQueryCause], meta);
    } else {
      if (Utils.isNonEmptyString(searchInterface.getBindings().queryStateModel.get('q'))) {
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
          func()
        }
      })
    }
  }

  private static initExternalComponents(element: HTMLElement, options?: any) {
    if (options && options['externalComponents']) {
      let searchInterface = <SearchInterface>Component.get(element, SearchInterface);
      let queryStateModel = <QueryStateModel>Component.get(element, QueryStateModel);
      let componentStateModel = <ComponentStateModel>Component.get(element, ComponentStateModel);
      let queryController = <QueryController>Component.get(element, QueryController);
      let componentOptionsModel = <ComponentOptionsModel>Component.get(element, ComponentOptionsModel);
      let usageAnalytics = searchInterface.usageAnalytics;
      Assert.exists(searchInterface);
      Assert.exists(queryStateModel);
      Assert.exists(queryController);
      Assert.exists(componentStateModel);
      Assert.exists(usageAnalytics);
      let initParameters: IInitializationParameters = {
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
      _.each(options['externalComponents'], (externalComponent: HTMLElement) => {
        let elementToInstantiate = externalComponent;
        if (Utils.isHtmlElement(elementToInstantiate)) {
          Initialization.automaticallyCreateComponentsInside(elementToInstantiate, initParameters);
        }
      })
    }
  }

  private static createFunctionThatInitializesComponentOnElements(elements: Element[], componentClassId: string, componentClass: BaseComponent, initParameters: IInitializationParameters) {
    return () => {
      _.each(elements, (matchingElement: HTMLElement) => {
        if (Component.get(matchingElement, componentClassId) == null) {
          // If options were provided, lookup options for this component class and
          // also for the element id. Merge them and pass those to the factory method.
          let optionsToUse = undefined;
          if (Utils.exists(initParameters.options)) {
            let optionsForComponentClass = initParameters.options[componentClassId];
            let optionsForElementId = initParameters.options[matchingElement.id];
            let initOptions = initParameters.options['initOptions'] ? initParameters.options['initOptions'][componentClassId] : {};
            optionsToUse = Utils.extendDeep(optionsForElementId, initOptions);
            optionsToUse = Utils.extendDeep(optionsForComponentClass, optionsToUse);
          }
          let initParamToUse = _.extend({}, initParameters, { options: optionsToUse });
          Initialization.createComponentOfThisClassOnElement(componentClass['ID'], matchingElement, initParamToUse);
        }
      });
    }
  }
}
