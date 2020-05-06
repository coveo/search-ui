import { ResponsiveDropdownHeader } from './ResponsiveDropdownHeader';
import { IResponsiveDropdownContent } from './ResponsiveDropdownContent';
import { $$, Dom } from '../../../utils/Dom';
import { EventsUtils } from '../../../utils/EventsUtils';
import * as _ from 'underscore';
import { AccessibleButton } from '../../../utils/AccessibleButton';
import { KeyboardUtils, KEYBOARD } from '../../../utils/KeyboardUtils';
import { InitializationEvents } from '../../../events/InitializationEvents';
import { Assert } from '../../../misc/Assert';
import { l } from '../../../strings/Strings';

export enum ResponsiveDropdownEvent {
  OPEN = 'responsiveDropdownOpen',
  CLOSE = 'responsiveDropdownClose'
}

type HandlerCall = { handler: Function; context: any };

export class ResponsiveDropdown {
  public static TRANSPARENT_BACKGROUND_OPACITY: string = '0.9';
  public static DROPDOWN_BACKGROUND_CSS_CLASS_NAME: string = 'coveo-dropdown-background';

  public isOpened: boolean = false;
  private onOpenHandlers: HandlerCall[] = [];
  private onCloseHandlers: HandlerCall[] = [];
  private popupBackground: Dom;
  private popupBackgroundIsEnabled: boolean = true;
  private lockScrollIsEnabled: boolean = false;
  private previousSibling: Dom;
  private parent: Dom;

  constructor(public dropdownContent: IResponsiveDropdownContent, public dropdownHeader: ResponsiveDropdownHeader, public coveoRoot: Dom) {
    Assert.exists(dropdownContent);
    Assert.exists(dropdownHeader);
    Assert.exists(coveoRoot);

    this.popupBackground = this.buildPopupBackground();
    this.bindOnClickDropdownHeaderEvent();
    this.saveContentPosition();
    this.bindOnKeyboardEscapeEvent();
    this.bindNukeEvents();
  }

  private set scrollLocked(lock: boolean) {
    document.body.classList.toggle('coveo-block-scrolling', lock);
  }

  public registerOnOpenHandler(handler: Function, context) {
    Assert.exists(handler);
    this.onOpenHandlers.push({ handler: handler, context: context });
  }

  public registerOnCloseHandler(handler: Function, context) {
    Assert.exists(handler);
    this.onCloseHandlers.push({ handler: handler, context: context });
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
    _.each(this.onOpenHandlers, handlerCall => {
      handlerCall.handler.apply(handlerCall.context);
    });
    this.showPopupBackground();
    this.lockScroll();
    $$(this.dropdownHeader.element).trigger(ResponsiveDropdownEvent.OPEN);
  }

  public close() {
    this.isOpened = false;
    _.each(this.onCloseHandlers, handlerCall => {
      handlerCall.handler.apply(handlerCall.context);
    });

    this.dropdownHeader.close();
    this.dropdownContent.hideDropdown();
    this.hidePopupBackground();
    this.unlockScroll();
    $$(this.dropdownHeader.element).trigger(ResponsiveDropdownEvent.CLOSE);
  }

  public disablePopupBackground() {
    this.popupBackgroundIsEnabled = false;
  }

  public enableScrollLocking() {
    this.lockScrollIsEnabled = true;
  }

  private bindOnClickDropdownHeaderEvent() {
    new AccessibleButton()
      .withElement(this.dropdownHeader.element)
      .withSelectAction(() => (this.isOpened ? this.close() : this.open()))
      .withLabel(l(this.isOpened ? 'CloseFiltersDropdown' : 'OpenFiltersDropdown'))
      .build();
  }

  private closeIfOpened = () => {
    this.isOpened && this.close();
  };

  private bindOnKeyboardEscapeEvent() {
    $$(document.documentElement).on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ESCAPE, this.closeIfOpened));
  }

  private unbindOnKeyboardEscapeEvent() {
    $$(document.documentElement).off('keyup', KeyboardUtils.keypressAction(KEYBOARD.ESCAPE, this.closeIfOpened));
  }

  private bindNukeEvents() {
    $$(this.coveoRoot).on(InitializationEvents.nuke, () => {
      this.unbindOnKeyboardEscapeEvent();
    });
  }

  private showPopupBackground() {
    if (this.popupBackgroundIsEnabled) {
      this.coveoRoot.el.appendChild(this.popupBackground.el);
      window.getComputedStyle(this.popupBackground.el).opacity;
      this.popupBackground.el.style.opacity = ResponsiveDropdown.TRANSPARENT_BACKGROUND_OPACITY;
      this.popupBackground.addClass('coveo-dropdown-background-active');
    }
  }

  private lockScroll() {
    if (this.lockScrollIsEnabled) {
      this.scrollLocked = true;
    }
  }

  private unlockScroll() {
    this.scrollLocked = false;
  }

  private hidePopupBackground() {
    if (this.popupBackgroundIsEnabled) {
      // forces the browser to reflow the element, so that the transition is applied.
      window.getComputedStyle(this.popupBackground.el).opacity;
      this.popupBackground.el.style.opacity = '0';
      this.popupBackground.removeClass('coveo-dropdown-background-active');
    }
  }

  private buildPopupBackground(): Dom {
    let popupBackground = $$('div', { className: ResponsiveDropdown.DROPDOWN_BACKGROUND_CSS_CLASS_NAME });
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
