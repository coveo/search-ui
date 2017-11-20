import { RootComponent } from '../ui/Base/RootComponent';
import { IQueryResults } from '../rest/QueryResults';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { IQuery } from '../rest/Query';
import { ISearchEndpoint, IEndpointCallOptions } from '../rest/SearchEndpointInterface';
import { SearchEndpoint } from '../rest/SearchEndpoint';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';
import { ISearchInterfaceOptions } from '../ui/SearchInterface/SearchInterface';
import { Assert } from '../misc/Assert';
import { SearchEndpointWithDefaultCallOptions } from '../rest/SearchEndpointWithDefaultCallOptions';
import {
  INewQueryEventArgs,
  IPreprocessResultsEventArgs,
  INoResultsEventArgs,
  IQuerySuccessEventArgs,
  IQueryErrorEventArgs,
  IDuringQueryEventArgs,
  QueryEvents,
  IFetchMoreSuccessEventArgs,
  IDoneBuildingQueryEventArgs,
  IBuildingQueryEventArgs,
  IBuildingCallOptionsEventArgs
} from '../events/QueryEvents';
import { QueryUtils } from '../utils/QueryUtils';
import { Defer } from '../misc/Defer';
import { $$, Dom } from '../utils/Dom';
import { Utils } from '../utils/Utils';
import { BaseComponent } from '../ui/Base/BaseComponent';
import { ModalBox } from '../ExternalModulesShim';
import { history } from 'coveo.analytics';
import * as _ from 'underscore';

/**
 * Possible options when performing a query with the query controller
 */
export interface IQueryOptions {
  /**
   * If the analytics component is enabled in the interface, it will look for any query executed by the query controller for which no analytics event was associated.<br/>
   * By setting this property to true, this will cancel this check when the query is performed
   */
  ignoreWarningSearchEvent?: boolean;
  /**
   * Specify that the query to execute is a search as you type. This information will be passed down in the query events for component and external code to determine their behavior
   */
  searchAsYouType?: boolean;
  /**
   * Specify a function that you wish to execute just before the query is executed
   */
  beforeExecuteQuery?: () => void;
  /**
   * Cancel the query
   */
  cancel?: boolean;
  /**
   * The component from which the query originated. For example the pager will set the property to tweak it's behaviour
   */
  origin?: any;

  /**
   * Whether or not to log the query in the user actions history when using the page view script: https://github.com/coveo/coveo.analytics.js.
   * Only the 'q' part of the query will be logged.
   * This option is useful, because it prevents the query to be logged twice when a {@link Recommendation} component is present.
   * It also makes sure that only relevant queries are logged. For exemple, the 'empty' interface load query isn't logged.
   */
  logInActionsHistory?: boolean;
  isFirstQuery?: boolean;
  keepLastSearchUid?: boolean;
  closeModalBox?: boolean;
  shouldRedirectStandaloneSearchbox?: boolean;
}

interface ILastQueryLocalStorage {
  hash: string;
  uid: string;
  expire: number;
}

class DefaultQueryOptions implements IQueryOptions {
  searchAsYouType = false;
  beforeExecuteQuery: () => void;
  closeModalBox = true;
  cancel = false;
  logInActionsHistory = false;
  shouldRedirectStandaloneSearchbox = true;
}

/**
 * This class is automatically instantiated and bound to the root of your search interface when you initialize the framework.<br/>
 * It is essentially a singleton that wraps the access to the {@link SearchEndpoint} endpoint to execute query, and is in charge of triggering the different query events.<br/>
 * This is what every component of the framework uses internally to execute query or access the endpoint.<br/>
 * When calling <code>Coveo.executeQuery</code> this class is used.
 */
export class QueryController extends RootComponent {
  static ID = 'QueryController';
  public historyStore: CoveoAnalytics.HistoryStore;

  private currentPendingQuery: Promise<IQueryResults>;
  private lastQueryBuilder: QueryBuilder;
  private lastQueryHash: string;
  private lastQuery: IQuery;
  private lastSearchUid: string;
  private lastQueryResults: IQueryResults;
  private currentError: any;
  private firstQuery: boolean;
  private createdOneQueryBuilder: boolean;
  private showingExecutingQueryAnimation = false;
  private overrideEndpoint: SearchEndpoint;

  private localStorage = new LocalStorageUtils<ILastQueryLocalStorage>('lastQueryHash');

