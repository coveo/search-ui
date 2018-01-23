export interface IAPISearchEvent {
  language: string;
  device: string;
  searchInterface: string;
  searchHub: string;
  responseTime: number;
  customMetadatas: { [name: string]: string };
  queryText: string;
  advancedQuery: string;
  didYouMean: boolean;
  numberOfResults: number;
  resultsPerPage: number;
  pageNumber: number;
  type: string;
  actionCause: string;
  queryPipeline: string;
  splitTestRunName: string;
  splitTestRunVersion: string;
  searchQueryUid: string;
}
