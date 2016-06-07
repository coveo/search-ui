/// <reference path="../Test.ts" />
module Coveo {
  describe('QueryDuration', function() {
    let test: Mock.IBasicComponentSetup<QueryDuration>;
    let results = FakeResults.createFakeResults(10);

    beforeEach(function() {
      test = Mock.basicComponentSetup<QueryDuration>(QueryDuration);
      results = FakeResults.createFakeResults(10);
    })

    afterEach(function() {
      test = null;
      results = null;
    })

    it('should be show with suitable value when duration is zero', function() {
      results.duration = 0;
      Simulate.query(test.env, { results: results });
      expect(test.cmp.element.textContent).toBe('in 0.01 seconds');
    })

    it('should show the query duration with proper formatting when it is under 1 second', function() {
      results.duration = 123;
      Simulate.query(test.env, { results: results });
      expect(test.cmp.element.textContent).toBe('in 0.12 seconds');
    })

    it('should show the query duration with proper formatting when it is above 1 second', function() {
      results.duration = 1234;
      Simulate.query(test.env, { results: results });
      expect(test.cmp.element.textContent).toBe('in 1.23 seconds');
    })
  })
}
