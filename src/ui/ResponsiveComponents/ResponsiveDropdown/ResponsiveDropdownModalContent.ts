import { IResponsiveDropdownContent, ResponsiveDropdownContent } from './ResponsiveDropdownContent';
import { Dom, $$, l } from '../../../Core';
import { AccessibleButton } from '../../../utils/AccessibleButton';

export class ResponsiveDropdownModalContent implements IResponsiveDropdownContent {
  private closeButton: Dom;
  private className: string;

  private set hidden(shouldHide: boolean) {
    this.element.toggleClass('coveo-hidden', shouldHide);
  }

  private set allowPageScrolling(allow: boolean) {
    document.body.classList.toggle('coveo-block-scrolling', !allow);
  }

  constructor(private componentName: string, public element: Dom, private closeButtonLabel: string, private close: () => void) {
    this.className = `coveo-${this.componentName}-dropdown-modal-content`;
  }

  public positionDropdown(): void {
    this.element.el.classList.add(this.className, ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.setAttribute('role', 'group');
    this.element.setAttribute('aria-label', l('FiltersDropdown'));
    this.hidden = false;
    this.allowPageScrolling = false;
    this.closeButton = $$('div', { className: 'coveo-facet-modal-close-button' }, '✕');
    new AccessibleButton()
      .withElement(this.closeButton.el)
      .withSelectAction(() => this.close())
      .withLabel(this.closeButtonLabel)
      .build();
    this.element.prepend(this.closeButton.el);
  }

  public hideDropdown(): void {
    this.element.el.classList.remove(this.className, ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.setAttribute('role', null);
    this.element.setAttribute('aria-label', null);
    this.hidden = true;
    this.allowPageScrolling = true;
    if (this.closeButton) {
      this.closeButton.remove();
      this.closeButton = null;
    }
  }

  public cleanUp(): void {
    this.hidden = false;
  }
}
