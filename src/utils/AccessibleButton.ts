import { Logger } from '../misc/Logger';
import { ComponentEvents } from '../ui/Base/Component';
import { KEYBOARD, KeyboardUtils } from '../utils/KeyboardUtils';
import { $$, Dom } from './Dom';
import 'styling/_AccessibleButton';

export class AccessibleButton {
  private element: Dom;
  private label: string;
  private title: string;

  private clickAction: (e: Event) => void;
  private enterKeyboardAction: (e: Event) => void;
  private blurAction: (e: Event) => void;
  private mouseleaveAction: (e: Event) => void;
  private focusAction: (e: Event) => void;
  private mouseenterAction: (e: Event) => void;

  private logger: Logger;
  private eventOwner: ComponentEvents;

  public constructor() {
    this.logger = new Logger(this);
  }

  public withOwner(owner: ComponentEvents) {
    this.eventOwner = owner;
    return this;
  }

  public withElement(element: Dom | HTMLElement) {
    if (element instanceof HTMLElement) {
      this.element = $$(element);
    } else {
      this.element = element;
    }
    return this;
  }

  public withLabel(label: string) {
    this.label = label;
    return this;
  }

  public withTitle(title: string) {
    this.title = title;
    return this;
  }

  public withSelectAction(action: (e: Event) => void) {
    this.clickAction = action;
    this.enterKeyboardAction = action;
    return this;
  }

  public withClickAction(clickAction: (e: Event) => void) {
    this.clickAction = clickAction;
    return this;
  }

  public withEnterKeyboardAction(enterAction: (e: Event) => void) {
    this.enterKeyboardAction = enterAction;
    return this;
  }

  public withFocusAndMouseEnterAction(action: (e: Event) => void) {
    this.focusAction = action;
    this.mouseenterAction = action;
    return this;
  }

  public withFocusAction(action: (e: Event) => void) {
    this.focusAction = action;
    return this;
  }

  public withMouseEnterAction(action: (e: Event) => void) {
    this.mouseenterAction = action;
    return this;
  }

  public withBlurAndMouseLeaveAction(action: (e: Event) => void) {
    this.mouseleaveAction = action;
    this.blurAction = action;
    return this;
  }

  public withMouseLeaveAction(action: (e: Event) => void) {
    this.mouseleaveAction = action;
    return this;
  }

  public withBlurAction(action: (e: Event) => void) {
    this.blurAction = action;
    return this;
  }

  public build() {
    if (!this.element) {
      this.element = $$('div');
    }

    this.ensureCorrectRole();
    this.ensureCorrectLabel();
    this.ensureTitle();
    this.ensureSelectAction();
    this.ensureUnselectAction();
    this.ensureMouseenterAndFocusAction();
    this.ensureMouseleaveAndBlurAction();
    this.ensureDifferentiationBetweenKeyboardAndMouseFocus();

    return this;
  }

  private ensureDifferentiationBetweenKeyboardAndMouseFocus() {
    const classWhenPressed = 'coveo-accessible-button-pressed';
    $$(this.element).addClass('coveo-accessible-button');

    $$(this.element).on('mouseup', () => $$(this.element).addClass(classWhenPressed));
    $$(this.element).on('focus', () => {
      $$(this.element).removeClass(classWhenPressed);
    });
  }

  private ensureCorrectRole() {
    if (!this.element.getAttribute('role')) {
      this.element.setAttribute('role', 'button');
    }
  }

  private ensureCorrectLabel() {
    if (!this.label) {
      this.logger.error(`Missing label to create an accessible button !`);
      return;
    }
    this.element.setAttribute('aria-label', this.label);
  }

  private ensureTitle() {
    this.title && this.element.setAttribute('title', this.title);
  }

  private ensureTabIndex() {
    this.element.setAttribute('tabindex', '0');
  }

  private ensureSelectAction() {
    if (this.enterKeyboardAction) {
      this.ensureTabIndex();
      this.bindEvent('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, (e: Event) => this.enterKeyboardAction(e)));
      this.bindEvent(
        'keydown',
        KeyboardUtils.keypressAction(KEYBOARD.SPACEBAR, (e: Event) => {
          if (e.target instanceof HTMLInputElement) {
            return;
          }
          e.preventDefault();
        })
      );
      this.bindEvent(
        'keyup',
        KeyboardUtils.keypressAction(KEYBOARD.SPACEBAR, (e: Event) => {
          if (e.target instanceof HTMLInputElement) {
            return;
          }
          this.enterKeyboardAction(e);
        })
      );
    }

    if (this.clickAction) {
      this.bindEvent('click', this.clickAction);
    }
  }

  private ensureUnselectAction() {
    if (this.blurAction) {
      this.bindEvent('blur', this.blurAction);
    }

    if (this.mouseleaveAction) {
      this.bindEvent('mouseleave', this.mouseleaveAction);
    }
  }

  private ensureMouseenterAndFocusAction() {
    if (this.mouseenterAction) {
      this.bindEvent('mouseenter', this.mouseenterAction);
    }
    if (this.focusAction) {
      this.bindEvent('focus', this.focusAction);
    }
  }

  private ensureMouseleaveAndBlurAction() {
    if (this.mouseleaveAction) {
      this.bindEvent('mouseleave', this.mouseleaveAction);
    }
    if (this.blurAction) {
      this.bindEvent('blur', this.blurAction);
    }
  }

  private bindEvent(event: string, action: (...args: any[]) => void) {
    if (this.eventOwner) {
      this.eventOwner.on(this.element, event, action);
    } else {
      $$(this.element).on(event, action);
    }
  }
}
