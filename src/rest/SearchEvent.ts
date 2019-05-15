import { IAnalyticsEvent } from './AnalyticsEvent';

export interface ISearchEvent extends IAnalyticsEvent {
  searchQueryUid: string;
  queryPipeline: string;
  splitTestRunName: string;
  splitTestRunVersion: string;
  mobile: boolean;
  queryText: string;
  numberOfResults: number;
  responseTime: number;
  resultsPerPage: number;
  pageNumber: number;
  advancedQuery: string;
  didYouMean: boolean;
  contextual: boolean;
}
