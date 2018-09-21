import { AccessibleButton } from '../../src/utils/AccessibleButton';
import { Dom, $$, KEYBOARD, Component } from '../../src/Core';
import { Simulate } from '../Simulate';
import { ComponentEvents } from '../../src/ui/Base/Component';

export const AccessibleButtonTest = () => {
  describe('AccessibleButton', () => {
    let element: Dom;

    beforeEach(() => {
      element = $$('div');
      Simulate.removeJQuery();
    });

    it('should add the specified label as the aria-label attribute', () => {
      new AccessibleButton()
        .withElement(element)
        .withLabel('qwerty')
        .build();

      expect(element.getAttribute('aria-label')).toBe('qwerty');
    });

    it('should add the specified title', () => {
      const title = 'title';

      new AccessibleButton()
        .withElement(element)
        .withTitle(title)
        .build();

      expect(element.getAttribute('title')).toBe(title);
    });

    it('should add the correct role', () => {
      new AccessibleButton().withElement(element).build();

      expect(element.getAttribute('role')).toBe('button');
    });

    describe('with an action', () => {
      let action: jasmine.Spy;

      beforeEach(() => {
        action = jasmine.createSpy('action');
      });

      describe('configured as select', () => {
        beforeEach(() => {
          new AccessibleButton()
            .withElement(element)
            .withSelectAction(action)
            .build();
        });

        it('should be called on click', () => {
          $$(element).trigger('click');
          expect(action).toHaveBeenCalled();
        });

        it('should be called on keyboard enter keypress', () => {
          Simulate.keyUp(element.el, KEYBOARD.ENTER);
          expect(action).toHaveBeenCalled();
        });
      });

      describe('configured as click', () => {
        beforeEach(() => {
          new AccessibleButton()
            .withElement(element)
            .withClickAction(action)
            .build();
        });

        it('should be called on click', () => {
          $$(element).trigger('click');
          expect(action).toHaveBeenCalled();
        });

        it('should not be called on keyboard enter keypress', () => {
          Simulate.keyUp(element.el, KEYBOARD.ENTER);
          expect(action).not.toHaveBeenCalled();
        });
      });

      describe('configured as keyboard enter keypress', () => {
        beforeEach(() => {
          new AccessibleButton()
            .withElement(element)
            .withEnterKeyboardAction(action)
            .build();
        });

        it('should not be called on click', () => {
          $$(element).trigger('click');
          expect(action).not.toHaveBeenCalled();
        });

        it('should be called on keyboard enter keypress', () => {
          Simulate.keyUp(element.el, KEYBOARD.ENTER);
          expect(action).toHaveBeenCalled();
        });
      });

      describe('configured as focus and mouseenter', () => {
        beforeEach(() => {
          new AccessibleButton()
            .withElement(element)
            .withFocusAndMouseEnterAction(action)
            .build();
        });

        it('should be called on focus', () => {
          $$(element).trigger('focus');
          expect(action).toHaveBeenCalled();
        });

        it('should be called on mouseenter', () => {
          $$(element).trigger('mouseenter');
          expect(action).toHaveBeenCalled();
        });
      });

      describe('configured as focus', () => {
        beforeEach(() => {
          new AccessibleButton()
            .withElement(element)
            .withFocusAction(action)
            .build();
        });

        it('should be called on focus', () => {
          $$(element).trigger('focus');
          expect(action).toHaveBeenCalled();
        });

        it('should not be called on mouseenter', () => {
          $$(element).trigger('mouseenter');
          expect(action).not.toHaveBeenCalled();
        });
      });

      describe('configured as mouseenter', () => {
        beforeEach(() => {
          new AccessibleButton()
            .withElement(element)
            .withMouseEnterAction(action)
            .build();
        });

        it('should not be called on focus', () => {
          $$(element).trigger('focus');
          expect(action).not.toHaveBeenCalled();
        });

        it('should be called on mouseenter', () => {
          $$(element).trigger('mouseenter');
          expect(action).toHaveBeenCalled();
        });
      });

      describe('configured as blur and mouseleave', () => {
        beforeEach(() => {
          new AccessibleButton()
            .withElement(element)
            .withBlurAndMouseLeaveAction(action)
            .build();
        });

        it('should be called on blur', () => {
          $$(element).trigger('blur');
          expect(action).toHaveBeenCalled();
        });

        it('should be called on mouseleave', () => {
          $$(element).trigger('mouseleave');
          expect(action).toHaveBeenCalled();
        });
      });

      describe('configured as blur', () => {
        beforeEach(() => {
          new AccessibleButton()
            .withElement(element)
            .withBlurAction(action)
            .build();
        });

        it('should be called on blur', () => {
          $$(element).trigger('blur');
          expect(action).toHaveBeenCalled();
        });

        it('should not be called on mouseleave', () => {
          $$(element).trigger('mouseleave');
          expect(action).not.toHaveBeenCalled();
        });
      });

      describe('configured as mouseleave', () => {
        beforeEach(() => {
          new AccessibleButton()
            .withElement(element)
            .withMouseLeaveAction(action)
            .build();
        });

        it('should not be called on blur', () => {
          $$(element).trigger('blur');
          expect(action).not.toHaveBeenCalled();
        });

        it('should be called on mouseleave', () => {
          $$(element).trigger('mouseleave');
          expect(action).toHaveBeenCalled();
        });
      });

      describe('with an event owner', () => {
        let component: Component;
        let owner: ComponentEvents;

        beforeEach(() => {
          component = new Component(element.el, 'Foo');
          owner = new ComponentEvents(component);

          new AccessibleButton()
            .withElement(element)
            .withOwner(owner)
            .withSelectAction(action)
            .build();
        });

        it('should not call the action if the component is disabled', () => {
          component.disable();
          $$(element).trigger('click');
          expect(action).not.toHaveBeenCalled();
        });

        it('should call the action if the component is enabled', () => {
          component.enable();
          $$(element).trigger('click');
          expect(action).toHaveBeenCalled();
        });
      });
    });
  });
};
