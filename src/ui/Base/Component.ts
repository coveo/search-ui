import { Assert } from '../../misc/Assert';
import { IQueryResult } from '../../rest/QueryResult';
import { Utils } from '../../utils/Utils';
import { JQueryUtils } from '../../utils/JQueryutils';
import { $$, Dom } from '../../utils/Dom';
import { QueryStateModel } from '../../models/QueryStateModel';
import { ComponentStateModel } from '../../models/ComponentStateModel';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import { QueryController } from '../../controllers/QueryController';
import { SearchInterface } from '../../ui/SearchInterface/SearchInterface';
import { IAnalyticsClient } from '../../ui/Analytics/AnalyticsClient';
import { NoopAnalyticsClient } from '../../ui/Analytics/NoopAnalyticsClient';
import { BaseComponent } from './BaseComponent';
import { IComponentBindings } from './ComponentBindings';
import { DebugEvents } from '../../events/DebugEvents';
import * as _ from 'underscore';
import { Model } from '../../models/Model';

/**
 * Definition for a Component.
 */
export interface IComponentDefinition {
  /**
   * The static ID that each component need to be identified.<br/>
   * For example, SearchButton -> static ID : SearchButton -> className : CoveoSearchButton
   */
  ID: string;
  /**
   * The generated `className` for this component.<br/>
   * For example, SearchButton -> static ID : SearchButton -> className : CoveoSearchButton
   */
  className?: string;
  /**
   * Function that can be called to export one or multiple module in the global scope.
   */
  doExport?: () => void;
  /**
   * Constructor for each component
   * @param element The HTMLElement on which the component will instantiate.
   * @param options The available options for the component.
   * @param bindings The bindings (or environment) for the component.For exemple, the {@link QueryController} or {@link SearchInterface}. Optional, if not provided, the component will resolve those automatically. This has a cost on performance, though, since it has to traverses it's parents to find the correct elements.
   * @param args Optional arguments, depending on the component type. For example, ResultComponent will receive the result there.
   */
  new (element: HTMLElement, options: any, bindings: IComponentBindings, ...args: any[]): Component;
  /**
   * The available options for the component.
   */
  options?: any;
  /**
   * The optional parent of the component, which will be a component itself.
   */
  parent?: IComponentDefinition;
  /**
   * The optional index fields that the component possess or display.
   */
  fields?: string[];
}

/**
 * The base class for every component in the framework.
 */
export class Component extends BaseComponent {
  /**
   * Allows the component to bind events and execute them only when it is enabled.
   * @type {Coveo.ComponentEvents}
   */
  public bind = new ComponentEvents(this);
  /**
   * A reference to the root HTMLElement (the {@link SearchInterface}).
   */
  public root: HTMLElement;
  /**
   * Contains the state of the query. Allows to get/set values. Trigger query state event when modified. Each component can listen to those events.
   */
  public queryStateModel: QueryStateModel;
  /**
   * Contains the state of different component (enabled vs disabled). Allows to get/set values. Trigger component state event when modified. Each component can listen to those events.
   */
  public componentStateModel: ComponentStateModel;
  /**
   * Contains the singleton that allows to trigger queries.
   */
  public queryController: QueryController;
  /**
   * A reference to the root of every component, the {@link SearchInterface}.
   */
  public searchInterface: SearchInterface;
  /**
   * A reference to the {@link Analytics.client}.
   */
  public usageAnalytics: IAnalyticsClient;
  /**
   * Contains the state of options for differents component. Mainly used by {@link ResultLink}.
   */
  public componentOptionsModel: ComponentOptionsModel;
  public ensureDom: Function;
  public options?: any;

