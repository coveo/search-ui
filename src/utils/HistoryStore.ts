import { history } from 'coveo.analytics';
import { CookieStorage, getAvailableStorage, NullStorage } from 'coveo.analytics/dist/storage';

export function buildHistoryStore() {
  const historyStore = buildCookieHistoryStore();
  (historyStore as any).store = getAvailableStorage();

  return historyStore;
}

export function buildNullHistoryStore() {
  const historyStore = buildCookieHistoryStore();
  (historyStore as any).store = new NullStorage();

  return historyStore;
}

function buildCookieHistoryStore() {
  const cookieStorage = new CookieStorage();
  return new history.HistoryStore(cookieStorage);
}
