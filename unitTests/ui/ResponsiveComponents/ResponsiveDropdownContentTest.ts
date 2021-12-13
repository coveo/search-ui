import { ResponsiveDropdownContent } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownContent';
import { ResponsiveComponentsManager } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import { $$, Dom } from '../../../src/utils/Dom';

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
      root.append($$('div', { className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS }).el);
      responsiveDropdownContent = new ResponsiveDropdownContent(componentName, element, root, minWidth, widthRatio);
    });

    it('displays the dropdown when position dropdown is called', () => {
      responsiveDropdownContent.positionDropdown();
      expect($$(responsiveDropdownContent.element).css('display')).not.toBe('none');
    });

    it('hides the dropdown when hideDropdown is called', () => {
      responsiveDropdownContent.hideDropdown();
      expect($$(responsiveDropdownContent.element).css('display')).toBe('none');
    });

    it('removes inline styling on clean up', () => {
      responsiveDropdownContent.hideDropdown();
      responsiveDropdownContent.cleanUp();
      expect(responsiveDropdownContent.element.el.style.display).toBe('');
    });

    it('removes custom css class when hide dropdown is called', () => {
      responsiveDropdownContent.positionDropdown();
      let expectedToBeRemovedClass = `coveo-${componentName}-dropdown-content`;

      responsiveDropdownContent.hideDropdown();

      expect(responsiveDropdownContent.element.hasClass(expectedToBeRemovedClass)).toBe(false);
    });

    it('removes default css class when hide dropdown is called', () => {
      responsiveDropdownContent.positionDropdown();
      let expectedToBeRemovedClass = ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME;

      responsiveDropdownContent.hideDropdown();

      expect(responsiveDropdownContent.element.hasClass(expectedToBeRemovedClass)).toBe(false);
    });

    it('should be able to tell when a target element is not contained inside an opened dropdown content', () => {
      const target = $$('div');
      root.append(target.el);
      responsiveDropdownContent.positionDropdown();
      expect(ResponsiveDropdownContent.isTargetInsideOpenedDropdown(target)).toBeFalsy();
    });
  });
}
