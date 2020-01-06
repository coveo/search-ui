import { IDuringQueryEventArgs, QueryEvents } from '../../events/QueryEvents';
import { IQueryResults } from '../../rest/QueryResults';
import { IQuery } from '../../rest/Query';
import { ISearchEvent } from '../../rest/SearchEvent';
import { AnalyticsEndpoint } from '../../rest/AnalyticsEndpoint';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { Component } from '../Base/Component';
import { QueryController } from '../../controllers/QueryController';
import { Defer } from '../../misc/Defer';
import { APIAnalyticsBuilder } from '../../rest/APIAnalyticsBuilder';
import { IAnalyticsSearchEventsArgs, AnalyticsEvents, IAnalyticsEventArgs } from '../../events/AnalyticsEvents';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { QueryStateModel } from '../../models/QueryStateModel';
import { indexOf, map, each } from 'underscore';
import { Logger } from '../../misc/Logger';
import { IAnalyticsFacetState } from './IAnalyticsFacetState';

export class PendingSearchEvent {
  private handler: (evt: Event, arg: IDuringQueryEventArgs) => void;
  private searchPromises: Promise<IQueryResults>[] = [];
  private results: IQueryResults[] = [];
  private facetState: IAnalyticsFacetState[];
  protected cancelled = false;
  protected finished = false;
  protected searchEvents: ISearchEvent[] = [];

  constructor(
    public root: HTMLElement,
    public endpoint: AnalyticsEndpoint,
    public templateSearchEvent: ISearchEvent,
    public sendToCloud: boolean
  ) {
    Assert.exists(root);
    Assert.exists(endpoint);
    Assert.exists(templateSearchEvent);

    this.handler = (evt: Event, arg: IDuringQueryEventArgs) => {
      this.handleDuringQuery(evt, arg);
    };
    $$(root).on(QueryEvents.duringQuery, this.handler);
  }

  public getEventCause() {
    return this.templateSearchEvent.actionCause;
  }

  public getEventMeta() {
    return this.templateSearchEvent.customData;
  }

  public addFacetState(state: IAnalyticsFacetState[]) {
    if (!this.facetState) {
      this.facetState = [];
    }

    this.facetState.push(...state);
  }

  public cancel() {
    this.stopRecording();
    this.cancelled = true;
  }

  public stopRecording() {
    if (this.handler) {
      $$(this.root).off(QueryEvents.duringQuery, this.handler);
      $$(this.root).off(QueryEvents.duringFetchMoreQuery, this.handler);
      this.handler = null;
    }
  }

  protected handleDuringQuery(evt: Event, args: IDuringQueryEventArgs, queryBoxContentToUse?: string) {
    Assert.check(!this.finished);
    Assert.check(!this.cancelled);

    // When synchronizing multiple search interfaces under a single search event
    // (think Salesforce boxes), we need to collect all search events and send them
    // in one single batch. So we gather all events until we idle out and then we
    // monitor those before sending the data.

    this.searchPromises.push(args.promise);

    const eventTarget = <HTMLElement>evt.target;
    const searchInterface = <SearchInterface>Component.get(eventTarget, SearchInterface);
    Assert.exists(searchInterface);
    // We try to grab ahead of time the content of the search box before the query returns
    // This is because it's possible that the content of the search box gets modified when the query returns (for example : DidYouMean)
    if (!queryBoxContentToUse) {
      queryBoxContentToUse = searchInterface.queryStateModel.get(QueryStateModel.attributesEnum.q);
    }
    const queryController = Component.get(eventTarget, QueryController);
    Assert.exists(queryController);

    this.updateSearchEventsAndQueryResults(args, searchInterface, queryBoxContentToUse);
  }

