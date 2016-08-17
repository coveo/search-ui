import {KeywordsInput} from '../../../../src/ui/AdvancedSearch/KeywordsInput/KeywordsInput';
import {QueryBuilder} from '../../../../src/ui/Base/QueryBuilder';
import * as Mock from '../../../MockEnvironment';

export function KeywordsInputTest() {
  describe('KeywordsInput', () => {
    let input: KeywordsInput;

    beforeEach(function () {
      input = new KeywordsInput('test');
      input.build();
    });

    afterEach(function () {
      input = null;
    });

    describe('updateQuery', () => {
      it('should add the value in the query builder', () => {
        let value = 'test';
        let queryBuilder = Mock.mock<QueryBuilder>(QueryBuilder);
        input.setValue(value);
        input.updateQuery(queryBuilder);
        expect(queryBuilder.advancedExpression.add).toHaveBeenCalledWith(value)
      })
    })
  })
}
