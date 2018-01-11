import { Dom, $$ } from '../../../utils/Dom';

export enum ResponsiveDropdownHeaderEvent {
  OPEN = 'responsiveDropdownHeaderOpen',
  CLOSE = 'responsiveDropdownHeaderClose'
}

export class ResponsiveDropdownHeader {
  public static DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-header';
  public static ACTIVE_HEADER_CSS_CLASS_NAME: string = 'coveo-dropdown-header-active';

  constructor(componentName: string, public element: Dom) {
    this.element.addClass(`coveo-${componentName}-dropdown-header`);
    this.element.addClass(ResponsiveDropdownHeader.DEFAULT_CSS_CLASS_NAME);
  }

  public open() {
    this.element.addClass(ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
    $$(this.element).trigger(ResponsiveDropdownHeaderEvent.OPEN);
  }

  public close() {
    this.element.removeClass(ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
    $$(this.element).trigger(ResponsiveDropdownHeaderEvent.CLOSE);
  }

  public cleanUp() {
    this.element.detach();
  }

  public hide() {
    $$(this.element).addClass('coveo-hidden');
  }

  public show() {
    $$(this.element).removeClass('coveo-hidden');
  }
}
