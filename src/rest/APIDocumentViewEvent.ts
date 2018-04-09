export interface IAPIDocumentViewEvent {
  language: string;
  device: string;
  searchInterface: string;
  searchHub: string;
  responseTime: number;
  searchQueryUid: string;
  title: string;
  documentUrl: string;
  documentUri: string;
  documentUriHash: string;
  viewMethod: string;
  actionCause: string;
  queryPipeline: string;
  splitTestRunName: string;
  splitTestRunVersion: string;
  collectionName: string;
  sourceName: string;
  documentPosition: number;
  customMetadatas: { [name: string]: string };
}
