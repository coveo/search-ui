import { Combobox } from '../../../src/ui/Combobox/Combobox';
import { comboboxDefaultOptions } from './ComboboxTest';
import { ComboboxValues } from '../../../src/ui/Combobox/ComboboxValues';
import { $$ } from '../../../src/Core';
import { IComboboxOptions, IComboboxAccessibilityAttributes } from '../../../src/ui/Combobox/ICombobox';

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

      it('should show the "no values found" element', () => {
        const noValuesFound = getChildren()[0];
        expect($$(noValuesFound).hasClass('coveo-combobox-value-not-found')).toBe(true);
      });

      it('should call "updateAriaLive" on the combobox with the right text', () => {
        expect(combobox.updateAriaLive).toHaveBeenCalledWith(combobox.options.noValuesFoundLabel);
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

    describe('when calling "moveActiveValueDown"', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi', 'hello']);
      });

      it(`when no value is active
      should activate the first value`, () => {
        comboboxValues.moveActiveValueDown();

        expect(isChildrenActiveAtIndex(0)).toBe(true);
      });

      it(`when no value is active
      should focus the first value`, () => {
        comboboxValues.moveActiveValueDown();

        expect(getFocusCountAtIndex(0)).toEqual(1);
      });

      it(`when a value is active
      should activate the next value`, () => {
        comboboxValues.moveActiveValueDown();
        comboboxValues.moveActiveValueDown();

        expect(isChildrenActiveAtIndex(0)).toBe(false);
        expect(isChildrenActiveAtIndex(1)).toBe(true);
      });

      it(`when a value is active
      should focus the next value`, () => {
        comboboxValues.moveActiveValueDown();
        comboboxValues.moveActiveValueDown();

        expect(getFocusCountAtIndex(0)).toEqual(1);
        expect(getFocusCountAtIndex(1)).toEqual(1);
      });

      it(`when the last value is active
      should activate the first value`, () => {
        comboboxValues.moveActiveValueDown();
        comboboxValues.moveActiveValueDown();
        comboboxValues.moveActiveValueDown();

        expect(isChildrenActiveAtIndex(1)).toBe(false);
        expect(isChildrenActiveAtIndex(0)).toBe(true);
      });

      it(`when the last is active
      should focus the first value`, () => {
        comboboxValues.moveActiveValueDown();
        comboboxValues.moveActiveValueDown();
        comboboxValues.moveActiveValueDown();

        expect(getFocusCountAtIndex(0)).toEqual(2);
        expect(getFocusCountAtIndex(1)).toEqual(1);
      });

      it('should call "updateAccessibilityAttributes" with the rigth attributes', () => {
        spyOn(combobox, 'updateAccessibilityAttributes');
        comboboxValues.moveActiveValueDown();

        const expected: IComboboxAccessibilityAttributes = {
          expanded: true,
          activeDescendant: getChildren()[0].getAttribute('id')
        };

        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledWith(expected);
      });
    });

    describe('when calling "moveActiveValueUp"', () => {
      beforeEach(() => {
        triggerRenderFromResponse(['hi', 'hello']);
      });

      it(`when no value is active
      should activate the last value`, () => {
        comboboxValues.moveActiveValueUp();

        expect(isChildrenActiveAtIndex(1)).toBe(true);
      });

      it(`when no value is active
      should focus the last value`, () => {
        comboboxValues.moveActiveValueUp();

        expect(getFocusCountAtIndex(1)).toEqual(1);
      });

      it(`when a value is active
      should activate the previous value`, () => {
        comboboxValues.moveActiveValueUp();
        comboboxValues.moveActiveValueUp();

        expect(isChildrenActiveAtIndex(1)).toBe(false);
        expect(isChildrenActiveAtIndex(0)).toBe(true);
      });

      it(`when a value is active
      should focus the previous value`, () => {
        comboboxValues.moveActiveValueUp();
        comboboxValues.moveActiveValueUp();

        expect(getFocusCountAtIndex(1)).toEqual(1);
        expect(getFocusCountAtIndex(0)).toEqual(1);
      });

      it(`when the last value is active
      should activate the last value`, () => {
        comboboxValues.moveActiveValueUp();
        comboboxValues.moveActiveValueUp();
        comboboxValues.moveActiveValueUp();

        expect(isChildrenActiveAtIndex(0)).toBe(false);
        expect(isChildrenActiveAtIndex(1)).toBe(true);
      });

      it(`when the last value is active
      should focus the last value`, () => {
        comboboxValues.moveActiveValueUp();
        comboboxValues.moveActiveValueUp();
        comboboxValues.moveActiveValueUp();

        expect(getFocusCountAtIndex(0)).toEqual(1);
        expect(getFocusCountAtIndex(1)).toEqual(2);
      });

      it('should call "updateAccessibilityAttributes" with the right attributes', () => {
        spyOn(combobox, 'updateAccessibilityAttributes');
        comboboxValues.moveActiveValueUp();

        expect(combobox.updateAccessibilityAttributes).toHaveBeenCalledWith({
          expanded: true,
          activeDescendant: getChildren()[1].getAttribute('id')
        });
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
        comboboxValues.moveActiveValueDown();
        comboboxValues.selectActiveValue();

        expect(combobox.clearAll).toHaveBeenCalled();
        expect(combobox.options.onSelectValue).toHaveBeenCalledWith({
          value: response[0],
          element: getChildren()[0]
        });
      });
    });
  });
}
