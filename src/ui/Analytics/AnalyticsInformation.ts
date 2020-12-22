import { history } from 'coveo.analytics';
import { findLastIndex } from 'underscore';

export class AnalyticsInformation {
  private readonly visitorIdKey = 'visitorId';
  private readonly clientIdKey = 'clientId';

  public get visitorId() {
    return localStorage.getItem(this.visitorIdKey);
  }

  public set visitorId(id: string) {
    localStorage.setItem(this.visitorIdKey, id);
  }

  public get clientId() {
    return localStorage.getItem(this.clientIdKey);
  }

  public set clientId(id: string) {
    localStorage.setItem(this.clientIdKey, id);
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
    localStorage.removeItem(this.visitorIdKey);
    localStorage.removeItem(this.clientIdKey);
  }
}
