import { IAnalyticsClient } from './AnalyticsClient';
import {
  analyticsActionCauseList,
  IAnalyticsNoMeta,
  IAnalyticsResultsSortMeta,
  IAnalyticsPagerMeta,
  IAnalyticsActionCause
} from './AnalyticsActionListMeta';

export function logSearchBoxSubmitEvent(client: IAnalyticsClient) {
  client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
}

export function logSortEvent(client: IAnalyticsClient, resultsSortBy: string) {
  client.logSearchEvent<IAnalyticsResultsSortMeta>(analyticsActionCauseList.resultsSort, {
    resultsSortBy
  });
}
