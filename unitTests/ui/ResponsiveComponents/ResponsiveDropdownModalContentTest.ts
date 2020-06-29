import { ResponsiveDropdownModalContent } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownModalContent';
import { $$, Dom } from '../../../src/utils/Dom';

export function ResponsiveDropdownModalContentTest() {
  describe('ResponsiveDropdownModalContent', () => {
    const closeButtonLabel = 'hello';
    let modal: ResponsiveDropdownModalContent;
    let modalElement: Dom;
    let sibling: Dom;
    let closeSpy: jasmine.Spy;

    function createCloseSpy() {
      return (closeSpy = jasmine.createSpy('close'));
    }

    function buildModalContainer() {
      return $$('div', {}, (modalElement = $$('div')), (sibling = $$('div')));
    }

    function buildModal() {
      buildModalContainer();
      return (modal = new ResponsiveDropdownModalContent('abc', modalElement, closeButtonLabel, createCloseSpy()));
    }

    beforeEach(() => {
      buildModal();
    });

    describe('once initialized', () => {
      const isHidden = () => modalElement.hasClass('coveo-hidden');

      const getCloseButton = () => modalElement.findClass('coveo-facet-modal-close-button')[0] || null;

      beforeEach(() => {
        modal.positionDropdown();
        modal.hideDropdown();
      });

      it('hides the element', () => {
        expect(isHidden()).toBeTruthy();
      });

      it("doesn't have a close button", () => {
        expect(getCloseButton()).toBeNull();
      });

      it("doesn't prevent accessible focus from leaving", () => {
        expect(sibling.getAttribute('aria-hidden')).toBeNull();
      });

      describe('when positionned', () => {
        beforeEach(() => {
          modal.positionDropdown();
        });

        it('shows the element', () => {
          expect(isHidden()).toBeFalsy();
        });

        it('adds a close button', () => {
          expect(getCloseButton()).not.toBeNull();
          expect(getCloseButton().getAttribute('aria-label')).toEqual(closeButtonLabel);
        });

        it('calls close when pressing on the close button', () => {
          expect(closeSpy).not.toHaveBeenCalled();
          getCloseButton().click();
          expect(closeSpy).toHaveBeenCalled();
        });

        it('prevents accessible focus from leaving', () => {
          expect(sibling.getAttribute('aria-hidden')).toEqual('true');
        });

        describe('twice', () => {
          beforeEach(() => {
            modal.positionDropdown();
          });

          it("doesn't add more close buttons", () => {
            expect(modalElement.findClass('coveo-facet-modal-close-button').length).toEqual(1);
          });
        });
      });

      describe('when cleaned up', () => {
        beforeEach(() => {
          modal.cleanUp();
        });

        it('shows the element', () => {
          expect(isHidden()).toBeFalsy();
        });
      });
    });
  });
}
