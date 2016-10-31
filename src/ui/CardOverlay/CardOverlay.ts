import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {Initialization} from '../Base/Initialization';
import {$$} from '../../utils/Dom';
import {Assert} from '../../misc/Assert';

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
  private overlay: HTMLElement;

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
    Assert.exists(this.parentCard);
    this.createOverlay();
    this.createButton(this.element);
  }

  /**
   * Toggle the visibility of the card overlay.
   *
   * @param swtch If specified, will force to this value (`true` for visible, `false` for hidden).
   */
  public toggleOverlay(swtch?: boolean) {
    $$(this.overlay).toggleClass('coveo-opened', swtch);
  }

  private createOverlay() {
    this.overlay = $$('div', { className: 'coveo-card-overlay' }).el;

    // Create header
    let overlayHeader = $$('div', { className: 'coveo-card-overlay-header' }).el;
    this.createButton(overlayHeader, false);
    this.overlay.appendChild(overlayHeader);

    // Create body
    let overlayBody = $$('div', { className: 'coveo-card-overlay-body' }).el;
    // Transfer all of element's children to the overlay
    while (this.element.childNodes.length > 0) {
      overlayBody.appendChild(this.element.firstChild);
    }
    this.overlay.appendChild(overlayBody);

    // Create footer
    let overlayFooter = $$('div', { className: 'coveo-card-overlay-footer' },
      $$('span', { className: 'coveo-icon coveo-sprites-arrow-down' }));
    overlayFooter.on('click', () => this.toggleOverlay(false));
    this.overlay.appendChild(overlayFooter.el);

    this.parentCard.appendChild(this.overlay);
  }

  private createButton(element: HTMLElement, clickAction: boolean = true) {
    if (this.options.icon) {
      element.appendChild($$('span', { className: 'coveo-icon ' + this.options.icon }).el);
    }
    element.appendChild(document.createTextNode(this.options.title));
    if (clickAction) {
      $$(element).on('click', () => this.toggleOverlay());
    }
  }
}

Initialization.registerAutoCreateComponent(CardOverlay);
