import { Defer } from '../../misc/Defer';
import { sortBy, without } from 'underscore';
import { $$ } from '../../utils/Dom';

export class FocusTrap {
  private focusInEvent: (e: FocusEvent) => void;
  private focusOutEvent: (e: FocusEvent) => void;
  private hiddenElements: HTMLElement[];
  private enabled: boolean;

  private get focusableElements(): HTMLElement[] {
    return sortBy(this.container.querySelectorAll('[tabindex]'), element => element.tabIndex);
  }

  constructor(private container: HTMLElement) {
    this.hiddenElements = [];
    this.enable();
  }

  public disable() {
    document.removeEventListener('focusin', this.focusInEvent);
    document.removeEventListener('focusout', this.focusOutEvent);
    this.showHiddenElements();
    this.enabled = false;
  }

  private enable() {
    document.addEventListener('focusin', (this.focusInEvent = e => this.onFocusIn(e)));
    document.addEventListener('focusout', (this.focusOutEvent = e => this.onFocusOut(e)));
    this.hideAllExcept(this.container);
    this.enabled = true;
  }

  private showHiddenElements() {
    while (this.hiddenElements.length) {
      this.hiddenElements.pop().removeAttribute('aria-hidden');
    }
  }

  private hideElement(element: HTMLElement) {
    if (element.getAttribute('aria-hidden')) {
      return;
    }
    this.hiddenElements.push(element);
    element.setAttribute('aria-hidden', `${true}`);
  }

  private hideSiblings(allowedElement: HTMLElement) {
    const parent = allowedElement.parentElement;
    if (parent) {
      without($$(parent).children(), allowedElement).forEach(elementToHide => {
        this.hideElement(elementToHide);
      });
    }
  }

  private hideAllExcept(allowedElement: HTMLElement) {
    this.hideSiblings(allowedElement);
    const parent = allowedElement.parentElement;
    if (parent && parent !== document.body) {
      this.hideAllExcept(parent);
    }
  }

  private getFocusableSibling(element: HTMLElement, previous = false) {
    const elements = this.focusableElements;
    const currentIndex = elements.indexOf(element);
    if (currentIndex === -1) {
      return null;
    }
    return elements[(currentIndex + (previous ? -1 : 1) + elements.length) % elements.length];
  }

  private focusSibling(element: HTMLElement, previous = false) {
    const sibling = this.getFocusableSibling(element, previous);
    if (sibling) {
      sibling.focus();
    }
  }

  private focusFirstElement() {
    const elements = this.focusableElements;
    if (elements.length) {
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
