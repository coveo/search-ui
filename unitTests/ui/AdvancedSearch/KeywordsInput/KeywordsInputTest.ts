import { KeywordsInput } from '../../../../src/ui/AdvancedSearch/KeywordsInput/KeywordsInput';
import { ExpressionBuilder } from '../../../../src/ui/Base/ExpressionBuilder';
import { QueryBuilder } from '../../../../src/ui/Base/QueryBuilder';
import { $$ } from '../../../../src/utils/Dom';
import { Mock } from '../../../../testsFramework/TestsFramework';

export function KeywordsInputTest() {
  describe('KeywordsInput', () => {
    let input: KeywordsInput;

    beforeEach(function() {
      input = new KeywordsInput('test', $$('div').el);
      input.build();
    });

    afterEach(function() {
      input = null;
    });

    describe('updateQuery', () => {
      it('should add the value in the query builder', () => {
        let value = 'test';
        let queryBuilder = Mock.mock<QueryBuilder>(QueryBuilder);
        queryBuilder.advancedExpression = Mock.mock<ExpressionBuilder>(ExpressionBuilder);
        input.setValue(value);
        input.updateQuery(queryBuilder);
        expect(queryBuilder.advancedExpression.add).toHaveBeenCalledWith(value);
      });
    });
  });
}
