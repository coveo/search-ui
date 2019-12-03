import { TemplateFieldsEvaluator } from '../../src/ui/Templates/TemplateFieldsEvaluator';
import { IQueryResult } from '../../src/rest/QueryResult';
import { IFieldsToMatch } from '../../src/ui/Templates/Template';
import { FakeResults } from '../Fake';
export function TemplateFieldsEvaluatorTest() {
  describe('TemplateFieldsEvaluatorTest', () => {
    let result: IQueryResult;
    let fieldsToMatch: IFieldsToMatch[];
    const field = 'foo';
    const fieldValue = 'bar';

    beforeEach(() => {
      result = FakeResults.createFakeResult();
      result.raw[field] = fieldValue;
    });

    afterEach(() => {
      result = null;
      fieldsToMatch = null;
    });

    it('should evaluate an undefined array', () => {
      fieldsToMatch = undefined;
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
    });

    it('should be able to evaluate fields to match', () => {
      fieldsToMatch = [{ field, values: [fieldValue, 'baz'] }];
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
    });

    it('should not throw an error for a result with no value for a given field', () => {
      fieldsToMatch = [{ field: 'doesNotExists', values: ['does not matter'] }];
      expect(() => TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).not.toThrow();
    });

    it('should be able to evaluate fields that do not match', () => {
      fieldsToMatch = [{ field: 'foo', values: ['brak'] }];
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(false);
    });

    it('should be able to evaluate fields that are not null', () => {
      fieldsToMatch = [{ field }];
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
    });

    it('should be able to evaluate fields that are null', () => {
      fieldsToMatch = [{ field: 'bar' }];
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(false);
    });

    it(`when the fieldsToMatch #values is an array containing the field value as uppercase,
    it returns true`, () => {
      fieldsToMatch = [{ field, values: [fieldValue.toUpperCase()] }];
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
    });

    it(`given the result raw field has an uppercase value,
    when the fieldsToMatch #values is an array containing the field value as lowercase,
    it returns true`, () => {
      result.raw[field] = fieldValue.toUpperCase();
      fieldsToMatch = [{ field, values: [fieldValue.toLowerCase()] }];

      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
    });

    describe(`when the result raw has a field that has an array of values (e.g. a multi-value field)`, () => {
      const multiValueField = 'language';
      const multiValueFieldValues = ['francais'];

      beforeEach(() => {
        result.raw[multiValueField] = multiValueFieldValues;
      });

      it(`when the fieldsToMatch #field is the multi-value field, it returns true`, () => {
        fieldsToMatch = [{ field: multiValueField }];
        expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
      });

      it(`when the fieldsToMatch #field is the multi-value field
      and the #values is an empty array, it returns false`, () => {
        fieldsToMatch = [{ field: multiValueField, values: [] }];
        expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(false);
      });

      it(`when the fieldsToMatch #field is the multi-value field
      and the #values is an array containing the multi-value field value,
      it returns true`, () => {
        fieldsToMatch = [{ field: multiValueField, values: [...multiValueFieldValues] }];
        expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
      });

      it(`when the fieldsToMatch #field is the multi-value field
      and the #values is a populated array not containing the multi-value field value,
      it returns false`, () => {
        fieldsToMatch = [{ field: multiValueField, values: ['english'] }];
        expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(false);
      });

      it(`when the result multi-value field has more than one value,
      when the fieldsToMatch #field is the multi-value field
      and the #values is a populated array containing the last result field value,
      it returns 'true'`, () => {
        result.raw[multiValueField] = ['francais', 'espanol', 'english'];
        fieldsToMatch = [{ field: multiValueField, values: ['english'] }];

        expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
      });
    });
  });
}
