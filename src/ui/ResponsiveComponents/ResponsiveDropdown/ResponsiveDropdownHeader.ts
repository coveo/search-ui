import {Dom} from '../../../utils/Dom';

export class ResponsiveDropdownHeader {

  public static ACTIVE_HEADER_Z_INDEX = '20';
  public static DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-header';
  public static ACTIVE_HEADER_CSS_CLASS_NAME: string = 'coveo-dropdown-header-active';
  public static VISITED_HEADER_CSS_CLASS_NAME: string = 'coveo-dropdown-header-visited';

  constructor(componentName: string, public element: Dom) {
    this.element.addClass(`coveo-${componentName}-dropdown-header`);
    this.element.addClass(ResponsiveDropdownHeader.DEFAULT_CSS_CLASS_NAME);
  }

  public open() {
    this.element.addClass(ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
    this.element.addClass(ResponsiveDropdownHeader.VISITED_HEADER_CSS_CLASS_NAME);
    this.element.el.style.zIndex = ResponsiveDropdownHeader.ACTIVE_HEADER_Z_INDEX;
  }

  public close() {
    this.element.el.style.zIndex = '';
    this.element.removeClass(ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
  }

  public cleanUp() {
    this.element.detach();
    this.element.el.style.zIndex = '';
  }
}
