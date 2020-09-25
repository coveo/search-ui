import { history, storage } from 'coveo.analytics';

export function buildHistoryStore() {
  const historyStore = buildCookieHistoryStore();
  (historyStore as any).store = storage.getAvailableStorage();

  return historyStore;
}

export function buildNullHistoryStore() {
  const historyStore = buildCookieHistoryStore();
  (historyStore as any).store = new storage.NullStorage();

  return historyStore;
}

function buildCookieHistoryStore() {
  const cookieStorage = new storage.CookieStorage();
  return new history.HistoryStore(cookieStorage);
}
