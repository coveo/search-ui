import { IResponsiveDropdownContent, ResponsiveDropdownContent } from './ResponsiveDropdownContent';
import { Dom, $$, l } from '../../../Core';
import { SVGIcons } from '../../../utils/SVGIcons';
import { FocusTrap } from '../../FocusTrap/FocusTrap';

export class ResponsiveDropdownModalContent implements IResponsiveDropdownContent {
  private closeButton: Dom;
  private className: string;
  private focusTrap: FocusTrap;

  constructor(private componentName: string, public element: Dom, private closeButtonLabel: string, private close: () => void) {
    this.className = `coveo-${this.componentName}-dropdown-modal-content`;
  }

  private set hidden(shouldHide: boolean) {
    this.element.toggleClass('coveo-hidden', shouldHide);
  }

  public positionDropdown() {
    this.element.el.classList.add(this.className, ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.setAttribute('role', 'group');
    this.element.setAttribute('aria-label', l('FiltersDropdown'));
    this.hidden = false;
    this.ensureCloseButton();
    this.ensureFocusTrap();
  }

  public hideDropdown() {
    this.element.el.classList.remove(this.className, ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.setAttribute('role', null);
    this.element.setAttribute('aria-label', null);
    this.hidden = true;
    this.removeCloseButton();
    this.removeFocusTrap();
  }

  public cleanUp() {
    this.hidden = false;
  }

  private ensureCloseButton() {
    if (!this.closeButton) {
      this.closeButton = $$(
        'button',
        {
          className: 'coveo-facet-modal-close-button',
          ariaLabel: this.closeButtonLabel
        },
        SVGIcons.icons.mainClear
      );
      this.closeButton.on('click', () => this.close());
      this.element.prepend(this.closeButton.el);
    }
  }

  private get focusableSelector() {
    const facetElements = '[data-field]:not(.coveo-facet-empty) [tabindex]';
    const dynamicFacetsElements = '[data-field]:not(.coveo-hidden) button';
    const modalButton = '.coveo-facet-modal-close-button';
    return [facetElements, dynamicFacetsElements, modalButton].join(' , ');
  }

  private ensureFocusTrap() {
    if (!this.focusTrap) {
      this.focusTrap = new FocusTrap(this.element.el, { focusableSelector: this.focusableSelector });
    }
  }

  private removeCloseButton() {
    if (this.closeButton) {
      this.closeButton.remove();
      this.closeButton = null;
    }
  }

  private removeFocusTrap() {
    if (this.focusTrap) {
      this.focusTrap.disable();
      this.focusTrap = null;
    }
  }
}