  /**
   * Create a new Component. Resolve all {@link IComponentBindings} if not provided.<br/>
   * Create a new Logger for this component.
   * Attach the component to the {@link SearchInterface}.<br/>
   * @param element The HTMLElement on which to create the component. Used to bind data on the element.
   * @param type The unique identifier for this component. See : {@link IComponentDefinition.ID}. Used to generate the unique Coveo CSS class associated with every component.
   * @param bindings The environment for every component. Optional, but omitting to provide one will impact performance.
   */
  constructor(public element: HTMLElement, public type: string, bindings: IComponentBindings = {}) {
    super(element, type);
    this.root = bindings.root || this.resolveRoot();
    this.queryStateModel = bindings.queryStateModel || this.resolveQueryStateModel();
    this.componentStateModel = bindings.componentStateModel || this.resolveComponentStateModel();
    this.queryController = bindings.queryController || this.resolveQueryController();
    this.searchInterface = bindings.searchInterface || this.resolveSearchInterface();
    this.usageAnalytics = bindings.usageAnalytics || this.resolveUA();
    this.componentOptionsModel = bindings.componentOptionsModel || this.resolveComponentOptionsModel();
    this.ensureDom = _.once(() => this.createDom());

    if (this.searchInterface != null) {
      this.searchInterface.attachComponent(type, this);
    }

    this.initDebugInfo();
  }

  /**
   * Return the bindings, or environment, for the current component.
   * @returns {IComponentBindings}
   */
  public getBindings(): IComponentBindings {
    return <IComponentBindings>{
      root: this.root,
      queryStateModel: this.queryStateModel,
      queryController: this.queryController,
      searchInterface: this.searchInterface,
      componentStateModel: this.componentStateModel,
      componentOptionsModel: this.componentOptionsModel,
      usageAnalytics: this.usageAnalytics
    };
  }

  public createDom() {
    // By default we do nothing
  }

  public resolveSearchInterface(): SearchInterface {
    return <SearchInterface>Component.resolveBinding(this.element, SearchInterface);
  }

  public resolveRoot(): HTMLElement {
    var resolvedSearchInterface = Component.resolveBinding(this.element, SearchInterface);
    return resolvedSearchInterface ? resolvedSearchInterface.element : undefined;
  }

  public resolveQueryController(): QueryController {
    return <QueryController>Component.resolveBinding(this.element, QueryController);
  }

  public resolveComponentStateModel(): ComponentStateModel {
    return <ComponentStateModel>Component.resolveBinding(this.element, ComponentStateModel);
  }

  public resolveQueryStateModel(): QueryStateModel {
    return <QueryStateModel>Component.resolveBinding(this.element, QueryStateModel);
  }

  public resolveComponentOptionsModel(): ComponentOptionsModel {
    return <ComponentOptionsModel>Component.resolveBinding(this.element, ComponentOptionsModel);
  }

  public resolveUA(): IAnalyticsClient {
    var searchInterface = this.resolveSearchInterface();
    return searchInterface && searchInterface.usageAnalytics ? searchInterface.usageAnalytics : new NoopAnalyticsClient();
  }

  public resolveResult(): IQueryResult {
    return Component.getResult(this.element);
  }

  private initDebugInfo() {
    $$(this.element).on('dblclick', (e: MouseEvent) => {
      if (e.altKey) {
        var debugInfo = this.debugInfo();
        if (debugInfo != null) {
          $$(this.root).trigger(DebugEvents.showDebugPanel, this.debugInfo());
        }
      }
    });
  }

  /**
   * Get the bound component to the given HTMLElement. Throws an assert if the HTMLElement has no component bound, unless using the noThrow argument.<br/>
   * If there is multiple component bound to the current HTMLElement, you must specify the component class.
   * @param element HTMLElement for which to get the bound component.
   * @param componentClass Optional component class. If the HTMLElement has multiple components bound, you must specify which one you are targeting.
   * @param noThrow Boolean option to tell the method to not throw on error.
   * @returns {Component}
   */
  static get(element: HTMLElement, componentClass?: any, noThrow?: boolean): BaseComponent {
    Assert.exists(element);

    if (_.isString(componentClass)) {
      return <Component>element[Component.computeCssClassNameForType(componentClass)];
    } else if (Utils.exists(componentClass)) {
      Assert.exists(componentClass.ID);
      return <Component>element[Component.computeCssClassNameForType(componentClass.ID)];
    } else {
      // No class specified, but we support returning the bound component
      // if there is exactly one.
      var boundComponents = BaseComponent.getBoundComponentsForElement(element);
      if (!noThrow) {
        Assert.check(
          boundComponents.length <= 1,
          'More than one component is bound to this element. You need to specify the component type.'
        );
      }
      return boundComponents[0];
    }
  }

