import {BetweenDateInput} from '../../../../src/ui/AdvancedSearch/DateInput/BetweenDateInput';
import {$$} from '../../../../src/utils/Dom';

export function BetweenDateInputTest() {
  describe('BetweenDateInput', () => {
    let input: BetweenDateInput;

    beforeEach(function () {
      input = new BetweenDateInput();
      input.build();
      (<HTMLInputElement>$$((input.getElement())).find('input')).checked = true;
    });

    afterEach(function () {
      input = null;
    });

    describe('getValue', () => {
      it('should return the selected dates', () => {
        input.firstDatePicker.setValue(new Date(2016, 8, 1));
        input.secondDatePicker.setValue(new Date(2016, 8, 4));
        expect(input.getValue()).toEqual('(@date>=2016/09/01)(@date<=2016/09/04)');
      });
    });
  });
}
