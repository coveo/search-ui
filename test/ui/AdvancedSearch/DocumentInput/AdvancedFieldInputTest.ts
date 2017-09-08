import { AdvancedFieldInput } from '../../../../src/ui/AdvancedSearch/DocumentInput/AdvancedFieldInput';
import { $$ } from '../../../../src/utils/Dom';

export function AdvancedFieldInputTest() {
  describe('AdvancedFieldInput', () => {
    let input: AdvancedFieldInput;
    let fieldName: string;
    let value: string;

    beforeEach(function() {
      value = 'what';
      fieldName = '@test';
      input = new AdvancedFieldInput('test', fieldName, $$('div').el);
      input.build();
      input.input.setValue(value);
    });

    afterEach(function() {
      input = null;
      fieldName = null;
      value = null;
    });

    describe('getValue', () => {
      it('if contains, should return fieldName = value', () => {
        input.mode.setValue('Contains');
        expect(input.getValue()).toEqual(`${fieldName}=${value}`);
      });

      it('if does not contains, should return fieldName <> value', () => {
        input.mode.setValue('DoesNotContain');
        expect(input.getValue()).toEqual(`${fieldName}<>${value}`);
      });

      it('if matches, should return fieldName == "value"', () => {
        input.mode.setValue('Matches');
        expect(input.getValue()).toEqual(`${fieldName}==${value}`);
      });
    });
  });
}
