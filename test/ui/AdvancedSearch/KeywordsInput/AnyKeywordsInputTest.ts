/// <reference path="../../../Test.ts" />

module Coveo {
  describe('AnyKeywordsInput', () => {
    let input: AnyKeywordsInput;

    beforeEach(function () {
      input = new AnyKeywordsInput();
      input.build();
    });

    afterEach(function () {
      input = null;
    });

    describe('getValue', () => {
      it('should return the values separated by OR', () => {
        let value = 'starcraft starwars startrek';
        input.setValue(value);
        expect(input.getValue()).toEqual('starcraft OR starwars OR startrek')
      })
    })
  })
}
