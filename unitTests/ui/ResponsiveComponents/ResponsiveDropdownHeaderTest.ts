import { ResponsiveDropdownHeader } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownHeader';
import { $$, Dom } from '../../../src/utils/Dom';

export function ResponsiveDropdownHeaderTest() {
  describe('ResponsiveDropdownHeader', () => {
    let componentName = 'name';
    let responsiveDropdownHeader: ResponsiveDropdownHeader;
    let element: Dom;

    beforeEach(() => {
      element = $$('div');
      responsiveDropdownHeader = new ResponsiveDropdownHeader(componentName, element);
    });

    it('adds active css class when open is called', () => {
      responsiveDropdownHeader.open();
      let expectedClass = ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME;

      expect(responsiveDropdownHeader.element.hasClass(expectedClass)).toBe(true);
    });

    it('removes active css class when close is called', () => {
      responsiveDropdownHeader.open();
      let expectedToBeRemovedClass = ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME;

      responsiveDropdownHeader.close();
      expect(responsiveDropdownHeader.element.hasClass(expectedToBeRemovedClass)).toBe(false);
    });

    it('detaches the element when clean up is called', () => {
      spyOn(responsiveDropdownHeader.element, 'detach');
      responsiveDropdownHeader.cleanUp();
      expect(responsiveDropdownHeader.element.detach).toHaveBeenCalled();
    });
  });
}
