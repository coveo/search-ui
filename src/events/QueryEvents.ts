import {Component} from '../ui/Base/Component';
import {QueryBuilder} from '../ui/Base/QueryBuilder';
import {IQueryResults} from '../rest/QueryResults';
import {IQuery} from '../rest/Query';
import {ISearchEndpoint, IEndpointCallOptions} from '../rest/SearchEndpointInterface';
import {IEndpointError} from '../rest/EndpointError';
import {Promise} from 'es6-promise';

export interface INewQueryEventArgs {
  searchAsYouType: boolean;
  cancel: boolean;
  origin?: Component;
}

export interface IBuildingQueryEventArgs {
  queryBuilder: QueryBuilder;
  searchAsYouType: boolean;
  cancel: boolean;
}

export interface IDoneBuildingQueryEventArgs {
  queryBuilder: QueryBuilder;
  searchAsYouType: boolean;
  cancel: boolean;
}

export interface IDuringQueryEventArgs {
  queryBuilder: QueryBuilder;
  query: IQuery;
  promise: Promise<IQueryResults>;
  searchAsYouType: boolean;
}

export interface IQuerySuccessEventArgs {
  query: IQuery;
  results: IQueryResults;
  queryBuilder: QueryBuilder;
  searchAsYouType: boolean;
}

export interface IFetchMoreSuccessEventArgs {
  query: IQuery;
  results: IQueryResults;
  queryBuilder: QueryBuilder;
  searchAsYouType: boolean;
}

export interface IQueryErrorEventArgs {
  queryBuilder: QueryBuilder;
  endpoint: ISearchEndpoint;
  query: IQuery;
  error: IEndpointError;
  searchAsYouType: boolean;
}

export interface IPreprocessResultsEventArgs {
  queryBuilder: QueryBuilder;
  query: IQuery;
  results: IQueryResults;
  searchAsYouType: boolean;
}

export interface IPreprocessMoreResultsEventArgs {
  results: IQueryResults;
}

export interface INoResultsEventArgs {
  queryBuilder: QueryBuilder;
  query: IQuery;
  results: IQueryResults;
  searchAsYouType: boolean;
  retryTheQuery: boolean;
}

export interface IBuildingCallOptionsEventArgs {
  options: IEndpointCallOptions;
}

export class QueryEvents {
  public static newQuery = 'newQuery';
  public static buildingQuery = 'buildingQuery';
  public static doneBuildingQuery = 'doneBuildingQuery';
  public static duringQuery = 'duringQuery';
  public static duringFetchMoreQuery = 'duringFetchMoreQuery';
  public static querySuccess = 'querySuccess';
  public static fetchMoreSuccess = 'fetchMoreSuccess';
  public static deferredQuerySuccess = 'deferredQuerySuccess';
  public static queryError = 'queryError';
  public static preprocessResults = 'preprocessResults';
  public static preprocessMoreResults = 'preprocessMoreResults';
  public static noResults = 'noResults';
  public static buildingCallOptions = 'buildingCallOptions';
}
