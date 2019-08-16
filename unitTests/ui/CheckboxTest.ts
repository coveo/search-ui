import { Checkbox } from '../../src/ui/FormWidgets/Checkbox';
import { $$ } from '../../src/utils/Dom';

export function CheckboxTest() {
  describe('Checkbox', () => {
    let spyChange: jasmine.Spy;
    let checkbox: Checkbox;

    beforeEach(() => {
      spyChange = jasmine.createSpy('change');
      checkbox = new Checkbox(spyChange, 'hello');
    });

    afterEach(() => {
      spyChange = null;
      checkbox = null;
    });

    it('should allow to build', () => {
      expect(checkbox.build()).not.toBeNull();
    });

    it('should allow to get the element', () => {
      expect(checkbox.getElement()).not.toBeNull();
    });

    it('should allow to get the label value', () => {
      expect(checkbox.getValue()).toEqual('hello');
    });

    it('should not allow to create a checkbox with stored XSS', () => {
      checkbox = new Checkbox(spyChange, '<svg/onload=alert(document.domain)>');
      expect(checkbox.getLabel().textContent).toBe('<svg/onload=alert(document.domain)>');
    });

    it('the checkbox input has an aria-hidden equal to true', () => {
      expect(
        $$(checkbox.getElement())
          .find('input')
          .getAttribute('aria-hidden')
      ).toBe('true');
    });

    it('the checkbox input has an aria-label', () => {
      expect(
        $$(checkbox.getElement())
          .find('input')
          .getAttribute('aria-label')
      ).toBeTruthy();
    });

    describe('select', () => {
      it('should allow to select', () => {
        checkbox.select();
        expect(checkbox.isSelected()).toBe(true);
      });

      it('should call on change', () => {
        checkbox.select();
        expect(spyChange).toHaveBeenCalledWith(checkbox);
      });

      it('should call on change only once', () => {
        checkbox.select();
        checkbox.select();
        expect(spyChange).toHaveBeenCalledTimes(1);
      });
    });

    describe('reset', () => {
      it('should allow to reset', () => {
        checkbox.select();
        expect(checkbox.isSelected()).toBe(true);
        checkbox.reset();
        expect(checkbox.isSelected()).toBe(false);
      });

      it('should call on change', () => {
        checkbox.select();
        expect(checkbox.isSelected()).toBe(true);
        checkbox.reset();
        expect(spyChange).toHaveBeenCalledTimes(2);
        expect(spyChange).toHaveBeenCalledWith(checkbox);
      });

      it('should call on change only once', () => {
        checkbox.select();
        checkbox.reset();
        checkbox.reset();
        expect(spyChange).toHaveBeenCalledTimes(2);
      });
    });
  });
}
