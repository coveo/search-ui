import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization } from '../Base/Initialization';
import { CardOverlayEvents } from '../../events/CardOverlayEvents';
import { $$ } from '../../utils/Dom';
import { Assert } from '../../misc/Assert';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_CardOverlay';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { Utils } from '../../utils/Utils';

export interface ICardOverlayOptions {
  title: string;
  icon?: string;
}

/**
 * The CardOverlay component displays a button that the user can click to toggle the visibility of an overlay on top of
 * an {@link IQueryResult}. While this component typically populates a {@link CardActionBar} component, it is actually
 * possible to place a CardOverlay component anywhere in any result.
 *
 * The primary purpose of the CardOverlay component is to display additional information about a result in a format that
 * fits well within a card result layout (see [Result Layouts](https://developers.coveo.com/x/yQUvAg)).
 *
 * When initialized, this component creates a `<div class="coveo-card-overlay">` element as the last child of its parent
 * IQueryResult, and displays a button which toggles the visibility of the overlay.
 */
export class CardOverlay extends Component {
  static ID = 'CardOverlay';

  static doExport = () => {
    exportGlobally({
      CardOverlay: CardOverlay
    });
  };

  private parentCard: HTMLElement;
  private overlay: HTMLElement;

  /**
   * @componentOptions
   */
  static options: ICardOverlayOptions = {
    /**
     * Specifies the string to use for the overlay title and for the button text.
     *
     * Setting a value for this option is required for this component to work.
     */
    title: ComponentOptions.buildLocalizedStringOption({ required: true, defaultValue: 'NoTitle' }),

    /**
     * Specifies the icon to use for the overlay icon and for the button icon.
     *
     * The name of the icon to use should be specified in dashed case. ie: facet-expand
     */
    icon: ComponentOptions.buildIconOption()
  };

  /**
   * Creates a new CardOverlay component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the CardOverlay component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ICardOverlayOptions, bindings?: IComponentBindings) {
    super(element, CardOverlay.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CardOverlay, options);

    this.parentCard = $$(this.element).closest('.CoveoResult');
    Assert.exists(this.parentCard);
    $$(this.parentCard).addClass('coveo-with-card-overlay');
    this.createOverlay();
    this.createButton(this.element);
    this.closeOverlay();
  }

  /**
   * Toggles the CardOverlay visibility.
   *
   * @param swtch Specifying a value for this parameter forces the component visibility to take the corresponding value
   * (`true` for visible; `false` for hidden).
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
   * Opens the CardOverlay.
   *
   * Also triggers the {@link CardOverlayEvents.openCardOverlay} event.
   */
  public openOverlay() {
    $$(this.overlay).removeClass('coveo-hidden-for-tab-nav');
    $$(this.overlay).addClass('coveo-opened');
    $$(this.parentCard).addClass('coveo-card-overlay-opened');
    this.bind.trigger(this.element, CardOverlayEvents.openCardOverlay);
  }

  /**
   * Closes the CardOverlay.
   *
   * Also triggers the {@link CardOverlayEvents.closeCardOverlay} event.
   */
  public closeOverlay() {
    $$(this.overlay).addClass('coveo-hidden-for-tab-nav');
    $$(this.overlay).removeClass('coveo-opened');
    $$(this.parentCard).removeClass('coveo-card-overlay-opened');
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
    const icon = $$('span', { className: 'coveo-icon coveo-open-card-overlay' }, SVGIcons.icons.arrowDown);
    SVGDom.addClassToSVGInContainer(icon.el, 'coveo-open-card-overlay-svg');
    let overlayFooter = $$('div', { className: 'coveo-card-overlay-footer', tabindex: '0' }, icon.el);
    overlayFooter.on('click', () => this.toggleOverlay(false));
    this.bind.on(overlayFooter.el, 'keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, () => this.toggleOverlay(false)));

    this.overlay.appendChild(overlayFooter.el);

    this.parentCard.appendChild(this.overlay);
  }

  private createButton(element: HTMLElement) {
    if (this.options.icon) {
      const icon = $$('span', { className: 'coveo-icon ' }, SVGIcons.icons[this.options.icon]).el;
      element.appendChild(icon);
      SVGDom.addClassToSVGInContainer(element, `coveo-${Utils.toDashCase(this.options.icon)}-svg`);
    }
    element.appendChild($$('span', { className: 'coveo-label' }, this.options.title).el);
    element.setAttribute('tabindex', '0');
    $$(element).on('click', () => this.toggleOverlay());
    this.bind.on(element, 'keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, () => this.toggleOverlay()));
  }
}

Initialization.registerAutoCreateComponent(CardOverlay);
