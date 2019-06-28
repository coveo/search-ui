import { IAnalyticsEvent } from './AnalyticsEvent';
import { IAnalyticsDynamicFacetMeta } from '../ui/Analytics/AnalyticsActionListMeta';

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
  /**
   * A representation of the state of each dynamic facet in the search interface when the action that triggered the event was executed.
   */
  facetState?: IAnalyticsDynamicFacetMeta[];
}