  /**
   * Create a new query controller
   * @param element
   * @param options
   */
  constructor(element: HTMLElement, public options: ISearchInterfaceOptions, public usageAnalytics, public searchInterface) {
    super(element, QueryController.ID);
    Assert.exists(element);
    Assert.exists(options);
    this.firstQuery = true;
    this.historyStore = new history.HistoryStore();
  }

  /**
   * Set the {@link SearchEndpoint} that the query controller should use to execute query
   * @param endpoint
   */
  public setEndpoint(endpoint: SearchEndpoint) {
    this.overrideEndpoint = endpoint;
    this.logger.debug('Endpoint set', endpoint);
  }

  /**
   * Get the {@link SearchEndpoint} that is currently used by the query controller to execute query
   * @returns {SearchEndpoint}
   */
  public getEndpoint(): ISearchEndpoint {
    let endpoint = this.overrideEndpoint || this.options.endpoint;

    // We must wrap the endpoint in a decorator that'll add the call options
    // we obtain by firing the proper event. Those are used for authentication
    // providers, and I guess other stuff later on.
    return new SearchEndpointWithDefaultCallOptions(endpoint, this.getCallOptions());
  }

  /**
   * Return the last query that was performed by the query controller
   * @returns {IQuery|Query}
   */
  public getLastQuery() {
    return this.lastQuery || new QueryBuilder().build();
  }

  /**
   * Return the last query results set.
   * @returns {IQueryResults}
   */
  public getLastResults() {
    return this.lastQueryResults;
  }

  /**
   * Execute a query and return a Promise of IQueryResults.<br/>
   * This will execute the normal query flow, triggering all the necessary query events (newQuery <br/>
   * All components present in the interface will act accordingly (modify the query and render results if needed).
   * @param options
   * @returns {Promise<IQueryResults>}
   */
  public executeQuery(options?: IQueryOptions): Promise<IQueryResults> {
    options = <IQueryOptions>_.extend(new DefaultQueryOptions(), options);

    if (options.closeModalBox) {
      ModalBox.close(true);
    }

    this.logger.debug('Executing new query');

    this.cancelAnyCurrentPendingQuery();

    if (options.beforeExecuteQuery != null) {
      options.beforeExecuteQuery();
    }

    if (!options.ignoreWarningSearchEvent) {
      this.usageAnalytics.warnAboutSearchEvent();
    }

    this.showExecutingQueryAnimation();

    let dataToSendOnNewQuery: INewQueryEventArgs = {
      searchAsYouType: options.searchAsYouType,
      cancel: options.cancel,
      origin: options.origin,
      shouldRedirectStandaloneSearchbox: options.shouldRedirectStandaloneSearchbox
    };

    this.newQueryEvent(dataToSendOnNewQuery);

    if (dataToSendOnNewQuery.cancel) {
      this.cancelQuery();
      return;
    }

    let queryBuilder = this.createQueryBuilder(options);

    // The query was canceled
    if (!queryBuilder) {
      return;
    }

    let query = queryBuilder.build();
    if (options.logInActionsHistory) {
      this.logQueryInActionsHistory(query, options.isFirstQuery);
    }

    let endpointToUse = this.getEndpoint();

    let promise = (this.currentPendingQuery = endpointToUse.search(query));
    promise
      .then(queryResults => {
        Assert.exists(queryResults);
        let firstQuery = this.firstQuery;
        if (this.firstQuery) {
          this.firstQuery = false;
        }
        // If our promise is no longer the current one, then the query
        // has been cancel. We should do nothing here.
        if (promise !== this.currentPendingQuery) {
          return;
        }

        this.logger.debug('Query results received', query, queryResults);
        let enableHistory = this.searchInterface && this.searchInterface.options && this.searchInterface.options.enableHistory;

        if ((!firstQuery || enableHistory) && this.keepLastSearchUid(query, queryResults)) {
          queryResults.searchUid = this.getLastSearchUid();
          queryResults._reusedSearchUid = true;
          QueryUtils.setPropertyOnResults(queryResults, 'queryUid', this.getLastSearchUid());
        } else {
          this.lastQueryHash = this.queryHash(query, queryResults);
          this.lastSearchUid = queryResults.searchUid;
        }

        this.lastQuery = query;
        this.lastQueryResults = queryResults;
        this.currentError = null;

        let dataToSendOnPreprocessResult: IPreprocessResultsEventArgs = {
          queryBuilder: queryBuilder,
          query: query,
          results: queryResults,
          searchAsYouType: options.searchAsYouType
        };
        this.preprocessResultsEvent(dataToSendOnPreprocessResult);

        let dataToSendOnNoResult: INoResultsEventArgs = {
          queryBuilder: queryBuilder,
          query: query,
          results: queryResults,
          searchAsYouType: options.searchAsYouType,
          retryTheQuery: false
        };
        if (queryResults.results.length == 0) {
          this.noResultEvent(dataToSendOnNoResult);
        }

        if (dataToSendOnNoResult.retryTheQuery) {
          // When retrying the query, we must forward the results to the deferred we
          // initially returned, in case someone is listening on it.
          return this.executeQuery();
        } else {
          this.lastQueryBuilder = queryBuilder;
          this.currentPendingQuery = undefined;

          let dataToSendOnSuccess: IQuerySuccessEventArgs = {
            queryBuilder: queryBuilder,
            query: query,
            results: queryResults,
            searchAsYouType: options.searchAsYouType
          };
          this.querySuccessEvent(dataToSendOnSuccess);

          Defer.defer(() => {
            this.deferredQuerySuccessEvent(dataToSendOnSuccess);
            this.hideExecutingQueryAnimation();
          });
          return queryResults;
        }
      })
      .catch((error?: any) => {
        // If our deferred is no longer the current one, then the query
        // has been cancel. We should do nothing here.
        if (promise !== this.currentPendingQuery) {
          return;
        }

        this.logger.error('Query triggered an error', query, error);

        // this.currentPendingQuery.reject(error);
        this.currentPendingQuery = undefined;
        let dataToSendOnError: IQueryErrorEventArgs = {
          queryBuilder: queryBuilder,
          endpoint: endpointToUse,
          query: query,
          error: error,
          searchAsYouType: options.searchAsYouType
        };

        this.lastQuery = query;
        this.lastQueryResults = null;
        this.currentError = error;
        this.queryError(dataToSendOnError);

        this.hideExecutingQueryAnimation();
      });

    let dataToSendDuringQuery: IDuringQueryEventArgs = {
      queryBuilder: queryBuilder,
      query: query,
      searchAsYouType: options.searchAsYouType,
      promise: promise
    };
    this.duringQueryEvent(dataToSendDuringQuery);

    return this.currentPendingQuery;
  }

