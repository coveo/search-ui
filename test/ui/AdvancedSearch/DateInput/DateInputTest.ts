import {DateInput} from '../../../../src/ui/AdvancedSearch/DateInput/DateInput';
import {QueryBuilder} from '../../../../src/ui/Base/QueryBuilder';
import {ExpressionBuilder} from '../../../../src/ui/Base/ExpressionBuilder';
import {$$} from '../../../../src/utils/Dom';
import * as Mock from '../../../MockEnvironment';

export function DateInputTest() {
  describe('DateInput', () => {
    let input: DateInput;

    beforeEach(function () {
      input = new DateInput('test');
      input.build();
    });

    afterEach(function () {
      input = null;
    });

    describe('updateQuery', () => {
      it('should add the value in the advanced query', () => {
        let value = 'test';
        spyOn(input, 'getValue').and.returnValue(value)
        let queryBuilder = Mock.mock<QueryBuilder>(QueryBuilder);
        let advancedExpression = Mock.mock<ExpressionBuilder>(ExpressionBuilder);
        queryBuilder.advancedExpression = advancedExpression;
        input.updateQuery(queryBuilder)
        expect(advancedExpression.add).toHaveBeenCalledWith(value);
      })
    })

    describe('on change', () => {

      let section: HTMLElement;
      let secondInput: DateInput;

      beforeEach(() => {
        section = $$('div').el;
        secondInput = new DateInput('test2');
        input.build();
        secondInput.build();
        input.getElement().appendChild($$('fieldset').el);
        secondInput.getElement().appendChild($$('fieldset').el);
        section.appendChild(input.getElement());
        section.appendChild(secondInput.getElement());
      })

      it('should desactivate all inputs', () => {
        let radio = $$(input.getElement()).find('input');
        $$(radio).trigger('change');
        let fieldset = <HTMLFieldSetElement>$$(secondInput.getElement()).find('fieldset');
        expect(fieldset.disabled).toBe(true);
      })
      it('should activate selected input', () => {
        let radio = $$(input.getElement()).find('input');
        $$(radio).trigger('change');
        let fieldset = <HTMLFieldSetElement>$$(input.getElement()).find('fieldset');
        expect(fieldset.disabled).toBe(false);
      })
    })
  })
}
