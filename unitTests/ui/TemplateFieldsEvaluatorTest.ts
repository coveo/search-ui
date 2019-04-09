import { TemplateFieldsEvaluator } from '../../src/ui/Templates/TemplateFieldsEvaluator';
import { IQueryResult } from '../../src/rest/QueryResult';
import { IFieldsToMatch } from '../../src/ui/Templates/Template';
import { FakeResults } from '../Fake';
export function TemplateFieldsEvaluatorTest() {
  describe('TemplateFieldsEvaluatorTest', () => {
    let result: IQueryResult;
    let fieldsToMatch: IFieldsToMatch[];

    beforeEach(() => {
      result = FakeResults.createFakeResult();
      result.raw['foo'] = 'bar';
    });

    afterEach(() => {
      result = null;
      fieldsToMatch = null;
    });

    it('should be able to evaluate fields to match', () => {
      fieldsToMatch = [
        {
          field: 'foo',
          values: ['bar', 'baz']
        }
      ];
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
    });

    it('should be able to evaluate fields that do not match', () => {
      fieldsToMatch = [
        {
          field: 'foo',
          values: ['brak']
        }
      ];
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(false);
    });

    it('should be able to evaluate fields that are not null', () => {
      fieldsToMatch = [
        {
          field: 'foo'
        }
      ];
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
    });

    it('should be able to evaluate fields that are null', () => {
      fieldsToMatch = [
        {
          field: 'bar'
        }
      ];
      expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(false);
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

      it(`when the fieldsToMatch #field is the multi-value field
      and the #values is an array containing the multi-value field value as uppercase,
      it returns true`, () => {
        const uppercaseValues = multiValueFieldValues.map(val => val.toUpperCase());
        fieldsToMatch = [{ field: multiValueField, values: uppercaseValues }];
        expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
      });

      it(`given the result raw multi-value field has uppercase values,
      when the fieldsToMatch #field is the multi-value field
      and the #values is an array containing the multi-value field value as lowercase,
      it returns true`, () => {
        const uppercaseValues = multiValueFieldValues.map(val => val.toUpperCase());
        const lowercaseValues = multiValueFieldValues.map(val => val.toLowerCase());

        result.raw[multiValueField] = uppercaseValues;
        fieldsToMatch = [{ field: multiValueField, values: lowercaseValues }];

        expect(TemplateFieldsEvaluator.evaluateFieldsToMatch(fieldsToMatch, result)).toBe(true);
      });
    });
  });
}
