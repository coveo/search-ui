import { history } from 'coveo.analytics';
import { IAnalyticsActionCause, analyticsActionCauseList } from '../ui/Analytics/AnalyticsActionListMeta';
import { findLastIndex } from 'underscore';

export interface IClientInformationProvider {
  readonly visitorId: string;
  readonly clientId: string;
  readonly disabled: boolean;
}

export class AnalyticsUtils {
  private static currentInstance: AnalyticsUtils;
  private clientInformationProvider: IClientInformationProvider = null;

  public static get instance() {
    return this.currentInstance || (this.currentInstance = new AnalyticsUtils());
  }

  private constructor() {}

  public get visitorId() {
    return this.trackingEnabled ? this.clientInformationProvider.visitorId : null;
  }

  public get clientId() {
    return this.trackingEnabled ? this.clientInformationProvider.clientId : null;
  }

  public get pageId() {
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

  private get trackingEnabled() {
    return !!this.clientInformationProvider && !this.clientInformationProvider.disabled;
  }

  public setClientInformationProvider(clientInformationProvider: IClientInformationProvider) {
    this.clientInformationProvider = clientInformationProvider;
  }

  public addActionCauseToList(newActionCause: IAnalyticsActionCause) {
    if (newActionCause.name && newActionCause.type) {
      analyticsActionCauseList[newActionCause.name] = newActionCause;
    }
  }

  public removeActionCauseFromList(actionCauseToRemoveName: string) {
    delete analyticsActionCauseList[actionCauseToRemoveName];
  }
}
