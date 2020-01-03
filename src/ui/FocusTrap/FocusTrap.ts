import _ = require('underscore');
import { Defer } from '../../misc/Defer';

export class FocusTrap {
  private focusInEvent: (e: FocusEvent) => void;
  private focusOutEvent: (e: FocusEvent) => void;
  private enabled: boolean;

  private get focusableElements(): HTMLElement[] {
    return _.sortBy(this.container.querySelectorAll('[tabindex]'), element => element.tabIndex);
  }

  constructor(private container: HTMLElement) {
    this.enable();
  }

  public disable() {
    document.removeEventListener('focusin', this.focusInEvent);
    document.removeEventListener('focusout', this.focusOutEvent);
    this.enabled = false;
  }

  private enable() {
    document.addEventListener('focusin', (this.focusInEvent = e => this.onFocusIn(e)));
    document.addEventListener('focusout', (this.focusOutEvent = e => this.onFocusOut(e)));
    this.enabled = true;
  }

  private getSibling(element: HTMLElement, previous = false) {
    const elements = this.focusableElements;
    const currentIndex = elements.indexOf(element);
    if (currentIndex === -1) {
      return null;
    }
    return elements[(currentIndex + (previous ? -1 : 1) + elements.length) % elements.length];
  }

  private focusSibling(element: HTMLElement, previous = false) {
    const sibling = this.getSibling(element, previous);
    if (sibling) {
      sibling.focus();
    }
  }

  private focusFirstElement() {
    const elements = this.focusableElements;
    if (elements.length > 0) {
      elements[0].focus();
    }
  }

  private elementIsBefore(oldElement: HTMLElement, newElement: HTMLElement) {
    if (!newElement) {
      return false;
    }
    return oldElement.compareDocumentPosition(newElement) === Node.DOCUMENT_POSITION_PRECEDING;
  }

  private onLosingFocus(oldElement: HTMLElement, newElement: HTMLElement) {
    Defer.defer(() => {
      if (!this.enabled) {
        return;
      }
      this.enabled = false;
      if (oldElement && this.focusIsAllowed(oldElement)) {
        this.focusSibling(oldElement, this.elementIsBefore(oldElement, newElement));
      } else {
        this.focusFirstElement();
      }
      this.enabled = true;
    });
  }

  private focusIsAllowed(element: HTMLElement) {
    return this.container.contains(element);
  }

  private elementIsInPage(element: HTMLElement) {
    return element && element !== document.body.parentElement;
  }

  private onFocusIn(e: FocusEvent) {
    if (!this.enabled) {
      return;
    }
    const oldElement = e.relatedTarget as HTMLElement;
    const handledByFocusOut = this.elementIsInPage(oldElement);
    if (handledByFocusOut) {
      return;
    }
    const newElement = e.target as HTMLElement;
    if (!this.elementIsInPage(newElement)) {
      return;
    }
    if (!this.focusIsAllowed(newElement)) {
      this.onLosingFocus(null, newElement);
    }
  }

  private onFocusOut(e: FocusEvent) {
    if (!this.enabled) {
      return;
    }
    const newElement = e.relatedTarget as HTMLElement;
    if (!this.elementIsInPage(newElement)) {
      return;
    }
    if (!newElement || !this.focusIsAllowed(newElement)) {
      this.onLosingFocus(e.target as HTMLElement, newElement);
    }
  }
}
