import { exportGlobally } from '../../GlobalExports';
import { IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';

export interface ILogoOptions {}

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

  static options: ILogoOptions = {};

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

    const link = $$(
      'a',
      {
        className: 'coveo-powered-by coveo-footer-logo',
        href: 'http://www.coveo.com/',
        'aria-label': l('CoveoHomePage')
      },
      SVGIcons.icons.coveoPoweredBy
    );
    SVGDom.addClassToSVGInContainer(link.el, 'coveo-powered-by-svg');
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
