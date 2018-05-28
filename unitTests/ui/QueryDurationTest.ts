import { l } from '../../src/MiscModules';
import { QueryDuration } from '../../src/ui/QueryDuration/QueryDuration';
import { FakeResults, Mock, Simulate } from '../../testsFramework/TestsFramework';

export function QueryDurationTest() {
  describe('QueryDuration', () => {
    let test: Mock.IBasicComponentSetup<QueryDuration>;
    let results = FakeResults.createFakeResults(10);

    beforeEach(() => {
      test = Mock.basicComponentSetup<QueryDuration>(QueryDuration);
      results = FakeResults.createFakeResults(10);
    });

    afterEach(() => {
      test = null;
      results = null;
    });

    it('should be show with suitable value when duration is zero', () => {
      results.duration = 0;
      results.searchAPIDuration = 0;
      Simulate.query(test.env, { results: results });
      expect(test.cmp.element.textContent).toBe('in 0.01 seconds');
    });

    it('should show the query duration with proper formatting when it is under 1 second', () => {
      results.duration = 123;
      results.searchAPIDuration = 1234;
      Simulate.query(test.env, { results: results });
      expect(test.cmp.element.textContent).toBe('in 0.12 seconds');
    });

    it('should show the query duration with proper formatting when it is above 1 second', () => {
      results.duration = 1234;
      results.searchAPIDuration = 123;
      Simulate.query(test.env, { results: results });
      expect(test.cmp.element.textContent).toBe('in 1.23 seconds');
    });

    it('should show a tooltip with the indexDuration', () => {
      results.indexDuration = 500;
      Simulate.query(test.env, { results: results });
      expect(test.cmp.element.getAttribute('title')).toContain(l('IndexDuration', 'in 0.50 seconds'));
    });

    it('should show a tooltip with the searchAPIDuration', () => {
      results.searchAPIDuration = 500;
      Simulate.query(test.env, { results: results });
      expect(test.cmp.element.getAttribute('title')).toContain(l('SearchAPIDuration', 'in 0.50 seconds'));
    });

    it('should show a tooltip with the duration', () => {
      results.duration = 500;
      Simulate.query(test.env, { results: results });
      expect(test.cmp.element.getAttribute('title')).toContain(l('Duration', 'in 0.50 seconds'));
    });
  });
}
