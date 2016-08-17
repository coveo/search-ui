import {Assert} from '../../misc/Assert';
import {$$} from '../../utils/Dom';
import {DebugEvents} from '../../events/DebugEvents';
import {Logger} from '../../misc/Logger';

declare var Coveo;

export interface IComponentHtmlElement extends HTMLElement {
  CoveoBoundComponents?: BaseComponent[];
}

/**
 * Every component in the framework ultimately inherits from this base component class.
 */
export class BaseComponent {
  /**
   * Allows component to log in the dev console
   */
  public logger: Logger;
  /**
   * A disabled component will not participate in the query, or listen to {@link ComponentEvents}
   * @type {boolean}
   */
  public disabled = false;
  /**
   * The static ID that each component need to be identified.<br/>
   * For example, SearchButton -> static ID : SearchButton -> className : CoveoSearchButton
   */
  static ID: string;

  constructor(public element: HTMLElement, public type: string) {
    Assert.exists(element);
    Assert.isNonEmptyString(type);
    this.logger = new Logger(this);
    this.initDebugInfo();
    BaseComponent.bindComponentToElement(element, this);
  }

  /**
   * Return the debug info about this component
   * @returns {any}
   */
  public debugInfo() {
    var info: any = {};
    info[this['constructor']['ID']] = this;
    return info;
  }

  /**
   * Disable the component.
   * Normally this means that the component won't execute handlers for the framework events (query events, for example).
   * Component are enabled by default on creation.
   */
  public disable() {
    this.disabled = true;
  }

  /**
   * Enable the component.
   * Normally this means that the component will execute handlers for the framework events (query events, for example).
   * Components are enabled by default on creation.
   */
  public enable() {
    this.disabled = false;
  }


  private initDebugInfo() {
    $$(this.element).on('doubleclick', function (e: MouseEvent) {
      if (e.altKey) {
        var debugInfo = this.debugInfo();
        if (debugInfo != null) {
          $(this.root).trigger(DebugEvents.showDebugPanel, this.debugInfo());
        }
      }
    })
  }

  static bindComponentToElement(element: HTMLElement, component: BaseComponent) {
    Assert.exists(element);
    Assert.exists(component);
    Assert.isNonEmptyString(component.type);
    element[BaseComponent.computeCssClassNameForType(component.type)] = component;
    $$(element).addClass(BaseComponent.computeCssClassNameForType(component.type));
    BaseComponent.getBoundComponentsForElement(element).push(component);
  }

  static computeCssClassName(componentClass: any): string {
    return componentClass['className'] ? componentClass['className'] : componentClass['className'] = BaseComponent.computeCssClassNameForType(componentClass['ID']);
  }

  static computeCssClassNameForType(type: string): string {
    Assert.isNonEmptyString(type);
    return 'Coveo' + type;
  }

  static computeSelectorForType(type: string): string {
    Assert.isNonEmptyString(type);
    return '.' + BaseComponent.computeCssClassNameForType(type);
  }

  static getBoundComponentsForElement(element: IComponentHtmlElement): BaseComponent[] {
    Assert.exists(element);

    if (element.CoveoBoundComponents == null) {
      element.CoveoBoundComponents = [];
    }
    return element.CoveoBoundComponents;
  }

  static getComponentRef(component: string): any {
    return Coveo[component]
  }

}
