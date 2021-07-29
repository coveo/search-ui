import { IEndpointCallerOptions } from '../rest/EndpointCaller';
import { IStringMap } from '../rest/GenericParam';
import { IQuery } from '../rest/Query';
import { IQueryResults } from '../rest/QueryResults';
import { IQueryResult } from '../rest/QueryResult';
import { IIndexFieldValue } from '../rest/FieldValue';
import { IListFieldValuesRequest, IListFieldValuesBatchRequest } from '../rest/ListFieldValuesRequest';
import { IFieldDescription } from '../rest/FieldDescription';
import { IExtension } from '../rest/Extension';
import { IEndpointError } from '../rest/EndpointError';
import { ITaggingRequest } from '../rest/TaggingRequest';
import { IQuerySuggestRequest, IQuerySuggestResponse } from '../rest/QuerySuggest';
import { IRatingRequest } from '../rest/RatingRequest';
import { ISubscriptionRequest, ISubscription } from '../rest/Subscription';
import { ISentryLog } from './SentryLog';
import { IFacetSearchRequest } from './Facet/FacetSearchRequest';
import { IFacetSearchResponse } from './Facet/FacetSearchResponse';
import { ExecutionPlan } from './Plan';
import { AccessToken } from './AccessToken';

/**
 * The possible options when creating a {@link SearchEndpoint}
 */
export interface ISearchEndpointOptions extends IEndpointCallerOptions {
  /**
   * The uri for the search endpoint. eg: cloudplatform.coveo.com/rest/search
   */
  restUri?: string;
  version?: string;
  /**
   * Query string arguments to add to every request to the search endpoint.<br/>
   * eg : {'foo':'bar', 'a':'b'}
   */
  queryStringArguments?: IStringMap<any>;
  /**
   * Specifies that the request (and the Coveo Search API) does not need any kind of authentication.<br/>
   * This flag is only needed for specific setups when your requests are being blocked by your browser. If your queries are executing correctly, you do not need to bother.<br/>
   * Setting this flag will prevent the withCredentials option to be set on the XMLHttpRequest, allowing performing cross-domain requests on a server that returns * in the Access-Control-Allow-Origin HTTP header.
   */
  anonymous?: boolean;
  /**
   * This allows using an OAuth2 or a search token to authenticate against the Search API.
   */
  accessToken?: string;
  /**
   * Specifies a function that, when called, will arrange for a new search token to be generated.<br/>
   * It is expected to return a Promise that should be resolved with the new token once it's available.
   */
  renewAccessToken?: () => Promise<string>;
  /**
   * This is the username part of the credentials used to authenticate with the Search API using Basic Authentication.<br/>
   * This option should only be used for development purposes. Including secret credentials in an HTML page that is sent to a client browser is not secure.
   */
  username?: string;
  /**
   * This is the password part of the credentials used to authenticate with the REST API.<br/>
   * This option should only be used for development purposes. Including secret credentials in an HTML page that is sent to a client browser is not secure.
   */
  password?: string;
  /**
   * The uri for the Coveo search alerts service. If not specified, will automatically resolve using the restUri otherwise
   */
  searchAlertsUri?: string;
  isGuestUser?: boolean;
}

/**
 * Available options when calling against the {@link SearchEndpoint}
 */
export interface IEndpointCallOptions {
  authentication?: string[];
}

/**
 * The `IGetDocumentOptions` interface describes the available options when calling against a
 * [`SearchEndpoint`]{@link SearchEndpoint} to get an item.
 */
export interface IGetDocumentOptions extends IEndpointCallOptions {}

/**
 * The `IViewAsHtmlOptions` interface describes the available options when calling against a
 * [`SearchEndpoint`]{@link SearchEndpoint} to view an item as an HTMLElement (think: quickview).
 */
export interface IViewAsHtmlOptions extends IEndpointCallOptions {
  query?: string;
  queryObject?: IQuery;
  requestedOutputSize?: number;
  contentType?: string;
}

export interface ISearchEndpoint {
  accessToken: AccessToken;
  options?: ISearchEndpointOptions;
  getBaseUri(): string;
  getBaseAlertsUri(): string;
  getAuthenticationProviderUri(provider: string, returnUri: string, message: string): string;
  exchangeAuthenticationProviderToken(token: string): Promise<string>;
  isJsonp(): boolean;
  search(query: IQuery, callOptions?: IEndpointCallOptions): Promise<IQueryResults>;
  fetchBinary(query: IQuery, callOptions?: IEndpointCallOptions): Promise<ArrayBuffer>;
  plan(query: IQuery, callOptions?: IEndpointCallOptions): Promise<ExecutionPlan>;
  /** @deprecated getExportToExcelLink does not factor in all query parameters (e.g. dynamic facets) due to GET request url length limitations.
   * Please use `fetchBinary` instead to ensure all query parameters are used.
   * */
  getExportToExcelLink(query: IQuery, numberOfResults: number, callOptions?: IEndpointCallOptions): string;
  getRawDataStream(documentUniqueId: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions): Promise<ArrayBuffer>;
  getDocument(documentUniqueID: string, callOptions?: IGetDocumentOptions): Promise<IQueryResult>;
  getDocumentText(documentUniqueID: string, callOptions?: IEndpointCallOptions): Promise<string>;
  getDocumentHtml(documentUniqueID: string, callOptions?: IViewAsHtmlOptions): Promise<HTMLDocument>;
  getViewAsHtmlUri(documentUniqueID: string, callOptions?: IViewAsHtmlOptions): string;
  getViewAsDatastreamUri(documentUniqueID: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions): string;
  listFieldValuesBatch(request: IListFieldValuesBatchRequest, callOptions?: IEndpointCallOptions): Promise<IIndexFieldValue[][]>;
  listFieldValues(request: IListFieldValuesRequest, callOptions?: IEndpointCallOptions): Promise<IIndexFieldValue[]>;
  listFields(callOptions?: IEndpointCallOptions): Promise<IFieldDescription[]>;
  extensions(callOptions?: IEndpointCallOptions): Promise<IExtension[]> | Promise<IEndpointError>;
  tagDocument(taggingRequest: ITaggingRequest, callOptions?: IEndpointCallOptions): Promise<boolean>;
  getQuerySuggest(request: IQuerySuggestRequest, callOptions?: IEndpointCallOptions): Promise<IQuerySuggestResponse>;
  facetSearch(request: IFacetSearchRequest, callOptions?: IEndpointCallOptions): Promise<IFacetSearchResponse>;
  rateDocument(ratingRequest: IRatingRequest, callOptions?: IEndpointCallOptions): Promise<boolean>;
  follow(request: ISubscriptionRequest): Promise<ISubscription>;
  listSubscriptions(page?: number, callOptions?: IEndpointCallOptions): Promise<ISubscription[]>;
  updateSubscription(subscription: ISubscription): Promise<ISubscription>;
  deleteSubscription(subscription: ISubscription): Promise<ISubscription>;
  logError(sentryLog: ISentryLog): Promise<boolean>;
}