  /**
   * Using the same parameters as the last successful query, fetch another batch of results. Particularly useful for infinite scrolling, for example.
   * @param count
   * @returns {any}
   */
  public fetchMore(count: number): Promise<IQueryResults> {
    if (this.currentPendingQuery != undefined) {
      return undefined;
    }
    // Send all pending events (think : search as you type)
    // This allows us to get the real search id for the results when the query returns
    this.usageAnalytics.sendAllPendingEvents();

    let queryBuilder = new QueryBuilder();
    this.continueLastQueryBuilder(queryBuilder, count);
    let query = queryBuilder.build();
    let endpointToUse = this.getEndpoint();
    let promise: any = (this.currentPendingQuery = endpointToUse.search(query));
    let dataToSendDuringQuery: IDuringQueryEventArgs = {
      queryBuilder: queryBuilder,
      query: query,
      searchAsYouType: false,
      promise: promise
    };
    $$(this.element).trigger(QueryEvents.duringFetchMoreQuery, dataToSendDuringQuery);
    this.lastQueryBuilder = queryBuilder;
    this.lastQuery = query;
    promise.then((results?: IQueryResults) => {
      // We re-use the search id from the initial search here, even though the
      // server provided us with a new one. 'Fetch mores' are considered to be
      // the same query from an analytics point of view.

      this.currentPendingQuery = undefined;

      if (this.lastQueryResults == null) {
        this.lastQueryResults = results;
      } else {
        _.forEach(results.results, result => {
          this.lastQueryResults.results.push(result);
        });
      }

      let dataToSendOnPreprocessResult: IPreprocessResultsEventArgs = {
        queryBuilder: queryBuilder,
        query: query,
        results: results,
        searchAsYouType: false
      };
      this.preprocessResultsEvent(dataToSendOnPreprocessResult);
      QueryUtils.setIndexAndUidOnQueryResults(query, results, this.getLastSearchUid(), results.pipeline, results.splitTestRun);
      let dataToSendOnFetchMoreSuccess: IFetchMoreSuccessEventArgs = {
        query: query,
        results: results,
        queryBuilder: queryBuilder,
        searchAsYouType: false
      };
      this.fetchMoreSuccessEvent(dataToSendOnFetchMoreSuccess);
    });
    return this.currentPendingQuery;
  }

