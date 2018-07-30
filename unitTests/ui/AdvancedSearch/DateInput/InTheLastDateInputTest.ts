import { InTheLastDateInput } from '../../../../src/ui/AdvancedSearch/DateInput/InTheLastDateInput';
import { $$ } from '../../../../src/utils/Dom';
import { DateUtils } from '../../../../src/utils/DateUtils';

export function InTheLastDateInputTest() {
  describe('InTheLastDateInput', () => {
    let input: InTheLastDateInput;

    beforeEach(function() {
      input = new InTheLastDateInput($$('div').el);
      input.build();
      (<HTMLInputElement>$$(input.getElement()).find('input')).checked = true;
    });

    afterEach(function() {
      input = null;
    });

    describe('getValue', () => {
      it('should return the date >= specified date', () => {
        input.dropdown.setValue('Months');
        input.spinner.setValue(13);
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 13);
        expect(input.getValue()).toEqual('@date>=' + DateUtils.dateForQuery(currentDate));
      });
    });
  });
}
