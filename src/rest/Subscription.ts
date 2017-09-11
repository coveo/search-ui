import { IQuery } from './Query';

export const SUBSCRIPTION_TYPE = {
  followQuery: 'followQuery',
  followDocument: 'followDocument'
};

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
  /**
   * The name that should be used by the API to identify this subscription
   */
  name: string;
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
 * The `ISubscriptionItemRequest` interface describes a subscription to a single item (a result).
 */
export interface ISubscriptionItemRequest {
  /**
   * Contains the unique ID of the item to subscribe to.
   */
  id: string;

  /**
   * Contains the title of the item to subscribe to.
   */
  title: string;

  /**
   * Indicates which field contains the modification date of the item to subscribe to.
   */
  modifiedDateField?: string;

  /**
   * Contains a list of fields to monitor for the item to subscribe to.
   */
  watchedFields?: string[];
}
