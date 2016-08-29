import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Initialization} from '../Base/Initialization';
import {$$} from '../../utils/Dom';
import {QueryEvents} from '../../events/QueryEvents';
import {IQuerySuccessEventArgs} from '../../events/QueryEvents';

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
    });

    this.element.appendChild(link.el);

    this.bind.onRootElement(QueryEvents.noResults, () => this.hide());
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => {
      if (data.results.results.length > 0) {
        this.show();
      } else {
        this.hide();
      }
    });
    this.bind.onRootElement(QueryEvents.queryError, () => this.hide());
  }

  public hide() {
    $$(this.element).addClass('coveo-hidden');
  }

  public show() {
    $$(this.element).removeClass('coveo-hidden');
  }
}

Initialization.registerAutoCreateComponent(Logo);