  private async updateSearchEventsAndQueryResults(
    args: IDuringQueryEventArgs,
    searchInterface: SearchInterface,
    queryBoxContentToUse: string
  ) {
    try {
      const queryResults: IQueryResults = await args.promise;

      Assert.exists(queryResults);
      Assert.check(!this.finished);

      const isRecommendationPanelAction = this.templateSearchEvent.actionCause === analyticsActionCauseList.recommendation.name;

      if (queryResults._reusedSearchUid !== true || isRecommendationPanelAction) {
        const searchEvent: ISearchEvent = { ...this.templateSearchEvent };
        this.fillSearchEvent(searchEvent, searchInterface, args.query, queryResults, queryBoxContentToUse);
        this.searchEvents.push(searchEvent);
        this.results.push(queryResults);
      }
    } catch (e) {
      new Logger(this).error(e);
    }

    const index = indexOf(this.searchPromises, args.promise);
    this.searchPromises.splice(index, 1);

    if (!this.searchPromises.length) {
      this.flush();
    }
  }

  private flush() {
    if (!this.cancelled) {
      this.stopRecording();
      this.finished = true;
      Assert.check(this.searchEvents.length == this.results.length);

      Defer.defer(() => {
        if (this.sendToCloud) {
          this.endpoint.sendSearchEvents(this.searchEvents);
        }
        const apiSearchEvents = map(this.searchEvents, (searchEvent: ISearchEvent) => {
          return APIAnalyticsBuilder.convertSearchEventToAPI(searchEvent);
        });
        $$(this.root).trigger(AnalyticsEvents.searchEvent, <IAnalyticsSearchEventsArgs>{
          searchEvents: apiSearchEvents
        });
        if (this.searchEvents.length) {
          this.searchEvents.forEach(searchEvent => {
            $$(this.root).trigger(AnalyticsEvents.analyticsEventReady, <IAnalyticsEventArgs>{
              event: 'CoveoSearchEvent',
              coveoAnalyticsEventData: searchEvent
            });
          });
        }
      });
    }
  }

  private fillSearchEvent(
    searchEvent: ISearchEvent,
    searchInterface: SearchInterface,
    query: IQuery,
    queryResults: IQueryResults,
    queryBoxContentToUse?: string
  ) {
    Assert.exists(searchEvent);
    Assert.exists(searchInterface);
    Assert.exists(query);
    Assert.exists(queryResults);

    const currentQuery = <string>searchInterface.queryStateModel.get(QueryStateModel.attributesEnum.q);
    searchEvent.queryPipeline = queryResults.pipeline;
    searchEvent.splitTestRunName = searchEvent.splitTestRunName || queryResults.splitTestRun;
    searchEvent.splitTestRunVersion =
      searchEvent.splitTestRunVersion || (queryResults.splitTestRun != undefined ? queryResults.pipeline : undefined);
    searchEvent.originLevel2 = searchEvent.originLevel2 || searchInterface.queryStateModel.get('t') || 'default';
    searchEvent.queryText = queryBoxContentToUse || currentQuery || query.q || ''; // do not log the query sent to the server if possible; it may contain added syntax depending on options
    searchEvent.advancedQuery = query.aq || '';
    searchEvent.didYouMean = query.enableDidYouMean;
    searchEvent.numberOfResults = queryResults.totalCount;
    searchEvent.responseTime = queryResults.duration;
    searchEvent.pageNumber = query.firstResult / query.numberOfResults;
    searchEvent.resultsPerPage = query.numberOfResults;
    searchEvent.searchQueryUid = queryResults.searchUid;
    searchEvent.queryPipeline = queryResults.pipeline;
    searchEvent.facetState = this.facetState;

    // The context_${key} format is important for the Analytics backend
    // This is what they use to recognize a custom data that will be used internally by other coveo's service.
    // In this case, Coveo Machine Learning will be the consumer of this information.
    if (query.context != undefined) {
      each(query.context, (value: string, key: string) => (searchEvent.customData[`context_${key}`] = value));
    }

    if (queryResults.refinedKeywords != undefined && queryResults.refinedKeywords.length != 0) {
      searchEvent.customData['refinedKeywords'] = queryResults.refinedKeywords;
    }
  }
}
