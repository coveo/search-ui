import { ResponsiveDropdown } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdown';
import { ResponsiveDropdownHeader } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownHeader';
import { ResponsiveDropdownContent } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownContent';
import { $$, Dom } from '../../../src/utils/Dom';

export function ResponsiveDropdownTest() {
  describe('ResponsiveDropdown', () => {
    let responsiveDropdownContent: ResponsiveDropdownContent;
    let responsiveDropdownHeader: ResponsiveDropdownHeader;
    let responsiveDropdown: ResponsiveDropdown;
    let root: Dom;

    beforeEach(() => {
      root = $$('div');
      responsiveDropdownContent = jasmine.createSpyObj('responsiveDropdownContent', ['positionDropdown', 'hideDropdown', 'cleanUp']);
      responsiveDropdownHeader = jasmine.createSpyObj('responsiveDropdownHeader', ['open', 'close', 'cleanUp']);
      responsiveDropdownHeader.element = responsiveDropdownContent.element = $$('div');
      root.append(responsiveDropdownHeader.element.el);
      root.append(responsiveDropdownContent.element.el);
      responsiveDropdown = new ResponsiveDropdown(responsiveDropdownContent, responsiveDropdownHeader, root);
    });

    it('should open the dropdown header when open is called', () => {
      responsiveDropdown.open();
      expect(responsiveDropdownHeader.open).toHaveBeenCalled();
    });

    it('should position the dropdown content when open is called', () => {
      responsiveDropdown.open();
      expect(responsiveDropdownContent.positionDropdown).toHaveBeenCalled();
    });

    it('should call the on open handler when open is called', () => {
      let handler = jasmine.createSpy('handler');
      responsiveDropdown.registerOnOpenHandler(handler, this);

      responsiveDropdown.open();

      expect(handler).toHaveBeenCalled();
    });

    describe('with scroll locking enabled', () => {
      let lockedContainer: HTMLElement;

      beforeEach(() => {
        responsiveDropdown.enableScrollLocking((lockedContainer = $$('div').el));
      });

      it('should lock scrolling when open is called', () => {
        responsiveDropdown.open();
        expect(lockedContainer.style.overflow).toEqual('hidden');
      });

      it('should unlock scrolling when close is called', () => {
        responsiveDropdown.open();
        responsiveDropdown.close();
        expect(lockedContainer.style.overflow).toBeFalsy();
      });
    });

    it('should not lock scrolling on the body when open is called', () => {
      responsiveDropdown.open();
      expect(document.body.style.overflow).toBeFalsy();
    });

    it('should close the dropdown header when close is called', () => {
      responsiveDropdown.close();
      expect(responsiveDropdownHeader.close).toHaveBeenCalled();
    });

    it('should hide the dropdown when close is called', () => {
      responsiveDropdown.close();
      expect(responsiveDropdownContent.hideDropdown).toHaveBeenCalled();
    });

    it('should call the on close handler when close is called', () => {
      let handler = jasmine.createSpy('handler');
      responsiveDropdown.registerOnCloseHandler(handler, this);

      responsiveDropdown.close();

      expect(handler).toHaveBeenCalled();
    });
  });
}
