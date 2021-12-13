import { Dom } from '../../../utils/Dom';
import { Assert } from '../../../misc/Assert';
export interface IResponsiveDropdownContent {
  element: Dom;

  positionDropdown(): void;
  hideDropdown(): void;
  cleanUp(): void;
}

export class ResponsiveDropdownContent implements IResponsiveDropdownContent {
  public static DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-content';

  public static isTargetInsideOpenedDropdown(target: Dom) {
    Assert.exists(target);
    const targetParentDropdown = target.parent(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    if (targetParentDropdown) {
      return targetParentDropdown.style.display != 'none';
    }
    return false;
  }

  constructor(public element: Dom) {}

  public positionDropdown() {
    this.setElementAttributes();
  }

  public hideDropdown() {
    this.unsetElementAttributes();
  }

  public cleanUp() {
    this.element.el.removeAttribute('style');
  }

  private setElementAttributes() {
    this.element.show();
    this.setElementWidth();
  }

  private setElementWidth() {
    this.element.el.style.width = '100%';
  }

  private unsetElementAttributes() {
    this.element.hide();
  }
}
