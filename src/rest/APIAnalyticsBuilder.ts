import { ISearchEvent } from './SearchEvent';
import { IAPISearchEvent } from './APISearchEvent';
import { IClickEvent } from './ClickEvent';
import { IAPIDocumentViewEvent } from './APIDocumentViewEvent';
import { IAPICustomEvent } from './APICustomEvent';
import { ICustomEvent } from './CustomEvent';

export class APIAnalyticsBuilder {
  public static convertSearchEventToAPI(searchEvent: ISearchEvent) {
    var apiSearchEvent: IAPISearchEvent = {
      advancedQuery: searchEvent.advancedQuery,
      customMetadatas: searchEvent.customData,
      device: searchEvent.device,
      didYouMean: searchEvent.didYouMean,
      language: searchEvent.language,
      pageNumber: searchEvent.pageNumber,
      queryText: searchEvent.queryText,
      responseTime: searchEvent.responseTime,
      numberOfResults: searchEvent.numberOfResults,
      resultsPerPage: searchEvent.resultsPerPage,
      searchHub: searchEvent.originLevel1,
      searchInterface: searchEvent.originLevel2,
      searchQueryUid: searchEvent.searchQueryUid,
      type: searchEvent.actionType,
      actionCause: searchEvent.actionCause,
      queryPipeline: searchEvent.queryPipeline,
      splitTestRunName: searchEvent.splitTestRunName,
      splitTestRunVersion: searchEvent.splitTestRunVersion
    };
    return apiSearchEvent;
  }

  public static convertDocumentViewToAPI(documentView: IClickEvent): IAPIDocumentViewEvent {
    var apiDocumentView: IAPIDocumentViewEvent = {
      collectionName: documentView.collectionName,
      device: documentView.device,
      documentPosition: documentView.documentPosition,
      title: documentView.documentTitle,
      documentUrl: documentView.documentUrl,
      documentUri: documentView.documentUri,
      documentUriHash: documentView.documentUriHash,
      language: documentView.language,
      responseTime: documentView.responseTime,
      searchHub: documentView.originLevel1,
      searchInterface: documentView.originLevel2,
      searchQueryUid: documentView.searchQueryUid,
      sourceName: documentView.sourceName,
      viewMethod: documentView.viewMethod,
      customMetadatas: documentView.customData,
      actionCause: documentView.actionCause,
      queryPipeline: documentView.queryPipeline,
      splitTestRunName: documentView.splitTestRunName,
      splitTestRunVersion: documentView.splitTestRunVersion
    };
    return apiDocumentView;
  }

  public static convertCustomEventToAPI(customEvent: ICustomEvent): IAPICustomEvent {
    var apiCustomEvent: IAPICustomEvent = {
      actionCause: customEvent.actionCause,
      actionType: customEvent.actionType,
      device: customEvent.device,
      language: customEvent.language,
      responseTime: customEvent.responseTime,
      searchHub: customEvent.originLevel1,
      searchInterface: customEvent.originLevel2,
      customMetadatas: customEvent.customData
    };
    return apiCustomEvent;
  }
}
