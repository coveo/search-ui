import {ResponsiveDropdownContent} from './ResponsiveDropdownContent';
import {Dom} from '../../../utils/Dom';

export class RecommendationDropdownContent extends ResponsiveDropdownContent{

  constructor(componentName: string, public element, coveoRoot: Dom, minWidth: number, widthRatio: number) {
    super(componentName, element, coveoRoot, minWidth, widthRatio);
  }
  
  public positionDropdown() {
    let dropdownHeaderWrapper = this.coveoRoot.find('.coveo-dropdown-header-wrapper');
    this.element.insertAfter(dropdownHeaderWrapper);
    this.element.el.style.display = 'block';
  }
}