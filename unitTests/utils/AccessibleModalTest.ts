import { AccessibleModal } from '../../src/utils/AccessibleModal';
import { $$ } from '../../src/utils/Dom';
import { Simulate } from '../Simulate';
import { FocusTrap } from '../../src/ui/FocusTrap/FocusTrap';
import { KEYBOARD } from '../../src/utils/KeyboardUtils';

export function AccessibleModalTest() {
  describe('AccessibleModal', () => {
    let bodyElement: HTMLElement;
    let titleElement: HTMLElement;
    let contentElement: HTMLElement;
    let modalBoxMock: Coveo.ModalBox.ModalBox;
    let accessibleModal: AccessibleModal;
    let validationSpy: jasmine.Spy;
    const modalClass = 'notice-me';

    function createBody() {
      return (bodyElement = $$('div').el);
    }

    function createAccessibleModal() {
      return (accessibleModal = new AccessibleModal(
        modalClass,
        createBody() as HTMLBodyElement,
        (modalBoxMock = Simulate.modalBoxModule())
      ));
    }

    function createTitle() {
      return (titleElement = $$('div').el);
    }

    function createContent() {
      return (contentElement = $$('div').el);
    }

    function createValidationSpy() {
      (validationSpy = jasmine.createSpy('validation')).and.returnValue(true);
      return validationSpy as () => boolean;
    }

    beforeEach(() => {
      createAccessibleModal();
    });

    describe('when calling open', () => {
      let focusTrap: FocusTrap;
      let container: HTMLElement;
      let closeButton: HTMLElement;
      let closeButtonClickSpy: jasmine.Spy;
      let initiallyFocusedElement: HTMLElement;

      function createAndAppendInitiallyFocusedElement() {
        initiallyFocusedElement = $$('button', {}, 'test').el;
        spyOn(initiallyFocusedElement, 'focus');
        document.body.appendChild(initiallyFocusedElement);
        return initiallyFocusedElement;
      }

      beforeEach(() => {
        accessibleModal.open(createTitle(), createContent(), createValidationSpy());
        accessibleModal['initiallyFocusedElement'] = createAndAppendInitiallyFocusedElement();
        focusTrap = accessibleModal['focusTrap'];
        container = accessibleModal.element;
        closeButton = container.querySelector('.coveo-small-close');
        closeButtonClickSpy = spyOn(closeButton, 'click');
      });

      afterEach(() => {
        initiallyFocusedElement.remove();
      });

      it('has an element', () => {
        expect(accessibleModal.element).toBeTruthy();
      });

      it('has a wrapper', () => {
        expect(accessibleModal.wrapper).toBeTruthy();
      });

      it('has content', () => {
        expect(accessibleModal.content).toBeTruthy();
      });

      it("calls ModalBox's open", () => {
        expect(modalBoxMock.open).toHaveBeenCalledTimes(1);
      });

      it("doesn't call the validation function", () => {
        expect(validationSpy).not.toHaveBeenCalled();
      });

      it('creates a focus trap', () => {
        expect(focusTrap).not.toBeNull();
      });

      it("doesn't disable its focus trap", () => {
        expect(focusTrap['enabled']).toEqual(true);
      });

      it('sets aria-modal to true on the modal element', () => {
        expect(container.getAttribute('aria-modal')).toEqual('true');
      });

      it('gives the close button a label', () => {
        expect(closeButton.getAttribute('aria-label')).toBeTruthy();
      });

      it('gives the close button a role', () => {
        expect(closeButton.getAttribute('role')).toEqual('button');
      });

      it('gives the close button a tabindex', () => {
        expect(closeButton.tabIndex).toEqual(0);
      });

      it('focuses on the close button', () => {
        expect(closeButton.focus).toHaveBeenCalledTimes(1);
      });

      it('clicks on the close button when enter is pressed', () => {
        Simulate.keyUp(closeButton, KEYBOARD.ENTER);
        expect(closeButtonClickSpy).toHaveBeenCalledTimes(1);
      });

      describe('then calling close', () => {
        beforeEach(() => {
          accessibleModal.close();
        });

        it('resets the focus to its initial position', () => {
          expect(initiallyFocusedElement.focus).toHaveBeenCalledTimes(1);
        });

        it("doesn't have an element", () => {
          expect(accessibleModal.element).toBeNull();
        });

        it("doesn't have a wrapper", () => {
          expect(accessibleModal.wrapper).toBeNull();
        });

        it("doesn't have content", () => {
          expect(accessibleModal.content).toBeNull();
        });

        it("calls ModalBox's close", () => {
          expect(modalBoxMock.close).toHaveBeenCalledTimes(1);
        });

        it('calls the validation function', () => {
          expect(validationSpy).toHaveBeenCalledTimes(1);
        });

        it('disables the focus trap', () => {
          expect(focusTrap['enabled']).toEqual(false);
        });
      });
    });
  });
}
