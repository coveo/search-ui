import {Component} from '../ui/Base/Component';
import {QueryBuilder} from '../ui/Base/QueryBuilder';
import {IQueryResults} from '../rest/QueryResults';
import {IQuery} from '../rest/Query';
import {ISearchEndpoint, IEndpointCallOptions} from '../rest/SearchEndpointInterface';
import {IEndpointError} from '../rest/EndpointError';
import {Promise} from 'es6-promise';

/**
 * Argument sent to all handlers bound on {@link QueryEvents.newQuery}
 */
export interface INewQueryEventArgs {
  /**
   * Determine if the query is a "search as you type"
   */
  searchAsYouType: boolean;
  /**
   * If this property is set to true by any handlers, the query will not be executed.
   */
  cancel: boolean;
  origin?: Component;
}

/**
 * Argument sent to all handlers bound on {@link QueryEvents.buildingQuery}
 */
export interface IBuildingQueryEventArgs {
  /**
   * Allow handlers to modify the query by using the {@link QueryBuilder}
   */
  queryBuilder: QueryBuilder;
  /**
   * Determine if the query is a "search as you type"
   */
  searchAsYouType: boolean;
  /**
   * If this property is set to true by any handlers, the query will not be executed.
   */
  cancel: boolean;
}

/**
 * Argument sent to all handlers bound on {@link QueryEvents.doneBuildingQuery}
 */
export interface IDoneBuildingQueryEventArgs {
  /**
   * Allow handlers to modify the query by using the {@link QueryBuilder}
   */
  queryBuilder: QueryBuilder;
  /**
   * Determine if the query is a "search as you type"
   */
  searchAsYouType: boolean;
  /**
   * If this property is set to true by any handlers, the query will not be executed.
   */
  cancel: boolean;
}

/**
 * Argument sent to all handlers bound on {@link QueryEvents.duringQuery}
 */
export interface IDuringQueryEventArgs {
  /**
   * The {@link QueryBuilder} that was used for the current query
   */
  queryBuilder: QueryBuilder;
  /**
   * The query that was just executed
   */
  query: IQuery;
  /**
   * A promises for the results that will be returned by the search API
   */
  promise: Promise<IQueryResults>;
  /**
   * Determine if the query is a "search as you type"
   */
  searchAsYouType: boolean;
}

/**
 * Argument sent to all handlers bound on {@link QueryEvents.querySuccess}
 */
export interface IQuerySuccessEventArgs {
  /**
   * The query that was just executed
   */
  query: IQuery;
  /**
   * The results returned by the query that was executed
   */
  results: IQueryResults;
  /**
   * The {@link QueryBuilder} that was used for the current query
   */
  queryBuilder: QueryBuilder;
  /**
   * Determine if the query is a "search as you type"
   */
  searchAsYouType: boolean;
}

/**
 * Argument sent to all handlers bound on {@link QueryEvents.fetchMoreSuccess}
 */
export interface IFetchMoreSuccessEventArgs {
  /**
   * The query that was just executed
   */
  query: IQuery;
  /**
   * The results returned by the query that was executed
   */
  results: IQueryResults;
  /**
   * The {@link QueryBuilder} that was used for the current query
   */
  queryBuilder: QueryBuilder;
  /**
   * Determine if the query is a "search as you type"
   */
  searchAsYouType: boolean;
}

/**
 * Argument sent to all handlers bound on {@link QueryEvents.queryError}
 */
export interface IQueryErrorEventArgs {
  /**
   * The {@link QueryBuilder} that was used for the current query
   */
  queryBuilder: QueryBuilder;
  /**
   * The endpoint on which the error happened.
   */
  endpoint: ISearchEndpoint;
  /**
   * The query that was just executed
   */
  query: IQuery;
  /**
   * The error info / message itself.
   */
  error: IEndpointError;
  /**
   * Determine if the query is a "search as you type"
   */
  searchAsYouType: boolean;
}

/**
 * Argument sent to all handlers bound on {@link QueryEvents.preprocessResults}
 */
export interface IPreprocessResultsEventArgs {
  /**
   * The {@link QueryBuilder} that was used for the current query
   */
  queryBuilder: QueryBuilder;
  /**
   * The query that was just executed
   */
  query: IQuery;
  /**
   * The results returned by the query that was executed
   */
  results: IQueryResults;
  /**
   * Determine if the query is a "search as you type"
   */
  searchAsYouType: boolean;
}

/**
 * Argument sent to all handlers bound on {@link QueryEvents.preprocessMoreResults}
 */
