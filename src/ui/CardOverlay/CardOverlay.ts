import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {Initialization} from '../Base/Initialization';
import {$$} from '../../utils/Dom';

export interface ICardOverlayOptions {
  title: string;
  icon?: string;
}

/**
 * This component is used to display a button which triggers an overlay on a
 * card. It is meant to be used as a child of a {@link CardActionBar} component.
 *
 * Its primary purpose is to display additional information about a result in a
 * card format.
 */
export class CardOverlay extends Component {
  static ID = 'CardOverlay';

  private parentCard: HTMLElement;

  /**
   * @componentOptions
   */
  static options: ICardOverlayOptions = {
    /**
     * The title of the overlay. Will also be displayed as the button's text.
     */
    title: ComponentOptions.buildStringOption({ required: true }),
    /**
     * The icon of the overlay. Will also be displayed as the button's icon.
     */
    icon: ComponentOptions.buildStringOption()
  };

  constructor(public element: HTMLElement, public options?: ICardOverlayOptions, bindings?: IComponentBindings) {
    super(element, CardOverlay.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CardOverlay, options);

    this.parentCard = $$(this.element).closest('.CoveoResult');
    this.createOverlay();
    this.createButton();
  }

  private createOverlay() {
    let overlay = $$('div', { className: 'coveo-card-overlay' }).el;
    // Transfer all of its children to the overlay
    while (this.element.childNodes.length > 0) {
      overlay.appendChild(this.element.firstChild);
    }
    this.parentCard.appendChild(overlay);
  }

  private createButton() {
    if (this.options.icon) {
      $$(this.element).prepend($$('span', { className: 'coveo-icon ' + this.options.icon }).el);
    }
    this.element.appendChild(document.createTextNode(this.options.title));
  }
}

Initialization.registerAutoCreateComponent(CardOverlay);
