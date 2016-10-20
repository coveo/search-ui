import {$$, Dom} from '../../utils/Dom';
import {PopupUtils, HorizontalAlignment, VerticalAlignment} from '../../utils/PopupUtils';

export class DropdownContent {

  public static DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-content';

  private cssClassName: string;
  private dropdownContainerSelector: string;
  private coveoRoot: Dom;
  private widthRatio: number;
  private minWidth: number;

  constructor(componentName: string, public element: Dom, coveoRoot: Dom, minWidth: number, widthRatio: number, dropdownContainerSelector: string) {
    this.cssClassName = `coveo-${componentName}-dropdown-content`;
    this.coveoRoot = coveoRoot;
    this.widthRatio = widthRatio;
    this.minWidth = minWidth;
    this.dropdownContainerSelector = dropdownContainerSelector;
  }

  public positionDropdown() {
    this.element.addClass(this.cssClassName);
    this.element.addClass(DropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.el.style.display = '';

    let width = this.widthRatio * this.coveoRoot.el.offsetWidth;
    if (width <= this.minWidth) {
      width = this.minWidth;
    }
    this.element.el.style.width = width.toString() + 'px';

    PopupUtils.positionPopup(this.element.el, $$(this.coveoRoot.find(this.dropdownContainerSelector)).el, this.coveoRoot.el,
      { horizontal: HorizontalAlignment.INNERRIGHT, vertical: VerticalAlignment.BOTTOM }, this.coveoRoot.el);
  }

  public hideDropdown() {
    this.element.el.style.display = 'none';
    this.element.removeClass(this.cssClassName);
    this.element.removeClass(DropdownContent.DEFAULT_CSS_CLASS_NAME);
  }

  public cleanUp() {
    this.element.el.removeAttribute('style');
  }



}
