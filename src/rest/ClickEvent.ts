import { IAnalyticsEvent } from './AnalyticsEvent';

export interface IClickEvent extends IAnalyticsEvent {
  searchQueryUid: string;
  queryPipeline: string;
  splitTestRunName: string;
  splitTestRunVersion: string;
  documentUri: string;
  documentUriHash: string;
  documentUrl: string;
  documentTitle: string;
  documentCategory: string;
  collectionName: string;
  sourceName: string;
  documentPosition: number;
  viewMethod: string;
  rankingModifier: string;
}
