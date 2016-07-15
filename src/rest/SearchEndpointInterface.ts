import {IEndpointCallerOptions} from '../rest/EndpointCaller';
import {IStringMap} from '../rest/GenericParam';
import {IQuery} from '../rest/Query';
import {IQueryResults} from '../rest/QueryResults';
import {IQueryResult} from '../rest/QueryResult';
import {IIndexFieldValue} from '../rest/FieldValue';
import {IListFieldValuesRequest} from '../rest/ListFieldValuesRequest';
import {IFieldDescription} from '../rest/FieldDescription';
import {IExtension} from '../rest/Extension';
import {IEndpointError} from '../rest/EndpointError';
import {ITaggingRequest} from '../rest/TaggingRequest';
import {IRevealQuerySuggestRequest, IRevealQuerySuggestResponse} from '../rest/RevealQuerySuggest';
import {IRatingRequest} from '../rest/RatingRequest';
import {ISubscriptionRequest, ISubscription} from '../rest/Subscription';
import {Promise} from 'es6-promise';

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
 * Available options when calling against the {@link SearchEndpoint} to get a document
 */
export interface IGetDocumentOptions extends IEndpointCallOptions {
}

/**
 * Available options when calling against the {@link SearchEndpoint} to view a document as an HTMLElement (quickview basically...)
 */
export interface IViewAsHtmlOptions extends IEndpointCallOptions {
  query?: string;
  queryObject?: IQuery;
  requestedOutputSize?: number;
  contentType?: string;
}

export interface ISearchEndpoint {
  options: ISearchEndpointOptions;
  getBaseUri(): string;
  getBaseAlertsUri(): string;
  getAuthenticationProviderUri(provider: string, returnUri: string, message: string): string;
  isJsonp(): boolean;
  search(query: IQuery, callOptions?: IEndpointCallOptions): Promise<IQueryResults>;
  getExportToExcelLink(query: IQuery, numberOfResults: number, callOptions?: IEndpointCallOptions): string;
  getRawDataStream(documentUniqueId: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions): Promise<ArrayBuffer>;
  getDocument(documentUniqueID: string, callOptions?: IGetDocumentOptions): Promise<IQueryResult>;
  getDocumentText(documentUniqueID: string, callOptions?: IEndpointCallOptions): Promise<string>;
  getDocumentHtml(documentUniqueID: string, callOptions?: IViewAsHtmlOptions): Promise<HTMLDocument>;
  getViewAsHtmlUri(documentUniqueID: string, callOptions?: IViewAsHtmlOptions): string;
  getViewAsDatastreamUri(documentUniqueID: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions): string;
  listFieldValues(request: IListFieldValuesRequest, callOptions?: IEndpointCallOptions): Promise<IIndexFieldValue[]>;
  listFields(callOptions?: IEndpointCallOptions): Promise<IFieldDescription[]>;
  extensions(callOptions?: IEndpointCallOptions): Promise<IExtension[]> | Promise<IEndpointError>;
  tagDocument(taggingRequest: ITaggingRequest, callOptions?: IEndpointCallOptions): Promise<boolean>;
  getRevealQuerySuggest(request: IRevealQuerySuggestRequest, callOptions?: IEndpointCallOptions): Promise<IRevealQuerySuggestResponse>;
  rateDocument(ratingRequest: IRatingRequest, callOptions?: IEndpointCallOptions): Promise<boolean>;
  follow(request: ISubscriptionRequest): Promise<ISubscription>;
  listSubscriptions(page?: number): Promise<ISubscription[]>;
  updateSubscription(subscription: ISubscription): Promise<ISubscription>;
  deleteSubscription(subscription: ISubscription): Promise<ISubscription>;
}
