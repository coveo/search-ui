import { Logger } from '../misc/Logger';
import { ComponentEvents } from '../ui/Base/Component';
import { KEYBOARD, KeyboardUtils } from '../utils/KeyboardUtils';
import { $$, Dom } from './Dom';
import 'styling/_AccessibleButton';

export class AccessibleButton {
  private element: Dom;
  private label: string;

  private clickAction: () => void;
  private enterKeyboardAction: () => void;
  private blurAction: () => void;
  private focusAction: () => void;

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

  public withSelectAction(action: () => void) {
    this.clickAction = action;
    this.enterKeyboardAction = action;
    return this;
  }

  public withClickAction(clickAction: () => void) {
    this.clickAction = clickAction;
    return this;
  }

  public withEnterKeyboardAction(enterAction: () => void) {
    this.enterKeyboardAction = enterAction;
    return this;
  }

  public withBlurAction(action: () => void) {
    this.blurAction = action;
    return this;
  }

  public withFocusAction(action: () => void) {
    this.focusAction = action;
    return this;
  }

  public build() {
    if (!this.element) {
      this.element = $$('div');
    }

    this.ensureCorrectRole();
    this.ensureCorrectLabel();
    this.ensureClickAction();
    this.ensureKeyboardEnterAction();
    this.ensureFocusAction();
    this.ensureBlurAction();
    this.ensureDifferentiationBetweenKeyboardAndMouseFocus();

    return this;
  }

  private ensureDifferentiationBetweenKeyboardAndMouseFocus() {
    const classOnPress = 'coveo-accessible-button-pressed';
    const classOnFocus = 'coveo-accessible-button-focused';
    $$(this.element).addClass('coveo-accessible-button');
    $$(this.element).on('mousedown', () => {
      $$(this.element).addClass(classOnPress);
      $$(this.element).removeClass(classOnFocus);
    });

    $$(this.element).on('mouseup', () => $$(this.element).removeClass(classOnPress));
    $$(this.element).on('focus', () => {
      if (!$$(this.element).hasClass(classOnPress)) {
        $$(this.element).addClass(classOnFocus);
      }
    });
    $$(this.element).on('blur', () => $$(this.element).removeClass(classOnFocus));
  }

  private ensureCorrectRole() {
    this.element.setAttribute('role', 'button');
  }

  private ensureCorrectLabel() {
    if (!this.label) {
      this.logger.error(`Missing label to create an accessible button !`);
      return;
    }
    this.element.setAttribute('aria-label', this.label);
  }

  private ensureTabIndex() {
    this.element.setAttribute('tabindex', '0');
  }

  private ensureClickAction() {
    if (!this.clickAction) {
      this.logger.warn('Missing click action on accessible button !');
    } else {
      this.bindEvent('click', this.clickAction);
    }
  }

  private ensureKeyboardEnterAction() {
    if (!this.enterKeyboardAction) {
      this.logger.warn('Missing enter keyboard action on accessible button !');
    } else {
      this.ensureTabIndex();
      this.bindEvent('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, () => this.enterKeyboardAction()));
    }
  }

  private ensureBlurAction() {
    if (this.blurAction) {
      this.bindEvent('mouseleave', this.blurAction);
    }
  }

  private ensureFocusAction() {
    if (this.focusAction) {
      this.bindEvent('mouseenter', this.focusAction);
      this.bindEvent('focus', () => this.focusAction);
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