  /**
   * Cancel any pending query
   */
  public cancelQuery(): void {
    this.cancelAnyCurrentPendingQuery();
    this.hideExecutingQueryAnimation();
  }

  public deferExecuteQuery(options?: IQueryOptions) {
    this.showExecutingQueryAnimation();
    Defer.defer(() => this.executeQuery(options));
  }

  public ensureCreatedQueryBuilder() {
    if (!this.createdOneQueryBuilder) {
      this.createQueryBuilder(new DefaultQueryOptions());
    }
  }

  public createQueryBuilder(options: IQueryOptions): QueryBuilder {
    Assert.exists(options);

    this.createdOneQueryBuilder = true;

    let queryBuilder = new QueryBuilder();

    // Default values, components will probably override them if they exists
    queryBuilder.locale = <string>String['locale'];
    queryBuilder.firstResult = queryBuilder.firstResult || 0;

    // Allow outside code to customize the query builder. We provide two events,
    // to allow someone to have a peep at the query builder after the first phase
    // and add some stuff depending on what was put in there. The facets are using
    // this mechanism to generate query overrides.
    let dataToSendDuringBuildingQuery: IBuildingQueryEventArgs = {
      queryBuilder: queryBuilder,
      searchAsYouType: options.searchAsYouType,
      cancel: options.cancel
    };
    this.buildingQueryEvent(dataToSendDuringBuildingQuery);

    let dataToSendDuringDoneBuildingQuery: IDoneBuildingQueryEventArgs = {
      queryBuilder: queryBuilder,
      searchAsYouType: options.searchAsYouType,
      cancel: options.cancel
    };
    this.doneBuildingQueryEvent(dataToSendDuringDoneBuildingQuery);

    if (dataToSendDuringBuildingQuery.cancel || dataToSendDuringDoneBuildingQuery.cancel) {
      this.cancelQuery();
      return;
    }

    let pipeline = this.getPipelineInUrl();
    if (pipeline) {
      queryBuilder.pipeline = pipeline;
    }

    return queryBuilder;
  }

  public isStandaloneSearchbox(): boolean {
    return Utils.isNonEmptyString(this.options.searchPageUri);
  }

  public saveLastQuery() {
    this.localStorage.save({
      expire: new Date().getTime() + 1000 * 60 * 30, // Psoucy rolled dice and said 30 mins was the magic number
      hash: this.lastQueryHash,
      uid: this.lastSearchUid
    });
  }

  // This field is exposed for components rendered in the results or on-demand which
  // need access to the entire query. For example, the QuickviewDocument need to pass
  // the entire query to the Search API. For other components, QueryStateModel or
  // listening to events like 'doneBuildingQuery' is the way to go.
  public getLastQueryHash(): string {
    if (this.lastQueryHash != null) {
      return this.lastQueryHash;
    }
    this.loadLastQueryHash();
    return this.lastQueryHash || this.queryHash(new QueryBuilder().build());
  }

  private getLastSearchUid(): string {
    if (this.lastSearchUid != null) {
      return this.lastSearchUid;
    }
    this.loadLastQueryHash();
    return this.lastSearchUid;
  }

  private loadLastQueryHash() {
    let lastQuery = this.localStorage.load();
    if (lastQuery != null && new Date().getTime() <= lastQuery.expire) {
      this.lastQueryHash = lastQuery.hash;
      this.lastSearchUid = lastQuery.uid;
      this.localStorage.remove();
    }
  }

  private continueLastQueryBuilder(queryBuilder: QueryBuilder, count: number) {
    _.extend(queryBuilder, this.lastQueryBuilder);
    queryBuilder.firstResult = queryBuilder.firstResult + queryBuilder.numberOfResults;
    queryBuilder.numberOfResults = count;
  }

  private getPipelineInUrl() {
    return QueryUtils.getUrlParameter('pipeline');
  }

  private cancelAnyCurrentPendingQuery() {
    if (Utils.exists(this.currentPendingQuery)) {
      this.logger.debug('Cancelling current pending query');
      Promise.reject('Cancelling current pending query');
      this.currentPendingQuery = undefined;
      return true;
    }
    return false;
  }

