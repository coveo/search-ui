import { Combobox, IComboboxOptions } from '../../../src/ui/Combobox/Combobox';
import { comboboxDefaultOptions } from './ComboboxTest';
import { ComboboxValues } from '../../../src/ui/Combobox/ComboboxValues';
import { $$ } from '../../../src/Core';

function createValuesFromResponse(response: string[]) {
  return response.map(value => {
    return {
      value,
      element: $$('li', {}, value).el
    };
  });
}

export function ComboboxValuesTest() {
  describe('ComboboxValues', () => {
    let combobox: Combobox;
    let comboboxValues: ComboboxValues;
    let response: string[];

    beforeEach(() => {
      initializeComponent();
    });

    function triggerRenderFromResponse(newResponse: string[]) {
      response = newResponse;
      comboboxValues.renderFromResponse(response);
    }

    function initializeComponent(additionalOptions?: Partial<IComboboxOptions>) {
      combobox = new Combobox({
        ...comboboxDefaultOptions(),
        createValuesFromResponse,
        ...additionalOptions
      });
      spyOn(combobox, 'updateAccessibilityAttributes');
      spyOn(combobox, 'clearAll');
      comboboxValues = new ComboboxValues(combobox);
    }

    describe('when being initialized', () => {
      it('should hide the list', () => {
        expect($$(comboboxValues.element).isVisible()).toBe(false);
      });

      it('should possess the correct accessibility attributes', () => {
        expect(comboboxValues.element.getAttribute('id')).toBe(`${combobox.id}-listbox`);
        expect(comboboxValues.element.getAttribute('aria-labelledby')).toBe(`${combobox.id}-label`);
        expect(comboboxValues.element.getAttribute('role')).toBe('listbox');
      });

      it('"mouseIsOverValue" should be false', () => {
        expect(comboboxValues.mouseIsOverValue).toBe(false);
      });
    });

    describe('when calling "renderFromResponse" with values', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi', 'hello', 'goodbye']);
      });

      it('should show the list', () => {
        expect($$(comboboxValues.element).isVisible()).toBe(true);
      });

      it('should render the values in the list', () => {
        expect($$(comboboxValues.element).children().length).toBe(response.length);
      });

      it('should call "updateAccessibilityAttributes" twice', () => {
        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledTimes(2);
      });

      it(`when entering a value with the mouse
      "mouseIsOverValue" should be true`, () => {
        const valueElement = $$(comboboxValues.element).children()[0];
        $$(valueElement).trigger('mouseenter');
        expect(comboboxValues.mouseIsOverValue).toBe(true);
      });

      it(`when entering then leaving a value with the mouse
      "mouseIsOverValue" should be false`, () => {
        const valueElement = $$(comboboxValues.element).children()[1];
        $$(valueElement).trigger('mouseenter');
        $$(valueElement).trigger('mouseleave');
        expect(comboboxValues.mouseIsOverValue).toBe(false);
      });

      describe('when a value is clicked', () => {
        beforeEach(() => {
          const valueElement = $$(comboboxValues.element).children()[1];
          $$(valueElement).trigger('click');
        });

        it('should call the option "onSelectValue" with the correct argument', () => {
          expect(combobox.options.onSelectValue).toHaveBeenCalledWith({
            value: response[1],
            element: $$(comboboxValues.element).children()[1]
          });
        });

        it('should call "clearAll"', () => {
          expect(combobox.clearAll).toHaveBeenCalled();
        });
      });
    });

    describe('when calling "renderFromResponse" with no values', () => {
      beforeEach(() => {
        initializeComponent();
        spyOn(combobox, 'updateAriaLive');
        triggerRenderFromResponse([]);
      });

      it('should show the "no values found" element', () => {
        const noValuesFound = $$(comboboxValues.element).children()[0];
        expect($$(noValuesFound).hasClass('coveo-combobox-value-not-found')).toBe(true);
      });

      it('should call "updateAriaLive" on the combobox with the right text', () => {
        expect(combobox.updateAriaLive).toHaveBeenCalledWith(combobox.options.noValuesFoundLabel);
      });

      it('should call "updateAccessibilityAttributes" once', () => {
        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledTimes(1);
      });
    });

    describe('when calling "clearValues"', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi', 'hello', 'goodbye']);
        comboboxValues.clearValues();
      });

      it('should hide the list', () => {
        expect($$(comboboxValues.element).isVisible()).toBe(false);
      });

      it('should empty the list', () => {
        expect($$(comboboxValues.element).children().length).toBe(0);
      });

      it('should call "updateAccessibilityAttributes"', () => {
        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalled();
      });
    });
  });
}
