import { DocumentInput } from '../../../../src/ui/AdvancedSearch/DocumentInput/DocumentInput';
import { QueryBuilder } from '../../../../src/ui/Base/QueryBuilder';
import { ExpressionBuilder } from '../../../../src/ui/Base/ExpressionBuilder';
import * as Mock from '../../../MockEnvironment';
import { $$ } from '../../../../src/utils/Dom';

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
