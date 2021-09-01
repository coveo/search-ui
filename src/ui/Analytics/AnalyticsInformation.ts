import { findLastIndex } from 'underscore';
import { LocalStorageUtils } from '../../Core';
import { Cookie } from '../../utils/CookieUtils';
import { buildHistoryStore } from '../../utils/HistoryStore';

export class AnalyticsInformation {
  private readonly visitorIdKey = 'visitorId';
  private readonly clientIdKey = 'clientId';

  public get clientId() {
    // Yes, its backwards: We are using a key named "visitorId" to fetched something for "clientId"
    // This is done to synchronize with https://github.com/coveo/coveo.analytics.js
    // This is intentional.
    try {
      return localStorage.getItem(this.visitorIdKey) || null;
    } catch (e) {
      console.warn(
        'Unable to get the visitorId.\nTo resolve this message, adjust your browser settings to allow third-party cookies and data.',
        e
      );
    }
  }

  public set clientId(id: string) {
    try {
      localStorage.setItem(this.visitorIdKey, id);
    } catch(e) {
      console.warn(
        'Unable to set the visitorId.\nTo resolve this message, adjust your browser settings to allow third-party cookies and data.',
        e
      );
    }
  }

  public get lastPageId() {
    const store = buildHistoryStore();
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
     try {
       localStorage.removeItem(this.visitorIdKey);
       new LocalStorageUtils(this.clientIdKey).remove();
     } catch (e) {
       console.warn(
         'Unable to set the visitorId.\nTo resolve this message, adjust your browser settings to allow third-party cookies and data.',
         e
       );
     }
  }

  private clearCookies() {
    Cookie.erase(this.visitorIdKey);
    Cookie.erase(this.clientIdKey);
  }
}
