import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Initialization} from '../Base/Initialization';
import {$$} from "../../utils/Dom";

export interface ILogoOptions {
}

/**
 * Add a clickable Coveo logo in the interface.
 */
export class Logo extends Component {
  static ID = 'Logo';

  static options: ILogoOptions = {};

  constructor(public element: HTMLElement, public options?: ILogoOptions, bindings?: IComponentBindings) {
    super(element, Logo.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Logo, options);

    let link = $$('a', {
      className: 'coveo-powered-by coveo-footer-logo',
      href: 'http://www.coveo.com/'
    })

    this.element.appendChild(link.el);
  }
}

Initialization.registerAutoCreateComponent(Logo);
