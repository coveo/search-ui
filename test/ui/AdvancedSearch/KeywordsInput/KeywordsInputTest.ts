/// <reference path="../../../Test.ts" />

module Coveo {
  describe('KeywordsInput', () => {
    let input: KeywordsInput;

    beforeEach(function () {
      input = new KeywordsInput('test');
      input.build();
    });

    afterEach(function () {
      input = null;
    });

    describe('updateQueryState', () => {
      it('should set the query state q attribute to the input value', () => {
        let value = 'test';
        let queryState = Mock.mockComponent<QueryStateModel>(QueryStateModel, QueryStateModel.ID);
        (<jasmine.Spy>queryState.get).and.returnValue('');
        input.setValue(value);
        input.updateQueryState(queryState);
        expect(queryState.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.q, value)
      })
      it('should add the input value to the query state if not empty', () => {
        let value = 'test';
        let query = 'query';
        let queryState = Mock.mockComponent<QueryStateModel>(QueryStateModel, QueryStateModel.ID);
        (<jasmine.Spy>queryState.get).and.returnValue(query);
        input.setValue(value);
        input.updateQueryState(queryState);
        expect(queryState.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.q, query + ' (' + value + ')');
      })
    })
  })
}
