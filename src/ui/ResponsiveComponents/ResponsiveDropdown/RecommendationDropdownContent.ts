import { IResponsiveDropdownContent, ResponsiveDropdownContent } from './ResponsiveDropdownContent';
import { $$, Dom } from '../../../utils/Dom';

export class RecommendationDropdownContent implements IResponsiveDropdownContent {
  public static OPENED_DROPDOWN_CSS_CLASS_NAME = 'coveo-open-dropdown-content';

  private cssClassName: string;

  constructor(componentName: string, public element: Dom, private coveoRoot: Dom) {
    this.cssClassName = `coveo-${componentName}-dropdown-content`;
    this.element.addClass(this.cssClassName);
    this.element.addClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
  }

  public positionDropdown() {
    this.element.el.style.display = '';

    let dropdownContentWrapper = this.coveoRoot.find('.coveo-results-column');
    $$(dropdownContentWrapper).prepend(this.element.el);
    this.element.addClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.addClass(this.cssClassName);

    // forces the browser to reflow the element, so that the transition is applied.
    window.getComputedStyle(this.element.el).maxHeight;

    this.element.addClass(RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME);
  }

  public hideDropdown() {
    this.element.addClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    this.element.addClass(this.cssClassName);

    this.element.removeClass(RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME);
  }

  public cleanUp() {
    this.element.removeClass(this.cssClassName);
    this.element.removeClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
  }
}
