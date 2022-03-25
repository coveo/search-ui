import { ResponsiveDropdown } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdown';
import { ResponsiveDropdownHeader } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownHeader';
import { ResponsiveDropdownContent } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownContent';
import { $$, Dom } from '../../../src/utils/Dom';
import { Simulate } from '../../Simulate';
import { KEYBOARD } from '../../../src/Core';

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

    it('should append a background when open is called', () => {
      responsiveDropdown.open();
      expect(root.find(`.${ResponsiveDropdown.DROPDOWN_BACKGROUND_ACTIVE_CSS_CLASS_NAME}`)).not.toBeNull();
    });

    it('should not append a background when it is disabled and open is called', () => {
      responsiveDropdown.disablePopupBackground();
      responsiveDropdown.open();
      expect(root.find(`.${ResponsiveDropdown.DROPDOWN_BACKGROUND_CSS_CLASS_NAME}`)).toBeNull();
    });

    it('should hide the background when close is called', () => {
      responsiveDropdown.open();
      responsiveDropdown.close();
      expect(root.find(`.${ResponsiveDropdown.DROPDOWN_BACKGROUND_ACTIVE_CSS_CLASS_NAME}`)).toBeNull();
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

    it('should call close when the dropdown is opened and the escape key is pressed', () => {
      responsiveDropdown.close = jasmine.createSpy('close');
      responsiveDropdown.open();
      Simulate.keyUp(document.documentElement, KEYBOARD.ESCAPE);

      expect(responsiveDropdown.close).toHaveBeenCalled();
    });
  });
}