  private showExecutingQueryAnimation() {
    if (!this.showingExecutingQueryAnimation) {
      $$(this.element).addClass('coveo-executing-query');
      this.showingExecutingQueryAnimation = true;
    }
  }

  private hideExecutingQueryAnimation() {
    if (this.showingExecutingQueryAnimation) {
      $$(this.element).removeClass('coveo-executing-query');
      this.showingExecutingQueryAnimation = false;
    }
  }

  private keepLastSearchUid(query: IQuery, queryResults: IQueryResults) {
    return this.getLastQueryHash() == this.queryHash(query, queryResults);
  }

  private queryHash(query: IQuery, queryResults?: IQueryResults): string {
    let queryHash = JSON.stringify(_.omit(query, 'firstResult', 'groupBy', 'debug'));
    if (queryResults != null) {
      queryHash += queryResults.pipeline;
    }
    return queryHash;
  }

  private getCallOptions(): IEndpointCallOptions {
    let args: IBuildingCallOptionsEventArgs = {
      options: {
        authentication: []
      }
    };

    $$(this.element).trigger(QueryEvents.buildingCallOptions, args);
    return args.options;
  }

  private newQueryEvent(args) {
    $$(this.element).trigger(QueryEvents.newQuery, args);
  }

  private buildingQueryEvent(args) {
    $$(this.element).trigger(QueryEvents.buildingQuery, args);
  }

  private doneBuildingQueryEvent(args) {
    $$(this.element).trigger(QueryEvents.doneBuildingQuery, args);
  }

  private duringQueryEvent(args) {
    $$(this.element).trigger(QueryEvents.duringQuery, args);
  }

  private querySuccessEvent(args) {
    $$(this.element).trigger(QueryEvents.querySuccess, args);
  }

  private fetchMoreSuccessEvent(args) {
    $$(this.element).trigger(QueryEvents.fetchMoreSuccess, args);
  }

  private deferredQuerySuccessEvent(args) {
    $$(this.element).trigger(QueryEvents.deferredQuerySuccess, args);
  }

  private queryError(args) {
    $$(this.element).trigger(QueryEvents.queryError, args);
  }

  private preprocessResultsEvent(args) {
    $$(this.element).trigger(QueryEvents.preprocessResults, args);
  }

  private noResultEvent(args) {
    $$(this.element).trigger(QueryEvents.noResults, args);
  }

  public debugInfo() {
    let info: any = {
      query: this.lastQuery
    };

    if (this.lastQueryResults != null) {
      info.queryDuration = () => this.buildQueryDurationSection(this.lastQueryResults);
      info.results = () => _.omit(this.lastQueryResults, 'results');
    }

    if (this.currentError != null) {
      info.error = () => this.currentError;
    }

    return info;
  }

  private buildQueryDurationSection(queryResults: IQueryResults) {
    let dom = Dom.createElement('div', { className: 'coveo-debug-queryDuration' });
    let graph = Dom.createElement('div', { className: 'coveo-debug-durations' });
    let debugRef = BaseComponent.getComponentRef('Debug');
    dom.appendChild(graph);
    _.forEach(debugRef.durationKeys, (key: string) => {
      let duration = queryResults[key];
      if (duration != null) {
        graph.appendChild(
          Dom.createElement('div', {
            className: 'coveo-debug-duration',
            style: `width:${duration}px`,
            'data-id': key
          })
        );
        let legend = Dom.createElement('div', { className: 'coveo-debug-duration-legend', 'data-id': key });
        dom.appendChild(legend);
        let keyDom = Dom.createElement('span', { className: 'coveo-debug-duration-label' });
        keyDom.appendChild(document.createTextNode(key));
        legend.appendChild(keyDom);
        let durationDom = Dom.createElement('span', { className: 'coveo-debug-duration-value' });
        durationDom.appendChild(document.createTextNode(duration));
        legend.appendChild(durationDom);
      }
    });
    return dom;
  }

  private logQueryInActionsHistory(query: IQuery, isFirstQuery: boolean) {
    let queryElement: CoveoAnalytics.HistoryQueryElement = {
      name: 'Query',
      value: query.q,
      time: JSON.stringify(new Date())
    };
    this.historyStore.addElement(queryElement);
  }
}
