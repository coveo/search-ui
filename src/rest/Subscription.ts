import {IQuery} from './Query';

export const SUBSCRIPTION_TYPE = {
  followQuery: 'followQuery',
  followDocument: 'followDocument',
}

export interface ISearchAlertsEndpointOptions {
  restUri: string;
  accessToken?: string;
  errorsAsSuccess?: boolean;
}

export interface ISearchAlertsEndpointCallOptions {
  type?: string;
  page?: number;
}

export interface ISearchAlertsEndpointSearchCallOptions {
  documentIds: string[];
}

/**
 * Describe a subscription to the Coveo Search alerts service
 */
export interface ISubscription extends ISubscriptionRequest {
  /**
   * The id of the subscription
   */
  id: string;

  /**
   * The user associated with the subscription
   */
  user: ISubscriptionUser;
}

/**
 * Describe a user associated with a subscription to the Coveo Search alerts service
 */
export interface ISubscriptionUser {

  /**
   * The email of the user
   */
  email: string;

  /**
   * The token used to manage the alerts via email.
   */
  manageToken: string;
}

/**
 * Describe a request to subscribe to the Coveo Search alerts service
 */
export interface ISubscriptionRequest {
  /**
   * Type of subscription.<br/>
   * Can be 'followQuery' or 'followDocument'
   */
  type: string;
  /**
   * Config of the subscription
   */
  typeConfig: ISubscriptionQueryRequest | ISubscriptionItemRequest;
  /**
   * Frequency of the alerts
   */
  frequency?: string;
}

/**
 * Describe a subscription to a single query
 */
export interface ISubscriptionQueryRequest {
  /**
   * Query to subscribe to
   */
  query: IQuery;
  /**
   * Which field on the result set represent the modification date for which you wish to receive alerts
   */
  modifiedDateField?: string;
}

/**
 * Describe a subscription to a single item (a result)
 */
export interface ISubscriptionItemRequest {
  /**
   * Unique id of the document
   */
  id: string,
  /**
   * Title of the document
   */
  title: string,
  /**
   * Which field on the result represent the modification date for which you wish to receive alerts
   */
  modifiedDateField?: string;
  /**
   * A list of field to monitor on the given document
   */
  watchedFields?: string[];
}
