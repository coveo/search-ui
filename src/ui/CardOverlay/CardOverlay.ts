import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Initialization} from '../Base/Initialization';
import {CardOverlayEvents} from '../../events/CardOverlayEvents';
import {$$} from '../../utils/Dom';
import {Assert} from '../../misc/Assert';

export interface ICardOverlayOptions {
  title: string;
  icon?: string;
}

/**
 * This component is used to display a button which, when clicked, triggers an
 * overlay on top of a Result. It is usually found inside a {@link
 * CardActionBar} component, although it can be used in any {@link Result}
 * component.
 *
 * Its primary purpose is to display additional information about a Result in a
 * format that fits well within a Card.
 *
 * When initialized, it will create a `<div class="coveo-card-overlay">` element
 * as the last child of its parent {@link Result} component, and will display a
 * button which toggles the visibility of the overlay.
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
    icon: ComponentOptions.buildIconOption()
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
   * Toggle the visibility of the CardOverlay
   *
   * @param swtch If specified, will force to this value (`true` for visible, `false` for hidden).
   */
  public toggleOverlay(swtch?: boolean) {
    if (swtch !== undefined) {
      swtch ? this.openOverlay() : this.closeOverlay();
    } else {
      if ($$(this.overlay).hasClass('coveo-opened')) {
        this.closeOverlay();
      } else {
        this.openOverlay();
      }
    }
  }

  /**
   * Open the CardOverlay
   */
  public openOverlay() {
    $$(this.overlay).addClass('coveo-opened');
    this.bind.trigger(this.element, CardOverlayEvents.openCardOverlay);
  }

  /**
   * Close the CardOverlay
   */
  public closeOverlay() {
    $$(this.overlay).removeClass('coveo-opened');
    this.bind.trigger(this.element, CardOverlayEvents.closeCardOverlay);
  }

  private createOverlay() {
    this.overlay = $$('div', { className: 'coveo-card-overlay' }).el;

    // Create header
    let overlayHeader = $$('div', { className: 'coveo-card-overlay-header' }).el;
    this.createButton(overlayHeader);
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

  private createButton(element: HTMLElement) {
    if (this.options.icon) {
      element.appendChild($$('span', { className: 'coveo-icon ' + this.options.icon }).el);
    }
    element.appendChild($$('span', { className: 'coveo-label' }, this.options.title).el);
    $$(element).on('click', () => this.toggleOverlay());
  }
}

Initialization.registerAutoCreateComponent(CardOverlay);
