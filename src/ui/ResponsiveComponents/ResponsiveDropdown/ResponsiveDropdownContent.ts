import { Dom } from '../../../utils/Dom';
import PopperJs from 'popper.js';
import { ResponsiveComponentsManager } from '../ResponsiveComponentsManager';
import { Assert } from '../../../misc/Assert';
import { l } from '../../../strings/Strings';

export interface IResponsiveDropdownContent {
  element: Dom;

  positionDropdown(): void;
  hideDropdown(): void;
  cleanUp(): void;
}

export class ResponsiveDropdownContent implements IResponsiveDropdownContent {
  public static DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-content';

  public referenceClassname = ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS;

  private coveoRoot: Dom;
  private cssClassName: string;

  private widthRatio: number;
  private minWidth: number;
  private popperReference: PopperJs;

  public static isTargetInsideOpenedDropdown(target: Dom) {
    Assert.exists(target);
    const targetParentDropdown = target.parent(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    if (targetParentDropdown) {
      return targetParentDropdown.style.display != 'none';
    }
    return false;
  }

  constructor(componentName: string, public element: Dom, coveoRoot: Dom, minWidth: number, widthRatio: number) {
    Assert.isString(componentName);
    Assert.exists(element);
    Assert.exists(coveoRoot);
    Assert.isLargerOrEqualsThan(0, minWidth);
    Assert.isLargerOrEqualsThan(0, widthRatio);
    Assert.isSmallerOrEqualsThan(1, widthRatio);

    this.cssClassName = `coveo-${componentName}-dropdown-content`;
    this.coveoRoot = coveoRoot;
    this.widthRatio = widthRatio;
    this.minWidth = minWidth;
  }

  public positionDropdown() {
    this.setElementAttributes();
    this.createPopper();
  }

  public hideDropdown() {
    if (this.popperReference) {
      this.popperReference.destroy();
    }

    this.unsetElementAttributes();
  }

  public cleanUp() {
    this.element.el.removeAttribute('style');
  }

  private setElementAttributes() {
    this.element.show();
    this.element.addClass(this.cssClassName);
    this.element.addClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.setAttribute('role', 'group');
    this.element.setAttribute('aria-label', l('FiltersDropdown'));

    this.setElementWidth();
  }

  private setElementWidth() {
    let width = this.widthRatio * this.coveoRoot.width();
    if (width <= this.minWidth) {
      width = this.minWidth;
    }
    this.element.el.style.width = width.toString() + 'px';
  }

  private unsetElementAttributes() {
    this.element.hide();
    this.element.removeClass(this.cssClassName);
    this.element.removeClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.setAttribute('role', null);
    this.element.setAttribute('aria-label', null);
  }

  private createPopper() {
    const referenceElement = this.coveoRoot.find(`.${this.referenceClassname}`);
    this.popperReference = new PopperJs(referenceElement, this.element.el, {
      placement: 'bottom-end',
      positionFixed: true,
      modifiers: {
        preventOverflow: {
          boundariesElement: this.coveoRoot.el
        }
      }
    });
  }
}
