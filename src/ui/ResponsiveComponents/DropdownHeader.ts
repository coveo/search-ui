import {Dom} from '../../utils/Dom';

export class DropdownHeader {

  public static ACTIVE_HEADER_Z_INDEX = '20';
  public static DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-header';
  public static ACTIVE_HEADER_CSS_CLASS_NAME: string;

  constructor(componentName: string, public element: Dom) {
    this.element.addClass(`coveo-${componentName}-dropdown-header`);
    this.element.addClass(DropdownHeader.DEFAULT_CSS_CLASS_NAME);
  }

  public open() {
    this.element.addClass(DropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
    this.element.el.style.zIndex = DropdownHeader.ACTIVE_HEADER_Z_INDEX;
  }

  public close() {
    this.element.el.style.zIndex = '';
    this.element.removeClass(DropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
  }

  public cleanUp() {
    this.element.detach();
    this.element.el.style.zIndex = '';
  }
}
