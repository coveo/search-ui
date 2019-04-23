import { Dom } from '../../../utils/Dom';
import PopperJs from 'popper.js';
import { ResponsiveComponentsManager } from '../ResponsiveComponentsManager';

export interface IResponsiveDropdownContent {
  element: Dom;

  positionDropdown(): void;
  hideDropdown(): void;
  cleanUp(): void;
}

export class ResponsiveDropdownContent implements IResponsiveDropdownContent {
  public static DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-content';

  private coveoRoot: Dom;
  private cssClassName: string;

  private widthRatio: number;
  private minWidth: number;
  private popperReference: PopperJs;

  public static isTargetInsideOpenedDropdown(target: Dom) {
    const targetParentDropdown = target.parent(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    if (targetParentDropdown) {
      return targetParentDropdown.style.display != 'none';
    }
    return false;
  }

  constructor(componentName: string, public element: Dom, coveoRoot: Dom, minWidth: number, widthRatio: number) {
    this.cssClassName = `coveo-${componentName}-dropdown-content`;
    this.coveoRoot = coveoRoot;
    this.widthRatio = widthRatio;
    this.minWidth = minWidth;
  }

  public positionDropdown() {
    this.element.addClass(this.cssClassName);
    this.element.addClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.el.style.display = '';

    let width = this.widthRatio * this.coveoRoot.width();
    if (width <= this.minWidth) {
      width = this.minWidth;
    }
    this.element.el.style.width = width.toString() + 'px';

    const referenceElement = this.coveoRoot.find(`.${ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS}`);

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

  public hideDropdown() {
    if (this.popperReference) {
      this.popperReference.destroy();
    }

    this.element.el.style.display = 'none';
    this.element.removeClass(this.cssClassName);
    this.element.removeClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
  }

  public cleanUp() {
    this.element.el.removeAttribute('style');
  }
}
