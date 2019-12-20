import { IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { exportGlobally } from '../../GlobalExports';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';

export type ValidLogoTarget = '_top' | '_blank' | '_self' | '_parent';

export interface ILogoOptions {
  target: string;
}

/**
 * The Logo component adds a clickable Coveo logo in the search interface.
 */
export class Logo extends Component {
  static ID = 'Logo';

  static doExport = () => {
    exportGlobally({
      Logo: Logo
    });
  };

  /**
   * The possible options for the component
   * @componentOptions
   */
  static options: ILogoOptions = {
    /**
     * Specifies how the link to the Coveo website should be opened.
     *
     * Valid values supported are `_top`, `_blank`, `_self`, `_parent`.
     *
     * Default value is `undefined`, meaning standard browser behaviour for links will be respected.
     */
    target: ComponentOptions.buildStringOption<ValidLogoTarget>()
  };

  /**
   * Creates a new Logo component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Logo component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ILogoOptions, bindings?: IComponentBindings) {
    super(element, Logo.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Logo, options);
    this.buildLink();
    this.bind.onRootElement(QueryEvents.queryError, () => this.hide());
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
  }

  private buildLink() {
    const link = $$(
      'a',
      {
        className: 'coveo-powered-by coveo-footer-logo',
        href: 'https://www.coveo.com/',
        'aria-label': l('CoveoHomePage')
      },
      SVGIcons.icons.coveoPoweredBy
    );
    this.options.target && link.setAttribute('target', this.options.target);

    SVGDom.addClassToSVGInContainer(link.el, 'coveo-powered-by-svg');
    this.element.appendChild(link.el);
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    data.results.results.length > 0 ? this.show() : this.hide();
  }

  public hide() {
    $$(this.element).addClass('coveo-hidden');
  }

  public show() {
    $$(this.element).removeClass('coveo-hidden');
  }
}

Initialization.registerAutoCreateComponent(Logo);