  static getResult(element: HTMLElement, noThrow: boolean = false): IQueryResult {
    var resultElement = $$(element).closest('.CoveoResult');
    Assert.check(noThrow || resultElement != undefined);
    return resultElement['CoveoResult'];
  }

  static bindResultToElement(element: HTMLElement, result: IQueryResult) {
    Assert.exists(element);
    Assert.exists(result);
    $$(element).addClass('CoveoResult');
    element['CoveoResult'] = result;
    let jQuery = JQueryUtils.getJQuery();
    if (jQuery) {
      jQuery(element).data(result);
    }
  }

  static resolveBinding(element: HTMLElement, componentClass: any): BaseComponent {
    Assert.exists(element);
    Assert.exists(componentClass);
    Assert.exists(componentClass.ID);
    // first, look down
    var found;
    if ($$(element).is('.' + Component.computeCssClassNameForType(componentClass.ID))) {
      found = element;
    } else {
      var findDown = $$(element).findClass(Component.computeCssClassNameForType(componentClass.ID));
      if (!findDown || findDown.length == 0) {
        var findUp = $$(element).closest(Component.computeCssClassNameForType(componentClass.ID));
        if (findUp) {
          found = findUp;
        }
      } else {
        found = findDown;
      }
    }
    if (found) {
      return <BaseComponent>found[Component.computeCssClassNameForType(componentClass.ID)];
    } else {
      return undefined;
    }
  }

  static pointElementsToDummyForm(element: HTMLElement) {
    let inputs = $$(element).is('input') ? [element] : [];
    inputs = inputs.concat($$(element).findAll('input'));
    _.each(_.compact(inputs), input => {
      input.setAttribute('form', 'coveo-dummy-form');
    });
  }
}

/**
 * The `ComponentEvents` class is used by the various Coveo Component to trigger events and bind event handlers. It adds
 * logic to execute handlers or triggers only when a component is "enabled", which serves as a way to avoid executing
 * handlers on components that are invisible and inactive in the query.
 *
 * Typically, a component is disabled when it is not active in the current [`Tab`]{@link Tab}. It can also be disabled
 * by external code, however.
 *
 * To manually enable or disable a component, simply use its [`enable`]{@link Component.enable} or
 * [`disable`]{@link Component.disable} method.
 */
export class ComponentEvents {
  /**
   * Creates a new `ComponentEvents` instance for a [`Component`]{@link Component}.
   * @param owner The [`Component`]{@link Component} that owns the event handlers and triggers.
   */
  constructor(public owner: Component) {
    Assert.exists(owner);
  }

  /**
   * Executes the handler for an event on a target element.
   *
   * Executes only if the component is enabled (see the [`enable`]{@link Component.enable} method).
   * @param el The element from which the event originates.
   * @param event The event for which to register a handler.
   * @param handler The function to execute when the event is triggered.
   */
  public on(el: HTMLElement | Window | Document, event: string, handler: Function);
  public on(el: Dom, event: string, handler: Function);
  public on(arg: any, event: string, handler: Function) {
    if (!JQueryUtils.getJQuery() || !JQueryUtils.isInstanceOfJQuery(arg)) {
      var htmlEl: HTMLElement = arg;
      $$(htmlEl).on(event, this.wrapToCallIfEnabled(handler));
    } else {
      var jq: Dom = arg;
      jq.on(event, this.wrapToCallIfEnabled(handler));
    }
  }

  /**
   * Executes the handler for the given event on the given target element.<br/>
   * Execute only if the component is "enabled" (see {@link Component.enable}).<br/>
   * Execute the handler only ONE time.
   * @param el The target on which the event will originate.
   * @param event The event for which to register an handler.
   * @param handler The function to execute when the event is triggered.
   */
  public one(el: HTMLElement, event: string, handler: Function);
  public one(el: Dom, event: string, handler: Function);
  public one(arg: any, event: string, handler: Function) {
    if (arg instanceof HTMLElement) {
      var htmlEl: HTMLElement = arg;
      $$(htmlEl).one(event, this.wrapToCallIfEnabled(handler));
    } else {
      var jq: Dom = arg;
      jq.one(event, this.wrapToCallIfEnabled(handler));
    }
  }

