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

  public positionDropdown(): void {
    this.element.el.classList.add(this.className, ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.setAttribute('role', 'group');
    this.element.setAttribute('aria-label', l('FiltersDropdown'));
    this.hidden = false;
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
    this.focusTrap = new FocusTrap(this.element.el);
  }

  public hideDropdown(): void {
    this.element.el.classList.remove(this.className, ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.setAttribute('role', null);
    this.element.setAttribute('aria-label', null);
    this.hidden = true;
    if (this.closeButton) {
      this.closeButton.remove();
      this.closeButton = null;
    }
    if (this.focusTrap) {
      this.focusTrap.disable();
      this.focusTrap = null;
    }
  }

  public cleanUp(): void {
    this.hidden = false;
  }
}
