import { Cookie } from '../../src/Core';
import { buildHistoryStore, buildNullHistoryStore } from '../../src/utils/HistoryStore';

export function HistoryStoreTest() {
  describe('HistoryStore', () => {
    const key = '__coveo.analytics.history';

    it('calling buildHistoryStore does not delete the actionHistory cookie', () => {
      Cookie.set(key, 'a');
      buildHistoryStore();
      expect(Cookie.get(key)).toBe('a');
    });

    it('calling buildNullHistoryStore does not delete the actionHistory cookie', () => {
      Cookie.set(key, 'a');
      buildNullHistoryStore();
      expect(Cookie.get(key)).toBe('a');
    });
  });
}
