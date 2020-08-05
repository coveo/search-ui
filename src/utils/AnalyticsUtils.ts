import { history } from 'coveo.analytics';
import { IAnalyticsActionCause, analyticsActionCauseList } from '../ui/Analytics/AnalyticsActionListMeta';
import { findLastIndex } from 'underscore';

export interface IClientInformationProvider {
  readonly visitorId: string;
  readonly clientId: string;
  readonly disabled: boolean;
}

export class AnalyticsUtils {
  private static clientInformationProvider: IClientInformationProvider;

  static get visitorId() {
    return this.analyticsEnabled ? this.clientInformationProvider.visitorId : null;
  }

  static get clientId() {
    return this.analyticsEnabled ? this.clientInformationProvider.clientId : null;
  }

  static get pageId() {
    const store = new history.HistoryStore();
    const actions = store.getHistory() as { name: string; value?: string }[];
    const pageViewActionId = findLastIndex(actions, action => action.name === 'PageView');
    if (pageViewActionId === -1) {
      return null;
    }
    return actions[pageViewActionId].value;
  }

  static get location() {
    return document.location.href;
  }

  static get referrer() {
    return document.referrer;
  }

  private static get analyticsEnabled() {
    return !!this.clientInformationProvider && !this.clientInformationProvider.disabled;
  }

  static setClientIdProvider(provider: IClientInformationProvider) {
    this.clientInformationProvider = provider;
  }

  static addActionCauseToList(newActionCause: IAnalyticsActionCause) {
    if (newActionCause.name && newActionCause.type) {
      analyticsActionCauseList[newActionCause.name] = newActionCause;
    }
  }

  static removeActionCauseFromList(actionCauseToRemoveName: string) {
    delete analyticsActionCauseList[actionCauseToRemoveName];
  }
}
