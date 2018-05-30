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
  });
}
