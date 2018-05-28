import { DocumentInput } from '../../../../src/ui/AdvancedSearch/DocumentInput/DocumentInput';
import { ExpressionBuilder } from '../../../../src/ui/Base/ExpressionBuilder';
import { QueryBuilder } from '../../../../src/ui/Base/QueryBuilder';
import { $$ } from '../../../../src/utils/Dom';
import { Mock } from '../../../../testsFramework/TestsFramework';

export function DocumentInputTest() {
  describe('DocumentInput', () => {
    let input: DocumentInput;

    beforeEach(function() {
      input = new DocumentInput('test', $$('div').el);
      input.build();
    });

    afterEach(function() {
      input = null;
    });

    describe('updateQuery', () => {
      it('should add the value in the advanced query', () => {
        let value = 'test';
        spyOn(input, 'getValue').and.returnValue(value);
        let queryBuilder = Mock.mock<QueryBuilder>(QueryBuilder);
        let advancedExpression = Mock.mock<ExpressionBuilder>(ExpressionBuilder);
        queryBuilder.advancedExpression = advancedExpression;
        input.updateQuery(queryBuilder);
        expect(advancedExpression.add).toHaveBeenCalledWith(value);
      });
    });
  });
}
