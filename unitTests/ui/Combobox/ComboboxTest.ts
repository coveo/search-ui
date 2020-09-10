import { $$ } from '../../../src/Core';
import { Combobox } from '../../../src/ui/Combobox/Combobox';
import { IComboboxOptions } from '../../../src/ui/Combobox/ICombobox';
import { mockSearchInterface } from '../../MockEnvironment';

export function comboboxDefaultOptions() {
  return {
    label: 'Label',
    createValuesFromResponse: jasmine.createSpy('createValuesFromResponse').and.callFake(() => []),
    requestValues: jasmine.createSpy('requestValues').and.callFake(async () => await []),
    onSelectValue: jasmine.createSpy('onSelectValue'),
    ariaLive: mockSearchInterface().ariaLive
  };
}

export function ComboboxTest() {
  describe('Combobox', () => {
    let combobox: Combobox;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent(additionalOptions?: Partial<IComboboxOptions>) {
      combobox = new Combobox({
        ...comboboxDefaultOptions(),
        ...additionalOptions
      });

      spyOn(combobox.values, 'clearValues');
      spyOn(combobox, 'clearAll');
    }

    function getInput() {
      return $$(combobox.element).find('input');
    }

    function getValues() {
      return $$(combobox.element).find('ul');
    }

    function getWaitAnimation() {
      return $$(combobox.element).find('.coveo-combobox-wait-animation');
    }

    describe('when initializing the combobox', () => {
      it('should render the input', () => {
        expect(getInput()).toBeTruthy();
      });

      it('should render the hidden wait animation', () => {
        expect($$(getWaitAnimation()).isVisible()).toBe(false);
      });

      it('should render the values', () => {
        expect(getValues()).toBeTruthy();
      });
    });

    describe('when calling onInputChange', () => {
      describe('with a value', () => {
        beforeEach(() => {
          combobox.onInputChange('test');
        });

        it('should trigger a new request', () => {
          expect(combobox.options.requestValues).toHaveBeenCalled();
        });

        it('should show and then hide the wait animation', done => {
          expect($$(getWaitAnimation()).isVisible()).toBe(true);
          setTimeout(() => {
            expect($$(getWaitAnimation()).isVisible()).toBe(false);
            done();
          }, 100);
        });
      });

      describe('with an empty value', () => {
        beforeEach(() => {
          combobox.onInputChange('');
        });

        it('should not trigger a new request', () => {
          expect(combobox.options.requestValues).not.toHaveBeenCalled();
        });

        it('should clear the values', () => {
          expect(combobox.values.clearValues).toHaveBeenCalled();
        });
      });
    });

    describe('when calling onInputChange multiple times', () => {
      beforeEach(() => {
        combobox.onInputChange('te');
        combobox.onInputChange('tes');
      });

      it(`multiple times before the delay expiration
      should not trigger more than 1 request instantly`, () => {
        expect(combobox.options.requestValues).toHaveBeenCalledTimes(1);
      });

      it(`multiple times before the delay expiration
      should trigger 2 requests (leading and trailing)`, done => {
        setTimeout(() => {
          expect(combobox.options.requestValues).toHaveBeenCalledTimes(2);
          done();
        }, 600);
      });
    });

    describe('when calling onInputBlur', () => {
      it('should clear the values by default', () => {
        combobox.onInputBlur();
        expect(combobox.values.clearValues).toHaveBeenCalled();
      });

      it(`when mouse is over the values
      should not clear the values`, () => {
        combobox.values.mouseIsOverValue = true;
        combobox.onInputBlur();
        expect(combobox.values.clearValues).not.toHaveBeenCalled();
      });

      it(`when clearOnBlur option is true
      should call the clearAll method`, () => {
        initializeComponent({
          clearOnBlur: true
        });

        combobox.onInputBlur();
        expect(combobox.clearAll).toHaveBeenCalled();
      });
    });

    it(`when calling updateAriaLive
    should call updateText on the searchInterface's ariaLive component`, () => {
      spyOn(combobox.options.ariaLive, 'updateText');
      const text = 'test';
      combobox.updateAriaLive(text);
      expect(combobox.options.ariaLive.updateText).toHaveBeenCalledWith(text);
    });
  });
}
