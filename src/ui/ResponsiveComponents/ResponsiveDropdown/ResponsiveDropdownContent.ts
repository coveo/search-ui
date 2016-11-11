import {$$, Dom} from '../../../utils/Dom';
import {PopupUtils, HorizontalAlignment, VerticalAlignment} from '../../../utils/PopupUtils';
import {ResponsiveComponentsManager} from '../ResponsiveComponentsManager';

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
  private previousSibling: Dom;
  private parent: Dom;
  private isOpened: boolean = false;

  constructor(componentName: string, public element: Dom, coveoRoot: Dom, minWidth: number, widthRatio: number) {
    this.cssClassName = `coveo-${componentName}-dropdown-content`;
    this.coveoRoot = coveoRoot;
    this.widthRatio = widthRatio;
    this.minWidth = minWidth;
    this.saveContentPosition();
  }

  public positionDropdown() {
    this.isOpened = true;
    this.element.addClass(this.cssClassName);
    this.element.addClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.el.style.display = '';

    let width = this.widthRatio * this.coveoRoot.el.offsetWidth;
    if (width <= this.minWidth) {
      width = this.minWidth;
    }
    this.element.el.style.width = width.toString() + 'px';

    PopupUtils.positionPopup(this.element.el, $$(this.coveoRoot.find(`.${ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS}`)).el, this.coveoRoot.el,
      { horizontal: HorizontalAlignment.INNERRIGHT, vertical: VerticalAlignment.BOTTOM, verticalOffset: 15 }, this.coveoRoot.el);
  }

  public hideDropdown() {
    this.isOpened = false;
    this.element.el.style.display = 'none';
    this.element.removeClass(this.cssClassName);
    this.element.removeClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
  }

  public cleanUp() {
    this.element.el.removeAttribute('style');
    this.restoreContentPosition();
  }

  private saveContentPosition() {
    let dropdownContentPreviousSibling = this.element.el.previousSibling;
    let dropdownContentParent = this.element.el.parentElement;
    this.previousSibling = dropdownContentPreviousSibling ? $$(<HTMLElement>dropdownContentPreviousSibling) : null;
    this.parent = $$(dropdownContentParent);
  }

  private restoreContentPosition() {
    if (this.previousSibling) {
      this.element.insertAfter(this.previousSibling.el);
    } else {
      this.parent.prepend(this.element.el);
    }
  }



}
