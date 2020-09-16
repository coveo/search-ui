import { $$, l } from '../../../src/Core';
import { Combobox } from '../../../src/ui/Combobox/Combobox';
import { IComboboxOptions } from '../../../src/ui/Combobox/ICombobox';
import { mockSearchInterface } from '../../MockEnvironment';

export function comboboxDefaultOptions(): IComboboxOptions {
  return {
    label: 'Label',
    createValuesFromResponse: jasmine.createSpy('createValuesFromResponse').and.callFake(() => []),
    requestValues: jasmine.createSpy('requestValues').and.callFake(async () => await []),
    onSelectValue: jasmine.createSpy('onSelectValue'),
    ariaLive: mockSearchInterface().ariaLive,
    scrollable: {
      requestMoreValues: jasmine.createSpy('requestMoreValues').and.callFake(async () => await []),
      areMoreValuesAvailable: () => true,
      maxDropdownHeight: () => 100
    }
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
      return $$(combobox.element).find('input') as HTMLInputElement;
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

    describe('when calling onScrollEndReached', () => {
      beforeEach(() => {
        spyOn(combobox.values, 'saveFocusedValue');
        spyOn(combobox.values, 'restoreFocusedValue');
        combobox.onScrollEndReached();
      });

      it('should trigger a new requestMoreValues', () => {
        expect(combobox.options.scrollable.requestMoreValues).toHaveBeenCalled();
        expect(combobox.values.saveFocusedValue).toHaveBeenCalled();
      });

      it('should call saveFocusedValue and restoreFocusedValue', async done => {
        expect(combobox.values.saveFocusedValue).toHaveBeenCalled();
        setTimeout(() => {
          expect(combobox.values.restoreFocusedValue).toHaveBeenCalled();
          done();
        }, 0);
      });
    });

    describe('when calling onScrollEndReached multiple times', () => {
      beforeEach(() => {
        combobox.onScrollEndReached();
        combobox.onScrollEndReached();
      });

      it(`multiple times before the delay expiration
      should not trigger more than 1 request instantly`, () => {
        expect(combobox.options.scrollable.requestMoreValues).toHaveBeenCalledTimes(1);
      });

      it(`multiple times before the delay expiration
      should trigger 2 requests (leading and trailing)`, done => {
        setTimeout(() => {
          expect(combobox.options.scrollable.requestMoreValues).toHaveBeenCalledTimes(2);
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

      it(`when new values are rendering
      should not clear the values`, () => {
        combobox.values.isRenderingNewValues = true;
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

    describe('when calling updateAriaLive', () => {
      beforeEach(() => {
        spyOn(combobox.options.ariaLive, 'updateText');
        getInput().value = 'query';
      });

      it(`when there are no results
      should update the AriaLive component with "No Values found."`, () => {
        combobox.updateAriaLive();
        expect(combobox.options.ariaLive.updateText).toHaveBeenCalledWith(l('NoValuesFound'));
      });

      it(`when there are results
      when there is no more values available
      should update the AriaLive component with "{X} result(s) for {query}"`, () => {
        spyOn(combobox.values, 'hasValues').and.returnValue(true);
        spyOn(combobox.options.scrollable, 'areMoreValuesAvailable').and.returnValue(false);
        combobox.updateAriaLive();
        expect(combobox.options.ariaLive.updateText).toHaveBeenCalledWith(
          l('ShowingResultsWithQuery', combobox.values.numberOfValues, 'query', combobox.values.numberOfValues)
        );
      });

      it(`when there are results
      when there are more values available
      should update the AriaLive component with "{X} result(s) for {query}. More values are available."`, () => {
        spyOn(combobox.values, 'hasValues').and.returnValue(true);
        spyOn(combobox.options.scrollable, 'areMoreValuesAvailable').and.returnValue(true);
        combobox.updateAriaLive();
        expect(combobox.options.ariaLive.updateText).toHaveBeenCalledWith(
          `${l('ShowingResultsWithQuery', combobox.values.numberOfValues, 'query', combobox.values.numberOfValues)}. ${l(
            'MoreValuesAvailable'
          )}`
        );
      });
    });
  });
}
