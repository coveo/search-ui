import { BetweenDateInput } from '../../../../src/ui/AdvancedSearch/DateInput/BetweenDateInput';
import { $$ } from '../../../../src/utils/Dom';
import { QueryBuilder } from '../../../Test';

export function BetweenDateInputTest() {
  describe('BetweenDateInput', () => {
    let input: BetweenDateInput;

    beforeEach(function() {
      input = new BetweenDateInput($$('div').el);
      input.build();
      (<HTMLInputElement>$$(input.getElement()).find('input')).checked = true;
    });

    afterEach(function() {
      input = null;
    });

    it('should allow to reset', () => {
      input.firstDatePicker.setValue(new Date(2016, 8, 1));
      input.secondDatePicker.setValue(new Date(2016, 8, 4));
      expect(input.getValue()).toEqual('(@date>=2016/09/01)(@date<=2016/09/04)');
      input.reset();
      expect(input.getValue()).toEqual('');
    });

    it('should allow to update the query', () => {
      input.firstDatePicker.setValue(new Date(2016, 8, 1));
      input.secondDatePicker.setValue(new Date(2016, 8, 4));
      const queryBuilder = new QueryBuilder();
      input.updateQuery(queryBuilder);
      expect(queryBuilder.build().aq).toEqual('(@date>=2016/09/01)(@date<=2016/09/04)');
    });

    it('should show an error message when updating the query with an invalid range', () => {
      input.firstDatePicker.setValue(new Date(2016, 8, 4));
      input.secondDatePicker.setValue(new Date(2016, 8, 1));
      const queryBuilder = new QueryBuilder();
      input.updateQuery(queryBuilder);
      expect(queryBuilder.build().aq).toBeUndefined();
      expect($$(input.getElement()).find('.coveo-error-date-input')).not.toBeNull();
    });

    it('should hide the error message when updating the query with a valid range', () => {
      input.firstDatePicker.setValue(new Date(2016, 8, 4));
      input.secondDatePicker.setValue(new Date(2016, 8, 1));
      const queryBuilder = new QueryBuilder();
      input.updateQuery(queryBuilder);
      input.firstDatePicker.setValue(new Date(2016, 8, 1));
      input.secondDatePicker.setValue(new Date(2016, 8, 4));
      input.updateQuery(queryBuilder);
      expect(queryBuilder.build().aq).not.toBeUndefined();
      expect($$(input.getElement()).find('.coveo-error-date-input')).toBeNull();
    });

    it('should return the selected dates with get values', () => {
      input.firstDatePicker.setValue(new Date(2016, 8, 1));
      input.secondDatePicker.setValue(new Date(2016, 8, 4));
      expect(input.getValue()).toEqual('(@date>=2016/09/01)(@date<=2016/09/04)');
    });

    it('should throw on get value if the values are invalid (ie: second date < first date)', () => {
      input.firstDatePicker.setValue(new Date(2016, 8, 4));
      input.secondDatePicker.setValue(new Date(2016, 8, 1));
      expect(() => input.getValue()).toThrow();
    });
  });
}
