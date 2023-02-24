import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { QueryUtils } from '../../src/Core';

export function QueryUtilsTest() {
  describe('QueryUtils', () => {
    let result: IQueryResult;

    beforeEach(() => {
      result = FakeResults.createFakeResult();
    });

    it('should return the collection on a result if available', () => {
      result.raw.collection = 'a collection';
      expect(QueryUtils.getCollection(result)).toBe('a collection');
    });

    it('should return default collection if none is available on a result', () => {
      result.raw.collection = null;
      expect(QueryUtils.getCollection(result)).toBe('default');
    });

    it('should allow to set property on a result', () => {
      QueryUtils.setPropertyOnResult(result, 'foo', 'bar');
      expect(result['foo']).toBe('bar');
    });

    it('should allow to set property on childResults if available', () => {
      result = FakeResults.createFakeResultWithChildResult('result', 5, 10);
      QueryUtils.setPropertyOnResult(result, 'foo', 'bar');
      result.childResults.forEach(child => {
        expect(child['foo']).toBe('bar');
      });
    });

    describe('when setting state', () => {
      let state: Record<string, any>;
      beforeEach(() => {
        state = {
          q: 'foo',
          first: 20,
          t: 'bar'
        };
      });

      it('should be able to setState on a single result', () => {
        QueryUtils.setStateObjectOnQueryResult(state, result);

        expect(result.state.q).toBe('foo');
        expect(result.state.first).toBe(20);
        expect(result.state.t).toBe('bar');
      });

      it('should be able to setState on multiple results', () => {
        const results = FakeResults.createFakeResults();

        QueryUtils.setStateObjectOnQueryResults(state, results);

        results.results.forEach(r => {
          expect(r.state.q).toBe('foo');
          expect(r.state.first).toBe(20);
          expect(r.state.t).toBe('bar');
        });
      });
    });

    it('should be able to tell if a result is an attachment', () => {
      result.flags = 'IsAttachment';
      expect(QueryUtils.isAttachment(result)).toBeTruthy();

      result.flags = 'HasHtmlVersion;IsAttachment;AnotherFlag';
      expect(QueryUtils.isAttachment(result)).toBeTruthy();
    });

    it('should be able to tell if a result is not an attachment', () => {
      result.flags = '';
      expect(QueryUtils.isAttachment(result)).toBeFalsy();

      result.flags = 'HasHtmlVersion;AnotherFlag';
      expect(QueryUtils.isAttachment(result)).toBeFalsy();
    });

    it('should be able to tell if a result contains attachment', () => {
      result.flags = 'ContainsAttachment';
      expect(QueryUtils.containsAttachment(result)).toBeTruthy();

      result.flags = 'HasHtmlVersion;ContainsAttachment;AnotherFlag';
      expect(QueryUtils.containsAttachment(result)).toBeTruthy();
    });

    it('should be able to tell if a result does not contains attachment', () => {
      result.flags = '';
      expect(QueryUtils.containsAttachment(result)).toBeFalsy();

      result.flags = 'HasHtmlVersion;AnotherFlag';
      expect(QueryUtils.containsAttachment(result)).toBeFalsy();
    });

    it('should return a valid UUID', () => {
      expect(QueryUtils.generateWithCrypto()).toContain('-');
      expect(QueryUtils.generateWithCrypto().length).toBe(36);
    });

    it('should always return a UUID version 4', () => {
      let uuid = QueryUtils.generateWithCrypto();
      let versionBit = 13;
      expect(uuid[versionBit]).toBe('4');
    });

    it('should expose a last resort method to generate UUID for analytics events if everything else fails', () => {
      expect(QueryUtils.generateWithRandom()).toContain('-');
      expect(QueryUtils.generateWithRandom().length).toBe(36);
    });
  });
}
