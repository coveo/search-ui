import { Combobox } from '../../../src/ui/Combobox/Combobox';
import { comboboxDefaultOptions } from './ComboboxTest';
import { ComboboxValues } from '../../../src/ui/Combobox/ComboboxValues';
import { $$ } from '../../../src/Core';
import { IComboboxOptions, IComboboxAccessibilityAttributes } from '../../../src/ui/Combobox/ICombobox';

function createValuesFromResponse(response: string[]) {
  return response.map(value => {
    return {
      value,
      element: $$('li', { class: 'coveo-checkbox-span-label' }, value).el
    };
  });
}

export function ComboboxValuesTest() {
  describe('ComboboxValues', () => {
    let combobox: Combobox;
    let comboboxValues: ComboboxValues;
    let response: string[];

    beforeEach(() => {
      initializeComponent({ highlightValueClassName: 'coveo-checkbox-span-label' });
    });

    function mockComboboxValuesFocusFunction() {
      comboboxValues['values'].forEach(value => {
        spyOn(value.element, 'focus').and.callFake(() => comboboxValues['setKeyboardActiveValue'](value));
      });
    }

    function triggerRenderFromResponse(newResponse: string[]) {
      response = newResponse;
      comboboxValues.renderFromResponse(response);
      mockComboboxValuesFocusFunction();
    }

    function initializeComponent(additionalOptions?: Partial<IComboboxOptions>) {
      combobox = new Combobox({
        ...comboboxDefaultOptions(),
        createValuesFromResponse,
        ...additionalOptions
      });
      spyOn(combobox, 'clearAll');
      comboboxValues = new ComboboxValues(combobox);
    }

    function getChildren() {
      return $$(comboboxValues.element).children();
    }

    function isChildrenActiveAtIndex(index: number) {
      return $$(getChildren()[index]).hasClass('coveo-focused');
    }

    function getFocusCountAtIndex(index: number) {
      return (getChildren()[index].focus as jasmine.Spy).calls.count();
    }

    describe('when being initialized', () => {
      it('should hide the list', () => {
        expect($$(comboboxValues.element).isVisible()).toBe(false);
      });

      it('should possess the correct accessibility attributes', () => {
        expect(comboboxValues.element.getAttribute('id')).toBe(`${combobox.id}-listbox`);
        expect(comboboxValues.element.getAttribute('aria-labelledby')).toBe(`${combobox.id}-input`);
        expect(comboboxValues.element.getAttribute('role')).toBe('listbox');
      });

      it('"mouseIsOverValue" should be false', () => {
        expect(comboboxValues.mouseIsOverValue).toBe(false);
      });
    });

    describe('when calling "renderFromResponse" with values', () => {
      beforeEach(() => {
        spyOn(combobox, 'updateAccessibilityAttributes');
        triggerRenderFromResponse(['hi', 'hello', 'goodbye']);
      });

      it('hasValues should return true', () => {
        expect(comboboxValues.hasValues()).toBe(true);
      });

      it('numberOfValues getter should return the correct number of values ', () => {
        expect(comboboxValues.numberOfValues).toBe(3);
      });

      it('should show the list', () => {
        expect($$(comboboxValues.element).isVisible()).toBe(true);
      });

      it('should render the values in the list', () => {
        expect(getChildren().length).toBe(response.length);
      });

      it('should call "updateAccessibilityAttributes" twice', () => {
        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledTimes(2);
      });

      it(`when entering a value with the mouse
      "mouseIsOverValue" should be true`, () => {
        const valueElement = getChildren()[0];
        $$(valueElement).trigger('mouseenter');
        expect(comboboxValues.mouseIsOverValue).toBe(true);
      });

      it(`when entering then leaving a value with the mouse
      "mouseIsOverValue" should be false`, () => {
        const valueElement = getChildren()[1];
        $$(valueElement).trigger('mouseenter');
        $$(valueElement).trigger('mouseleave');

        expect(comboboxValues.mouseIsOverValue).toBe(false);
      });

      it('should add a tabindex to every value', () => {
        getChildren().forEach(valueElement => expect(valueElement.tabIndex).toEqual(0));
      });

      it('should highlight text that matches the input value when the parent has the right class', () => {
        combobox.element.querySelector('input').value = 'e';
        triggerRenderFromResponse(['hello']);
        const element = $$(comboboxValues.element).findAll('.coveo-checkbox-span-label')[0];
        expect(element.innerHTML).toBe('<span>h</span><span class="coveo-highlight">e</span><span>llo</span>');
      });

      it('should highlight text that matches the input value when a child has the right class', () => {
        const createValuesFromResponseWithWrapper = (response: string[]) => {
          return response.map(value => {
            return {
              value,
              element: $$('div', {}, $$('li', { class: 'coveo-checkbox-span-label' }, value).el).el
            };
          });
        };
        initializeComponent({
          highlightValueClassName: 'coveo-checkbox-span-label',
          createValuesFromResponse: createValuesFromResponseWithWrapper
        });
        combobox.element.querySelector('input').value = 'e';
        triggerRenderFromResponse(['hello']);
        const element = $$(comboboxValues.element).findAll('.coveo-checkbox-span-label')[0];
        expect(element.innerHTML).toBe('<span>h</span><span class="coveo-highlight">e</span><span>llo</span>');
      });

      it('does not escape & character', () => {
        triggerRenderFromResponse(['&']);
        const element = $$(comboboxValues.element).findAll('.coveo-checkbox-span-label')[0];
        expect(element.textContent).toBe('&');
      });

      describe('when a value is clicked', () => {
        beforeEach(() => {
          const valueElement = getChildren()[1];
          $$(valueElement).trigger('click');
        });

        it('should call the option "onSelectValue" with the correct argument', () => {
          expect(combobox.options.onSelectValue).toHaveBeenCalledWith({
            value: response[1],
            element: getChildren()[1]
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
        spyOn(combobox, 'updateAccessibilityAttributes');
        triggerRenderFromResponse([]);
      });

      it('hasValues should return false', () => {
        expect(comboboxValues.hasValues()).toBe(false);
      });

      it('numberOfValues getter should return the correct number of values ', () => {
        expect(comboboxValues.numberOfValues).toBe(0);
      });

      it('should show the "no values found" element', () => {
        const noValuesFound = getChildren()[0];
        expect($$(noValuesFound).hasClass('coveo-combobox-value-not-found')).toBe(true);
      });

      it('should call "updateAccessibilityAttributes" with the right attributes', () => {
        const expected: IComboboxAccessibilityAttributes = {
          expanded: false,
          activeDescendant: ''
        };

        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledWith(expected);
      });
    });

    describe('when calling "clearValues"', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi', 'hello', 'goodbye']);
        spyOn(combobox, 'updateAccessibilityAttributes');
        comboboxValues.clearValues();
      });

      it('should hide the list', () => {
        expect($$(comboboxValues.element).isVisible()).toBe(false);
      });

      it('should empty the list', () => {
        expect(getChildren().length).toBe(0);
      });

      it('should call "updateAccessibilityAttributes" with the right attributes', () => {
        const expected: IComboboxAccessibilityAttributes = {
          expanded: false,
          activeDescendant: ''
        };

        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledWith(expected);
      });
    });

    describe('when calling "focusNextValue"', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi', 'hello']);
      });

      it(`when no value is active
      should activate the first value`, () => {
        comboboxValues.focusNextValue();

        expect(isChildrenActiveAtIndex(0)).toBe(true);
      });

      it(`when no value is active
      should focus the first value`, () => {
        comboboxValues.focusNextValue();

        expect(getFocusCountAtIndex(0)).toEqual(1);
      });

      it(`when a value is active
      should activate the next value`, () => {
        comboboxValues.focusNextValue();
        comboboxValues.focusNextValue();

        expect(isChildrenActiveAtIndex(0)).toBe(false);
        expect(isChildrenActiveAtIndex(1)).toBe(true);
      });

      it(`when a value is active
      should focus the next value`, () => {
        comboboxValues.focusNextValue();
        comboboxValues.focusNextValue();

        expect(getFocusCountAtIndex(0)).toEqual(1);
        expect(getFocusCountAtIndex(1)).toEqual(1);
      });

      it(`when the last value is active
      should activate the first value`, () => {
        comboboxValues.focusNextValue();
        comboboxValues.focusNextValue();
        comboboxValues.focusNextValue();

        expect(isChildrenActiveAtIndex(1)).toBe(false);
        expect(isChildrenActiveAtIndex(0)).toBe(true);
      });

      it(`when the last is active
      should focus the first value`, () => {
        comboboxValues.focusNextValue();
        comboboxValues.focusNextValue();
        comboboxValues.focusNextValue();

        expect(getFocusCountAtIndex(0)).toEqual(2);
        expect(getFocusCountAtIndex(1)).toEqual(1);
      });

      it('should call "updateAccessibilityAttributes" with the right attributes', () => {
        spyOn(combobox, 'updateAccessibilityAttributes');
        comboboxValues.focusNextValue();

        const expected: IComboboxAccessibilityAttributes = {
          expanded: true,
          activeDescendant: getChildren()[0].getAttribute('id')
        };

        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledWith(expected);
      });
    });

    describe('when calling "focusPreviousValue"', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi', 'hello']);
      });

      it(`when no value is active
      should activate the last value`, () => {
        comboboxValues.focusPreviousValue();

        expect(isChildrenActiveAtIndex(1)).toBe(true);
      });

      it(`when no value is active
      should focus the last value`, () => {
        comboboxValues.focusPreviousValue();

        expect(getFocusCountAtIndex(1)).toEqual(1);
      });

      it(`when a value is active
      should activate the previous value`, () => {
        comboboxValues.focusPreviousValue();
        comboboxValues.focusPreviousValue();

        expect(isChildrenActiveAtIndex(1)).toBe(false);
        expect(isChildrenActiveAtIndex(0)).toBe(true);
      });

      it(`when a value is active
      should focus the previous value`, () => {
        comboboxValues.focusPreviousValue();
        comboboxValues.focusPreviousValue();

        expect(getFocusCountAtIndex(1)).toEqual(1);
        expect(getFocusCountAtIndex(0)).toEqual(1);
      });

      it(`when the last value is active
      should activate the last value`, () => {
        comboboxValues.focusPreviousValue();
        comboboxValues.focusPreviousValue();
        comboboxValues.focusPreviousValue();

        expect(isChildrenActiveAtIndex(0)).toBe(false);
        expect(isChildrenActiveAtIndex(1)).toBe(true);
      });

      it(`when the last value is active
      should focus the last value`, () => {
        comboboxValues.focusPreviousValue();
        comboboxValues.focusPreviousValue();
        comboboxValues.focusPreviousValue();

        expect(getFocusCountAtIndex(0)).toEqual(1);
        expect(getFocusCountAtIndex(1)).toEqual(2);
      });

      it('should call "updateAccessibilityAttributes" with the right attributes', () => {
        spyOn(combobox, 'updateAccessibilityAttributes');
        comboboxValues.focusPreviousValue();

        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledWith({
          expanded: true,
          activeDescendant: getChildren()[1].getAttribute('id')
        });
      });
    });

    describe('when calling "focusFirstValue"', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi', 'hello', 'bye']);
      });

      it(`when no value is active
      should activate the first value`, () => {
        comboboxValues.focusFirstValue();

        expect(isChildrenActiveAtIndex(0)).toBe(true);
      });

      it(`when no value is active
      should focus the first value`, () => {
        comboboxValues.focusFirstValue();

        expect(getFocusCountAtIndex(0)).toEqual(1);
      });

      it(`when a value is active
      should activate the first value`, () => {
        comboboxValues.focusNextValue();
        comboboxValues.focusNextValue();
        comboboxValues.focusFirstValue();

        expect(isChildrenActiveAtIndex(1)).toBe(false);
        expect(isChildrenActiveAtIndex(0)).toBe(true);
      });

      it(`when a value is active
      should focus the first value`, () => {
        comboboxValues.focusNextValue();
        comboboxValues.focusNextValue();
        comboboxValues.focusFirstValue();

        expect(getFocusCountAtIndex(0)).toEqual(2);
        expect(getFocusCountAtIndex(1)).toEqual(1);
      });

      it('should call "updateAccessibilityAttributes" with the right attributes', () => {
        spyOn(combobox, 'updateAccessibilityAttributes');
        comboboxValues.focusFirstValue();

        const expected: IComboboxAccessibilityAttributes = {
          expanded: true,
          activeDescendant: getChildren()[0].getAttribute('id')
        };

        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledWith(expected);
      });
    });

    describe('when calling "focusLastValue"', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi', 'hello', 'bye']);
      });

      it(`when no value is active
      should activate the last value`, () => {
        comboboxValues.focusLastValue();

        expect(isChildrenActiveAtIndex(2)).toBe(true);
      });

      it(`when no value is active
      should focus the last value`, () => {
        comboboxValues.focusLastValue();

        expect(getFocusCountAtIndex(2)).toEqual(1);
      });

      it(`when a value is active
      should activate the last value`, () => {
        comboboxValues.focusNextValue();
        comboboxValues.focusLastValue();

        expect(isChildrenActiveAtIndex(2)).toBe(true);
        expect(isChildrenActiveAtIndex(0)).toBe(false);
      });

      it(`when a value is active
      should focus the last value`, () => {
        comboboxValues.focusNextValue();
        comboboxValues.focusLastValue();

        expect(getFocusCountAtIndex(2)).toEqual(1);
        expect(getFocusCountAtIndex(0)).toEqual(1);
      });

      it('should call "updateAccessibilityAttributes" with the right attributes', () => {
        spyOn(combobox, 'updateAccessibilityAttributes');
        comboboxValues.focusLastValue();

        const expected: IComboboxAccessibilityAttributes = {
          expanded: true,
          activeDescendant: getChildren()[2].getAttribute('id')
        };

        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledWith(expected);
      });
    });

    describe('when calling "selectActiveValue"', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi']);
      });

      it(`when no value is active
      should not trigger a select and clear`, () => {
        comboboxValues.selectActiveValue();

        expect(combobox.clearAll).not.toHaveBeenCalled();
        expect(combobox.options.onSelectValue).not.toHaveBeenCalled();
      });

      it(`when a value is active
      should trigger a select and clear`, () => {
        comboboxValues.focusNextValue();
        comboboxValues.selectActiveValue();

        expect(combobox.clearAll).toHaveBeenCalled();
        expect(combobox.options.onSelectValue).toHaveBeenCalledWith({
          value: response[0],
          element: getChildren()[0]
        });
      });
    });

    describe('when scrolling in the values', () => {
      beforeEach(() => {
        spyOn(combobox, 'onScrollEndReached');
      });

      it(`if areMoreValuesAvailable return true and the scroll end is reached
      it should call the onScrollEndReached on the combobox`, () => {
        comboboxValues.element.dispatchEvent(new CustomEvent('scroll'));
        expect(combobox.onScrollEndReached).toHaveBeenCalled();
      });

      it(`if areMoreValuesAvailable return false and the scroll end is reached
      it should not call the onScrollEndReached on the combobox`, () => {
        combobox.options.scrollable.areMoreValuesAvailable = () => false;
        comboboxValues.element.dispatchEvent(new CustomEvent('scroll'));
        expect(combobox.onScrollEndReached).not.toHaveBeenCalled();
      });
    });

    describe('when calling "resetScroll"', () => {
      it('should set the maxHeight value to the maxDropdownHeight option', () => {
        comboboxValues.resetScroll();
        expect(comboboxValues.element.style.maxHeight).toBe('100px');
      });

      it('should reset the scrollTop value to 0', () => {
        comboboxValues.element.scrollTop = 300;
        comboboxValues.resetScroll();
        expect(comboboxValues.element.scrollTop).toBe(0);
      });
    });

    it('should "saveFocusedValue" & "restoreFocusedValue" correctly', () => {
      triggerRenderFromResponse(['hi', 'hello']);

      comboboxValues.focusLastValue();
      comboboxValues.saveFocusedValue();

      triggerRenderFromResponse(['hi', 'hello', 'goodbye']);

      comboboxValues.restoreFocusedValue();

      expect(isChildrenActiveAtIndex(1)).toBe(true);
    });
  });
}