export interface IPreprocessMoreResultsEventArgs {
  /**
   * The results returned by the query that was executed
   */
  results: IQueryResults;
}

/**
 * Argument sent to all handlers bound on {@link QueryEvents.noResults}
 */
export interface INoResultsEventArgs {
  /**
   * The {@link QueryBuilder} that was used for the current query
   */
  queryBuilder: QueryBuilder;
  /**
   * The query that was just executed
   */
  query: IQuery;
  /**
   * The results returned by the query that was executed
   */
  results: IQueryResults;
  /**
   * Determine if the query is a "search as you type"
   */
  searchAsYouType: boolean;
  /**
   * If set to true by any handler, the last query will automatically be re-executed again.
   */
  retryTheQuery: boolean;
}

export interface IBuildingCallOptionsEventArgs {
  options: IEndpointCallOptions;
}

/**
 * This static class is there to contains the different string definition for all the events related to query.
 *
 * Note that these events will only be triggered when the {@link QueryController.executeQuery} method is used, either directly or by using {@link executeQuery}
 */
export class QueryEvents {
  /**
   * Triggered when a new query is launched.
   *
   * All handlers bound will receive {@link INewQueryEventArgs} as an argument
   * @type {string}
   */
  public static newQuery = 'newQuery';
  /**
   * Triggered when the query is being built.
   *
   * This is typically where all components will contribute their part to the {@link IQuery} using the {@link QueryBuilder}
   *
   * All handlers bound will receive {@link IBuildingQueryEventArgs} as an argument
   * @type {string}
   */
  public static buildingQuery = 'buildingQuery';
  /**
   * Triggered when the query is done being built.
   *
   * This is typically where the facet will add their {@link IGroupByRequest} to the {@link IQuery}.
   *
   * All handlers bound will receive {@link IDoneBuildingQueryEventArgs} as an argument
   * @type {string}
   */
  public static doneBuildingQuery = 'doneBuildingQuery';
  /**
   * Triggered when the query is being executed on the search API.
   *
   * All handlers bound will receive {@link IDuringQueryEventArgs} as an argument
   * @type {string}
   */
  public static duringQuery = 'duringQuery';
  /**
   * Triggered when more results is being fetched on the search API (think : Infinite scrolling, or pager).
   *
   * All handlers bound will receive {@link IDuringQueryEventArgs} as an argument
   * @type {string}
   */
  public static duringFetchMoreQuery = 'duringFetchMoreQuery';
  /**
   * Triggered when a query successfully return from the search API.
   *
   * All handlers bound will receive {@link IQuerySuccessEventArgs} as an argument
   * @type {string}
   */
  public static querySuccess = 'querySuccess';
  /**
   * Triggered when a more results were successfully returned from the search API. (think : Infinite scrolling, or page).
   *
   * All handlers bound will receive {@link IFetchMoreSuccessEventArgs} as an argument
   * @type {string}
   */
  public static fetchMoreSuccess = 'fetchMoreSuccess';
  /**
   * Triggered after the main query success event has finished executing.
   *
   * This is typically where facet will process the {@link IGroupByResult} and render themselves.
   *
   * All handlers bound will receive {@link IQuerySuccessEventArgs} as an argument
   * @type {string}
   */
  public static deferredQuerySuccess = 'deferredQuerySuccess';
  /**
   * Triggered when there was an error executing a query on the search API.
   *
   * All handlers bound will receive {@link IQueryErrorEventArgs} as an argument
   * @type {string}
   */
  public static queryError = 'queryError';
  /**
   * Triggered before the {@link QueryEvents.querySuccess} event.
   *
   * This allow external code to modify the results before rendering them.
   *
   * For example, the {@link Folding} component might use this event to construct a coherent parent child relationship between query results.
   *
   * All handlers bound will receive {@link IPreprocessResultsEventArgs} as an argument
   * @type {string}
   */
  public static preprocessResults = 'preprocessResults';
  /**
   * Triggered before the {@link QueryEvents.fetchMoreSuccess} event.
   *
   * This allow external code to modify the results before rendering them.
   *
   * For example, the {@link Folding} component might use this event to construct a coherent parent child relationship between query results.
   *
   * All handlers bound will receive {@link IPreprocessResultsEventArgs} as an argument
   * @type {string}
   */
  public static preprocessMoreResults = 'preprocessMoreResults';
  /**
   * Triggered when there is no results for a particular query.
   *
   * All handlers bound will receive {@link INoResultsEventArgs} as an argument
   * @type {string}
   */
  public static noResults = 'noResults';
  public static buildingCallOptions = 'buildingCallOptions';
}
