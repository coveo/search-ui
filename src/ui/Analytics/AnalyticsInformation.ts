import { history } from 'coveo.analytics';
import { findLastIndex } from 'underscore';
import { LocalStorageUtils } from '../../Core';
import { Cookie } from '../../utils/CookieUtils';

export class AnalyticsInformation {
  private readonly visitorIdKey = 'visitorId';
  private readonly clientIdKey = 'clientId';

  public get visitorId() {
    const ls = new LocalStorageUtils<string>(this.visitorIdKey);
    return ls.load() || Cookie.get(this.visitorIdKey) || null;
  }

  public set visitorId(id: string) {
    new LocalStorageUtils(this.visitorIdKey).save(id);
  }

  public get clientId() {
    const ls = new LocalStorageUtils<string>(this.clientIdKey);
    return ls.load() || Cookie.get(this.clientIdKey) || null;
  }

  public set clientId(id: string) {
    new LocalStorageUtils(this.clientIdKey).save(id);
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
    new LocalStorageUtils(this.visitorIdKey).remove();
    new LocalStorageUtils(this.clientIdKey).remove();
  }

  private clearCookies() {
    Cookie.erase(this.visitorIdKey);
    Cookie.erase(this.clientIdKey);
  }
}
