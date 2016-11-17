import {ResponsiveDropdownContent} from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownContent';
import {$$, Dom} from '../../../src/utils/Dom';

export function ResponsiveDropdownContentTest() {

  describe('ResponsiveDropdownContent', () => {

    let minWidth = 50;
    let widthRatio = 0.5;
    let componentName = 'name';
    let responsiveDropdownContent: ResponsiveDropdownContent;
    let element: Dom;
    let root: Dom;

    beforeEach(() => {
      element = $$('div');
      root = $$('div');
      root.append(element.el);
      responsiveDropdownContent = new ResponsiveDropdownContent(componentName, element, root, minWidth, widthRatio);
    });

    it('displays the dropdown when position dropdown is called', () => {
      responsiveDropdownContent.positionDropdown();
      expect($$(responsiveDropdownContent.element).css('display')).not.toBe('none');
    });
  });
}
