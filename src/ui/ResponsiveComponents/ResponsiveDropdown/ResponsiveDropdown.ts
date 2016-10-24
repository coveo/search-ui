import {ResponsiveDropdownHeader} from './ResponsiveDropdownHeader';
import {ResponsiveDropdownContent} from './ResponsiveDropdownContent';
import {$$, Dom} from '../../../utils/Dom';
import {EventsUtils} from '../../../utils/EventsUtils';

export class ResponsiveDropdown {

  public static TRANSPARENT_BACKGROUND_OPACITY: string = '0.9';

  public isOpened: boolean = false;

  private onOpenHandlers: Function[] = [];
  private onCloseHandlers: Function[] = [];
  private previousSibling: Dom;
  private parent: Dom;
  private popupBackground: Dom;
  private popupBackgroundIsEnabled: boolean = true;

  constructor(public dropdownContent: ResponsiveDropdownContent, public dropdownHeader: ResponsiveDropdownHeader, public coveoRoot: Dom) {
    this.popupBackground = this.buildPopupBackground();
    this.bindOnClickDropdownHeaderEvent();
    this.saveContentPosition();
  }

  public registerOnOpenHandler(handler: Function) {
    this.onOpenHandlers.push(handler);
  }

  public registerOnCloseHandler(handler: Function) {
    this.onCloseHandlers.push(handler);
  }

  public cleanUp() {
    this.close();
    this.dropdownHeader.cleanUp();
    this.dropdownContent.cleanUp();
    this.restoreContentPosition();
 }

  public open() {
    this.isOpened = true;
    this.dropdownHeader.open();
    this.dropdownContent.positionDropdown();
    _.each(this.onOpenHandlers, handler => {
      handler();
    });
    this.showPopupBackground();
  }

  public close() {
    this.isOpened = false;
    _.each(this.onCloseHandlers, handler => {
      handler();
    });

    this.dropdownHeader.close();
    this.dropdownContent.hideDropdown();

    // Because of DOM manipulation, sometimes the animation will not trigger. Accessing the computed styles makes sure
    // the animation will happen. Adding this here because its possible that this element has recently been manipulated.
    this.hidePopupBackground();
  }

  public disablePopupBackground() {
    this.popupBackgroundIsEnabled = false;
  }

  private bindOnClickDropdownHeaderEvent() {
    this.dropdownHeader.element.on('click', () => {
      if (this.isOpened) {
        this.close();
      } else {
        this.open();
      }
    });
  }

  private showPopupBackground() {
    if (this.popupBackgroundIsEnabled) {
      this.coveoRoot.el.appendChild(this.popupBackground.el);
      window.getComputedStyle(this.popupBackground.el).opacity;
      this.popupBackground.el.style.opacity = ResponsiveDropdown.TRANSPARENT_BACKGROUND_OPACITY;
    }
  }

  private hidePopupBackground() {
    if (this.popupBackgroundIsEnabled) {
      window.getComputedStyle(this.popupBackground.el).opacity;
      this.popupBackground.el.style.opacity = '0';
    }
  }

  private buildPopupBackground(): Dom {
    let popupBackground = $$('div', { className: 'coveo-facet-dropdown-background' });
    EventsUtils.addPrefixedEvent(popupBackground.el, 'TransitionEnd', () => {
      if (popupBackground.el.style.opacity == '0') {
        popupBackground.detach();
      }
    });
    popupBackground.on('click', () => this.close());
    return popupBackground;
  }

  private saveContentPosition() {
    let dropdownContentPreviousSibling = this.dropdownContent.element.el.previousSibling;
    let dropdownContentParent = this.dropdownContent.element.el.parentElement;
    this.previousSibling = dropdownContentPreviousSibling ? $$(<HTMLElement>dropdownContentPreviousSibling) : null;
    this.parent = $$(dropdownContentParent);
  }

  private restoreContentPosition() {
    if (this.previousSibling) {
      this.dropdownContent.element.insertAfter(this.previousSibling.el);
    } else {
      this.parent.prepend(this.dropdownContent.element.el);
    }
  }
}