  /**
   * Bind on the "root" of the Component. The root is typically the {@link SearchInterface}.<br/>
   * Bind an event using native javascript code.
   * @param event The event for which to register an handler.
   * @param handler The function to execute when the event is triggered.
   */
  public onRootElement<T>(event: string, handler: (args: T) => any) {
    this.on(this.owner.root, event, handler);
  }

  /**
   * Bind on the "root" of the Component. The root is typically the {@link SearchInterface}.<br/>
   * Bind an event using native javascript code.
   * The handler will execute only ONE time.
   * @param event The event for which to register an handler.
   * @param handler The function to execute when the event is triggered.
   */
  public oneRootElement<T>(event: string, handler: (args: T) => any) {
    this.one(this.owner.root, event, handler);
  }

  /**
   * Bind an event related specially to the query state model.<br/>
   * This will build the correct string event and execute the handler only if the component is activated.
   * @param eventType The event type for which to register an event.
   * @param attribute The attribute for which to register an event.
   * @param handler The handler to execute when the query state event is triggered.
   */
  public onQueryState<T>(eventType: string, attribute?: string, handler?: (args: T) => any) {
    this.onRootElement(this.getQueryStateEventName(eventType, attribute), handler);
  }

  /**
   * Bind an event related specially to the component option model.
   * This will build the correct string event and execute the handler only if the component is activated.
   * @param eventType The event type for which to register an event.
   * @param attribute The attribute for which to register an event.
   * @param handler The handler to execute when the query state event is triggered.
   */
  public onComponentOptions<T>(eventType: string, attribute?: string, handler?: (args: T) => any) {
    this.onRootElement(this.getComponentOptionEventName(eventType, attribute), handler);
  }

  /**
   * Bind an event related specially to the query state model.<br/>
   * This will build the correct string event and execute the handler only if the component is activated.<br/>
   * Will execute only once.
   * @param eventType The event type for which to register an event.
   * @param attribute The attribute for which to register an event.
   * @param handler The handler to execute when the query state event is triggered.
   */
  public oneQueryState<T>(eventType: string, attribute?: string, handler?: (args: T) => any) {
    this.oneRootElement(this.getQueryStateEventName(eventType, attribute), handler);
  }

  /**
   * Trigger an event on the target element, with optional arguments.
   * @param el The target HTMLElement on which to trigger the event.
   * @param event The event to trigger.
   * @param args The optional argument to pass to the handlers.
   */
  public trigger(el: HTMLElement, event: string, args?: Object);
  public trigger(el: Dom, event: string, args?: Object);
  public trigger(arg: any, event: string, args?: Object) {
    this.wrapToCallIfEnabled(() => {
      if (arg instanceof HTMLElement) {
        var htmlEl: HTMLElement = arg;
        $$(htmlEl).trigger(event, args);
      } else {
        var jq: Dom = arg;
        jq.trigger(event, args);
      }
    })(args);
  }

  /**
   * Execute the function only if the component is enabled.
   * @param func The function to execute if the component is enabled.
   * @returns {function(...[any]): *}
   */
  private wrapToCallIfEnabled(func: Function) {
    return (...args: any[]) => {
      if (!this.owner.disabled) {
        if (args && args[0] instanceof CustomEvent) {
          if (args[0].detail) {
            args = [args[0].detail];
          }
        } else if (args && JQueryUtils.isInstanceOfJqueryEvent(args[0])) {
          if (args[1] != undefined) {
            args = [args[1]];
          } else {
            args = [];
          }
        }
        return func.apply(this.owner, args);
      }
    };
  }

  private getQueryStateEventName(eventType: string, attribute?: string): string {
    return this.getModelEvent(this.owner.queryStateModel, eventType, attribute);
  }

  private getComponentOptionEventName(eventType: string, attribute?: string): string {
    return this.getModelEvent(this.owner.componentOptionsModel, eventType, attribute);
  }

  private getModelEvent(model: Model, eventType: string, attribute?: string) {
    var evtName;
    if (eventType && attribute) {
      evtName = model.getEventName(eventType + attribute);
    } else {
      evtName = model.getEventName(eventType);
    }
    return evtName;
  }
}
