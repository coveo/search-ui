import { history } from 'coveo.analytics';
import { findLastIndex } from 'underscore';
import { LocalStorageUtils } from '../../Core';
import { Cookie } from '../../utils/CookieUtils';

export class AnalyticsInformation {
  private readonly visitorIdKey = 'visitorId';
  private readonly clientIdKey = 'clientId';

  public get clientId() {
    // Yes, its backwards: We are using a key named "visitorId" to fetched something for "clientId"
    // This is done to synchronize with https://github.com/coveo/coveo.analytics.js
    // This is intentional.
    return localStorage.getItem(this.visitorIdKey) || null;
  }

  public set clientId(id: string) {
    localStorage.setItem(this.visitorIdKey, id);
  }

  public get lastPageId() {
    const store = new history.HistoryStore();
    const actions = store.getHistory() as { name: string; value?: string }[];
    const pageViewActionId = findLastIndex(actions, action => action.name === 'PageView');
    if (pageViewActionId === -1) {
      return null;
    }
    return actions[pageViewActionId].value;
  }

  public get location() {
    return document.location.href;
  }

  public get referrer() {
    return document.referrer;
  }

  public clear() {
    this.clearLocalStorage();
    this.clearCookies();
  }

  private clearLocalStorage() {
    localStorage.removeItem(this.visitorIdKey);
    new LocalStorageUtils(this.clientIdKey).remove();
  }

  private clearCookies() {
    Cookie.erase(this.visitorIdKey);
    Cookie.erase(this.clientIdKey);
  }
}
