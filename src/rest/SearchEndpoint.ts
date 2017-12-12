import { ISearchEndpointOptions, ISearchEndpoint, IViewAsHtmlOptions } from './SearchEndpointInterface';
import { EndpointCaller, IEndpointCallParameters, ISuccessResponse, IErrorResponse, IRequestInfo } from '../rest/EndpointCaller';
import { IEndpointCallOptions } from '../rest/SearchEndpointInterface';
import { IStringMap } from './GenericParam';
import { Logger } from '../misc/Logger';
import { Assert } from '../misc/Assert';
import { IQuery } from '../rest/Query';
import { IQueryResults } from '../rest/QueryResults';
import { IQueryResult } from '../rest/QueryResult';
import { version } from '../misc/Version';
import { IListFieldValuesRequest } from '../rest/ListFieldValuesRequest';
import { IIndexFieldValue } from '../rest/FieldValue';
import { IFieldDescription } from '../rest/FieldDescription';
import { IListFieldsResult } from '../rest/ListFieldsResult';
import { IExtension } from '../rest/Extension';
import { IRatingRequest } from '../rest/RatingRequest';
import { ITaggingRequest } from '../rest/TaggingRequest';
import { IQuerySuggestRequest, IQuerySuggestResponse } from '../rest/QuerySuggest';
import { ISentryLog } from './SentryLog';
import { ISubscriptionRequest, ISubscription } from '../rest/Subscription';
import { AjaxError } from '../rest/AjaxError';
import { MissingAuthenticationError } from '../rest/MissingAuthenticationError';
import { QueryUtils } from '../utils/QueryUtils';
import { QueryError } from '../rest/QueryError';
import { Utils } from '../utils/Utils';
import * as _ from 'underscore';
import { shim } from '../misc/PromisesShim';
import { history } from 'coveo.analytics';
import { Cookie } from '../utils/CookieUtils';
import { TimeSpan } from '../UtilsModules';
shim();

export class DefaultSearchEndpointOptions implements ISearchEndpointOptions {
  restUri: string;
  version: string = 'v2';
  queryStringArguments: IStringMap<string> = {};
  anonymous: boolean = false;
  accessToken: string;
  renewAccessToken: () => Promise<string>;
  username: string;
  password: string;
  searchAlertsUri: string;
  isGuestUser: boolean = false;
}

/**
 * The `SearchEndpoint` class allows you to execute various actions against the Coveo Search API and a Coveo index
 * (e.g., searching, listing field values, getting the quickview content of an item, etc.).
 *
 * This class does trigger any query events directly. Consequently, executing an action with this class does not trigger
 * a full query cycle for the Coveo components.
 *
 * If you wish to have all Coveo components "react" to a query, (and trigger the corresponding query events), use the
 * [`QueryController`]{@link QueryController} class instead.
 */
export class SearchEndpoint implements ISearchEndpoint {
  /**
   * Contains a map of all initialized `SearchEndpoint` instances.
   *
   * **Example:**
   * > `Coveo.SearchEndpoint.endpoints['default']` returns the default endpoint that was created at initialization.
   * @type {{}}
   */
  static endpoints: { [endpoint: string]: SearchEndpoint } = {};

  /**
   * Configures a sample search endpoint on a Coveo Cloud index containing a set of public sources with no secured
   * content.
   *
   * **Note:**
   * > This method mainly exists for demo purposes and ease of setup.
   *
   * @param otherOptions A set of additional options to use when configuring this endpoint.
   */
  static configureSampleEndpoint(otherOptions?: ISearchEndpointOptions) {
    if (SearchEndpoint.isUseLocalArgumentPresent()) {
      // This is a handy flag to quickly test a local search API and alerts
      SearchEndpoint.endpoints['default'] = new SearchEndpoint(
        _.extend(
          {
            restUri: 'http://localhost:8100/rest/search',
            searchAlertsUri: 'http://localhost:8088/rest/search/alerts/'
          },
          otherOptions
        )
      );
    } else {
      // This OAuth token points to the organization used for samples.
      // It contains a set of harmless content sources.
      SearchEndpoint.endpoints['default'] = new SearchEndpoint(
        _.extend(
          {
            restUri: 'https://cloudplatform.coveo.com/rest/search',
            accessToken: '52d806a2-0f64-4390-a3f2-e0f41a4a73ec'
          },
          otherOptions
        )
      );
    }
  }

  /**
   * Configures a sample search endpoint on a Coveo Cloud V2 index containing a set of public sources with no secured
   * content.
   *
   * **Note:**
   * > This method mainly exists for demo purposes and ease of setup.
   *
   * @param otherOptions A set of additional options to use when configuring this endpoint.
   */
  static configureSampleEndpointV2(optionsOPtions?: ISearchEndpointOptions) {
    SearchEndpoint.endpoints['default'] = new SearchEndpoint(
      _.extend({
        restUri: 'https://platform.cloud.coveo.com/rest/search',
        accessToken: 'xx564559b1-0045-48e1-953c-3addd1ee4457',
        queryStringArguments: {
          organizationId: 'searchuisamples',
          viewAllContent: 1
        }
      })
    );
  }

  /**
   * Configures a search endpoint on a Coveo Cloud index.
   * @param organization The organization ID of your Coveo Cloud index.
   * @param token The token to use to execute query. If not specified, you will likely need to login when querying.
   * @param uri The URI of the Coveo Cloud REST Search API. By default, this points to the production environment.
   * @param otherOptions A set of additional options to use when configuring this endpoint.
   */
  static configureCloudEndpoint(
    organization?: string,
    token?: string,
    uri: string = 'https://cloudplatform.coveo.com/rest/search',
    otherOptions?: ISearchEndpointOptions
  ) {
    let options: ISearchEndpointOptions = {
      restUri: uri,
      accessToken: token,
      queryStringArguments: { organizationId: organization }
    };

    let merged = SearchEndpoint.mergeConfigOptions(options, otherOptions);

    SearchEndpoint.endpoints['default'] = new SearchEndpoint(SearchEndpoint.removeUndefinedConfigOption(merged));
  }

  /**
   * Configures a search endpoint on a Coveo Cloud V2 index.
   * @param organization The organization ID of your Coveo Cloud V2 index.
   * @param token The token to use to execute query. If not specified, you will likely need to login when querying.
   * @param uri The URI of the Coveo Cloud REST Search API. By default, this points to the production environment.
   * @param otherOptions A set of additional options to use when configuring this endpoint.
   */
  static configureCloudV2Endpoint(
    organization?: string,
    token?: string,
    uri: string = 'https://platform.cloud.coveo.com/rest/search',
    otherOptions?: ISearchEndpointOptions
  ) {
    return SearchEndpoint.configureCloudEndpoint(organization, token, uri, otherOptions);
  }

  /**
   * Configures a search endpoint on a Coveo on-premise index.
   * @param uri The URI of your Coveo Search API endpoint (e.g., `http://myserver:8080/rest/search`)
   * @param token The token to use to execute query. If not specified, you will likely need to login when querying
   * (unless your Coveo Search API endpoint is configured using advanced auth options, such as Windows auth or claims).
   * @param otherOptions A set of additional options to use when configuring this endpoint.
   */
  static configureOnPremiseEndpoint(uri: string, token?: string, otherOptions?: ISearchEndpointOptions) {
    let merged = SearchEndpoint.mergeConfigOptions(
      {
        restUri: uri,
        accessToken: token
      },
      otherOptions
    );

    SearchEndpoint.endpoints['default'] = new SearchEndpoint(SearchEndpoint.removeUndefinedConfigOption(merged));
  }

  static removeUndefinedConfigOption(config: ISearchEndpointOptions) {
    _.each(_.keys(config), key => {
      if (config[key] == undefined) {
        delete config[key];
      }
    });
    return config;
  }

  static mergeConfigOptions(first: ISearchEndpointOptions, second: ISearchEndpointOptions): ISearchEndpointOptions {
    first = SearchEndpoint.removeUndefinedConfigOption(first);
    second = SearchEndpoint.removeUndefinedConfigOption(second);
    return _.extend({}, first, second);
  }

  public logger: Logger;
  public isRedirecting: boolean;
  protected caller: EndpointCaller;
  private onUnload: (...args: any[]) => void;

  /**
   * Creates a new `SearchEndpoint` instance.
   * Uses a set of adequate default options, and merges these with the `options` parameter.
   * Also creates an [`EndpointCaller`]{@link EndpointCaller} instance and uses it to communicate with the endpoint
   * internally.
   * @param options The custom options to apply to the new `SearchEndpoint`.
   */
  constructor(public options?: ISearchEndpointOptions) {
    Assert.exists(options);
    Assert.exists(options.restUri);

    // For backward compatibility, we set anonymous to true when an access token
    // is specified on a page loaded through the filesystem. This causes withCredentials
    // to NOT be set, allowing those pages to work with non Windows/Basic/Cookie
    // authentication. If anonymous is explicitly set to false, we'll use withCredentials.
    let defaultOptions = new DefaultSearchEndpointOptions();
    defaultOptions.anonymous = window.location.href.indexOf('file://') == 0 && Utils.isNonEmptyString(options.accessToken);
    this.options = <ISearchEndpointOptions>_.extend({}, defaultOptions, options);

    // Forward any debug=1 query argument to the REST API to ease debugging
    if (SearchEndpoint.isDebugArgumentPresent()) {
      this.options.queryStringArguments['debug'] = 1;
    }
    this.onUnload = () => {
      this.handleUnload();
    };
    window.addEventListener('beforeunload', this.onUnload);
    this.logger = new Logger(this);
    this.createEndpointCaller();
  }

  public reset() {
    this.createEndpointCaller();
  }

  /**
   * Sets a function which allows external code to modify all endpoint call parameters before the browser sends them.
   *
   * **Note:**
   * > This is useful in very specific scenarios where the network infrastructure requires special request headers to be
   * > added or removed, for example.
   * @param requestModifier The function.
   */
  public setRequestModifier(requestModifier: (params: IRequestInfo<any>) => IRequestInfo<any>) {
    this.caller.options.requestModifier = requestModifier;
  }

  /**
   * Gets the base URI of the Search API endpoint.
   * @returns {string} The base URI of the Search API endpoint.
   */
  public getBaseUri(): string {
    return this.buildBaseUri('');
  }

  /**
   * Gets the base URI of the search alerts endpoint.
   * @returns {string} The base URI of the search alerts endpoint.
   */
  public getBaseAlertsUri(): string {
    return this.buildSearchAlertsUri('');
  }

  /**
   * Gets the URI that can be used to authenticate against the given provider.
   * @param provider The provider name.
   * @param returnUri The URI to return to after the authentication is completed.
   * @param message The authentication message.
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {string} The authentication provider URI.
   */
  @path('/login/')
  @accessTokenInUrl()
  public getAuthenticationProviderUri(
    provider: string,
    returnUri?: string,
    message?: string,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): string {
    let queryString = this.buildBaseQueryString(callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    callParams.url += provider + '?';

    if (Utils.isNonEmptyString(returnUri)) {
      callParams.url += 'redirectUri=' + Utils.safeEncodeURIComponent(returnUri) + '&';
    } else if (Utils.isNonEmptyString(message)) {
      callParams.url += 'message=' + Utils.safeEncodeURIComponent(message) + '&';
    }
    callParams.url += callParams.queryString.join('&');
    return callParams.url;
  }

  /**
   * Indicates whether the search endpoint is using JSONP internally to communicate with the Search API.
   * @returns {boolean} `true` in the search enpoint is using JSONP; `false` otherwise.
   */
  public isJsonp(): boolean {
    return this.caller.useJsonp;
  }

  /**
   * Performs a search on the index and returns a Promise of [`IQueryResults`]{@link IQueryResults}.
   *
   * This method slightly modifies the query results by adding additional information to each result (id, state object,
   * etc.).
   * @param query The query to execute. Typically, the query object is built using a
   * [`QueryBuilder`]{@link QueryBuilder}.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<IQueryResults>} A Promise of query results.
   */
  @path('/')
  @method('POST')
  @responseType('text')
  @includeActionsHistory()
  @includeReferrer()
  @includeVisitorId()
  @includeIsGuestUser()
  public search(query: IQuery, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IQueryResults> {
    Assert.exists(query);

    callParams.requestData = _.extend({}, callParams.requestData, _.omit(query, queryParam => Utils.isNullOrUndefined(queryParam)));

    this.logger.info('Performing REST query', query);

    const start = new Date();

    return this.performOneCall<IQueryResults>(callParams, callOptions).then(results => {
      this.logger.info('REST query successful', results, query);

      // Version check
      // If the SearchAPI doesn't give us any apiVersion info, we assume version 1 (before apiVersion was implemented)
      if (results.apiVersion == null) {
        results.apiVersion = 1;
      }
      if (results.apiVersion < version.supportedApiVersion) {
        this.logger.error('Please update your REST Search API');
      }

      // Transform the duration compared to what the search API returns
      // We want to have the "duration" to be the time as seen by the browser
      results.searchAPIDuration = results.duration;
      results.duration = TimeSpan.fromDates(start, new Date()).getMilliseconds();

      // If the server specified no search ID generated one using the client-side
      // GUID generator. We prefer server generated guids to allow tracking a query
      // all the way from the analytics to the logs.
      if (Utils.isNullOrEmptyString(results.searchUid)) {
        results.searchUid = QueryUtils.createGuid();
      }
      QueryUtils.setIndexAndUidOnQueryResults(query, results, results.searchUid, results.pipeline, results.splitTestRun);
      QueryUtils.setTermsToHighlightOnQueryResults(query, results);
      return results;
    });
  }
  /**
   * Gets a link / URI to download a query result set to the XLSX format.
   *
   * **Note:**
   * > This method does not automatically download the query result set, but rather provides an URI from which to
   * > download it.
   * @param query The query for which to get the XLSX result set.
   * @param numberOfResults The number of results to download.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {string} The download URI.
   */
  @path('/')
  @accessTokenInUrl()
  public getExportToExcelLink(
    query: IQuery,
    numberOfResults: number,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): string {
    let queryString = this.buildBaseQueryString(callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    queryString = this.buildCompleteQueryString(null, query);
    callParams.queryString = callParams.queryString.concat(queryString);

    if (numberOfResults != null) {
      callParams.queryString.push('numberOfResults=' + numberOfResults);
    }

    callParams.queryString.push('format=xlsx');

    return callParams.url + '?' + callParams.queryString.join('&');
  }

  /**
   * Gets the raw datastream for an item. This is typically used to get a thumbnail for an item.
   *
   * Returns an array buffer.
   *
   * **Example:**
   * ```
   * let rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));
   * img.setAttribute('src', 'data:image/png;base64,' + btoa(rawBinary));
   * ```
   * @param documentUniqueId Typically, the {@link IQueryResult.uniqueId} on each result.
   * @param dataStreamType Normally, `$Thumbnail`.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<TResult>|Promise<U>}
   */
  @path('/datastream')
  @accessTokenInUrl()
  @method('GET')
  @responseType('arraybuffer')
  public getRawDataStream(
    documentUniqueId: string,
    dataStreamType: string,
    callOptions?: IViewAsHtmlOptions,
    callParams?: IEndpointCallParameters
  ): Promise<ArrayBuffer> {
    Assert.exists(documentUniqueId);

    let queryString = this.buildViewAsHtmlQueryString(documentUniqueId, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    this.logger.info('Performing REST query for datastream ' + dataStreamType + ' on item uniqueID ' + documentUniqueId);

    callParams.queryString.push('dataStream=' + dataStreamType);
    return this.performOneCall(callParams).then((results: ArrayBuffer) => {
      this.logger.info('REST query successful', results, documentUniqueId);
      return results;
    });
  }

  /**
   * Gets an URL from which it is possible to see the datastream for an item. This is typically used to get a
   * thumbnail for an item.
   * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
   * @param dataStreamType Normally, `$Thumbnail`.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {string} The datastream URL.
   */
  @path('/datastream')
  @accessTokenInUrl()
  public getViewAsDatastreamUri(
    documentUniqueID: string,
    dataStreamType: string,
    callOptions?: IViewAsHtmlOptions,
    callParams?: IEndpointCallParameters
  ): string {
    callOptions = _.extend({}, callOptions);

    let queryString = this.buildBaseQueryString(callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    queryString = this.buildCompleteQueryString(callOptions.query, callOptions.queryObject);
    callParams.queryString = callParams.queryString.concat(queryString);

    return callParams.url + '?' + callParams.queryString.join('&') + '&dataStream=' + Utils.safeEncodeURIComponent(dataStreamType);
  }

  /**
   * Gets a single item, using its `uniqueId`.
   * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<IQueryResult>} A Promise of the item.
   */
  @path('/document')
  @method('GET')
  @responseType('text')
  public getDocument(
    documentUniqueID: string,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<IQueryResult> {
    let queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    return this.performOneCall<IQueryResult>(callParams);
  }

  /**
   * Gets the content of a single item, as text (think: quickview).
   * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<string>} A Promise of the item content.
   */
  @path('/text')
  @method('GET')
  @responseType('text')
  public getDocumentText(
    documentUniqueID: string,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<string> {
    let queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    return this.performOneCall<{ content: string; duration: number }>(callParams).then(data => {
      return data.content;
    });
  }

  /**
   * Gets the content for a single item, as an HTMLDocument (think: quickview).
   * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<HTMLDocument>} A Promise of the item content.
   */
  @path('/html')
  @method('POST')
  @responseType('document')
  public getDocumentHtml(
    documentUniqueID: string,
    callOptions?: IViewAsHtmlOptions,
    callParams?: IEndpointCallParameters
  ): Promise<HTMLDocument> {
    callOptions = _.extend({}, callOptions);

    let queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    callParams.requestData = callOptions.queryObject || { q: callOptions.query };

    return this.performOneCall<HTMLDocument>(callParams);
  }

  /**
   * Gets an URL from which it is possible to see a single item content, as HTML (think: quickview).
   * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {string} The URL.
   */
  @path('/html')
  @accessTokenInUrl()
  public getViewAsHtmlUri(documentUniqueID: string, callOptions?: IViewAsHtmlOptions, callParams?: IEndpointCallParameters): string {
    let queryString = this.buildBaseQueryString(callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);
    callParams.queryString = _.uniq(callParams.queryString);
    return callParams.url + '?' + callParams.queryString.join('&');
  }

  @path('/values')
  @method('POST')
  @responseType('text')
  public batchFieldValues(
    request: IListFieldValuesRequest,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<IIndexFieldValue[]> {
    Assert.exists(request);

    return this.performOneCall<any>(callParams).then(data => {
      this.logger.info('REST list field values successful', data.values, request);
      return data.values;
    });
  }

  /**
   * Lists the possible field values for a request.
   * @param request The request for which to list the possible field values.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<TResult>|Promise<U>} A Promise of the field values.
   */
  @path('/values')
  @method('POST')
  @responseType('text')
  public listFieldValues(
    request: IListFieldValuesRequest,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<IIndexFieldValue[]> {
    Assert.exists(request);

    callParams.requestData = request;

    this.logger.info('Listing field values', request);

    return this.performOneCall<any>(callParams).then(data => {
      this.logger.info('REST list field values successful', data.values, request);
      return data.values;
    });
  }

  /**
   * Lists all fields for the index, and returns an array of their descriptions.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<TResult>|Promise<U>} A Promise of the index fields and descriptions.
   */
  @path('/fields')
  @method('GET')
  @responseType('text')
  public listFields(callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IFieldDescription[]> {
    this.logger.info('Listing fields');

    return this.performOneCall<IListFieldsResult>(callParams).then(data => {
      return data.fields;
    });
  }

  /**
   * Lists all available query extensions for the search endpoint.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<IExtension[]>} A Promise of the extensions.
   */
  @path('/extensions')
  @method('GET')
  @responseType('text')
  public extensions(callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IExtension[]> {
    this.logger.info('Listing extensions');

    return this.performOneCall<IExtension[]>(callParams);
  }

  /**
   * Rates a single item in the index (granted that collaborative rating is enabled on your index)
   * @param ratingRequest The item id, and the rating to add.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<boolean>|Promise<T>}
   */
  @path('/rating')
  @method('POST')
  @responseType('text')
  public rateDocument(
    ratingRequest: IRatingRequest,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<boolean> {
    this.logger.info('Rating a document', ratingRequest);

    callParams.requestData = ratingRequest;

    return this.performOneCall<any>(callParams).then(() => {
      return true;
    });
  }

  /**
   * Tags a single item.
   * @param taggingRequest The item id, and the tag action to perform.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<boolean>|Promise<T>}
   */
  @path('/tag')
  @method('POST')
  @responseType('text')
  public tagDocument(
    taggingRequest: ITaggingRequest,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<boolean> {
    this.logger.info('Tagging an item', taggingRequest);

    callParams.requestData = taggingRequest;

    return this.performOneCall<any>(callParams).then(() => {
      return true;
    });
  }

  /**
   * Gets a list of query suggestions for a request.
   * @param request The query, and the number of suggestions to return.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<IQuerySuggestResponse>} A Promise of query suggestions.
   */
  @path('/querySuggest')
  @method('POST')
  @responseType('text')
  @includeActionsHistory()
  @includeReferrer()
  @includeVisitorId()
  @includeIsGuestUser()
  public getQuerySuggest(
    request: IQuerySuggestRequest,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<IQuerySuggestResponse> {
    this.logger.info('Get Query Suggest', request);

    callParams.requestData = _.extend({}, callParams.requestData, _.omit(request, parameter => Utils.isNullOrUndefined(parameter)));
    return this.performOneCall<IQuerySuggestResponse>(callParams, callOptions);
  }

  // This is a non documented method to ensure backward compatibility for the old query suggest call.
  // It simply calls the "real" official and documented method.
  public getRevealQuerySuggest(
    request: IQuerySuggestRequest,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<IQuerySuggestResponse> {
    return this.getQuerySuggest(request, callOptions, callParams);
  }

  /**
   * Follows an item, or a query result, using the search alerts service.
   * @param request The subscription details.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<ISubscription>}
   */
  @alertsPath('/subscriptions')
  @accessTokenInUrl('accessToken')
  @method('POST')
  @requestDataType('application/json')
  @responseType('text')
  public follow(
    request: ISubscriptionRequest,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<ISubscription> {
    callParams.requestData = request;

    this.logger.info('Following an item or a query', request);

    return this.performOneCall<ISubscription>(callParams);
  }

  private currentListSubscriptions: Promise<ISubscription[]>;

  /**
   * Gets a Promise of an array of the current subscriptions.
   * @param page The page of the subscriptions.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {any}
   */
  @alertsPath('/subscriptions')
  @accessTokenInUrl('accessToken')
  @method('GET')
  @requestDataType('application/json')
  @responseType('text')
  public listSubscriptions(
    page?: number,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<ISubscription[]> {
    if (this.options.isGuestUser) {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
    if (this.currentListSubscriptions == null) {
      callParams.queryString.push('page=' + (page || 0));

      this.currentListSubscriptions = this.performOneCall<ISubscription[]>(callParams);
      this.currentListSubscriptions
        .then((data: any) => {
          this.currentListSubscriptions = null;
          return data;
        })
        .catch((e: AjaxError) => {
          // Trap 403 error, as the listSubscription call is called on every page initialization
          // to check for current subscriptions. By default, the search alert service is not enabled for most organization
          // Don't want to pollute the console with un-needed noise and confusion
          if (e.status != 403) {
            throw e;
          }
        });
    }
    return this.currentListSubscriptions;
  }

  /**
   * Updates a subscription with new parameters.
   * @param subscription The subscription to update with new parameters.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<ISubscription>}
   */
  @alertsPath('/subscriptions/')
  @accessTokenInUrl('accessToken')
  @method('PUT')
  @requestDataType('application/json')
  @responseType('text')
  public updateSubscription(
    subscription: ISubscription,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<ISubscription> {
    callParams.requestData = subscription;

    this.logger.info('Updating a subscription', subscription);

    callParams.url += subscription.id;

    return this.performOneCall<ISubscription>(callParams);
  }

  /**
   * Deletes a subscription.
   * @param subscription The subscription to delete.
   * @param callOptions An additional set of options to use for this call.
   * @param callParams The options injected by the applied decorators.
   * @returns {Promise<ISubscription>}
   */
  @alertsPath('/subscriptions/')
  @accessTokenInUrl('accessToken')
  @method('DELETE')
  @requestDataType('application/json')
  @responseType('text')
  public deleteSubscription(
    subscription: ISubscription,
    callOptions?: IEndpointCallOptions,
    callParams?: IEndpointCallParameters
  ): Promise<ISubscription> {
    callParams.url += subscription.id;

    return this.performOneCall<ISubscription>(callParams);
  }

  @path('/log')
  @method('POST')
  public logError(sentryLog: ISentryLog, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters) {
    callParams.requestData = sentryLog;
    return this.performOneCall(callParams, callOptions)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  public nuke() {
    window.removeEventListener('beforeunload', this.onUnload);
  }

  protected createEndpointCaller() {
    this.caller = new EndpointCaller(this.options);
  }

  private static isDebugArgumentPresent(): boolean {
    return /[?&]debug=1([&]|$)/.test(window.location.search);
  }

  private static isUseLocalArgumentPresent(): boolean {
    return /[?&]useLocal=1([&]|$)/.test(window.location.search);
  }

  private handleUnload() {
    this.isRedirecting = true;
  }

  private buildBaseUri(path: string): string {
    Assert.isString(path);
    let uri = this.options.restUri;
    uri = this.removeTrailingSlash(uri);

    if (Utils.isNonEmptyString(this.options.version)) {
      uri += '/' + this.options.version;
    }
    uri += path;
    return uri;
  }

  public buildSearchAlertsUri(path: string): string {
    Assert.isString(path);
    let uri = this.options.searchAlertsUri || this.options.restUri + '/alerts';
    if (uri == null) {
      return null;
    }
    uri = this.removeTrailingSlash(uri);
    uri += path;
    return uri;
  }

  private buildBaseQueryString(callOptions?: IEndpointCallOptions): string[] {
    callOptions = _.extend({}, callOptions);
    let queryString: string[] = [];

    for (let name in this.options.queryStringArguments) {
      queryString.push(name + '=' + Utils.safeEncodeURIComponent(this.options.queryStringArguments[name]));
    }

    if (callOptions && _.isArray(callOptions.authentication) && callOptions.authentication.length != 0) {
      queryString.push('authentication=' + callOptions.authentication.join(','));
    }

    return queryString;
  }

  private buildCompleteQueryString(query?: string, queryObject?: IQuery): string[] {
    // In an ideal parallel reality, the entire query used in the 'search' call is used here.
    // In this reality however, we must support GET calls (ex: GET /html) for CORS/JSONP/IE reasons.
    // Therefore, we cherry-pick parts of the query to include in a 'query string' instead of a body payload.
    let queryString: string[] = [];
    if (queryObject) {
      _.each(['q', 'aq', 'cq', 'dq', 'searchHub', 'tab', 'locale', 'pipeline', 'lowercaseOperators'], key => {
        if (queryObject[key]) {
          queryString.push(key + '=' + Utils.safeEncodeURIComponent(queryObject[key]));
        }
      });

      _.each(queryObject.context, (value, key) => {
        let encodedValue: string;
        if (_.isArray(value)) {
          encodedValue = Utils.safeEncodeURIComponent(_.map(value, v => Utils.safeEncodeURIComponent(v)).join(','));
        } else {
          encodedValue = Utils.safeEncodeURIComponent(value);
        }
        queryString.push(`context[${Utils.safeEncodeURIComponent(key)}]=${encodedValue}`);
      });

      if (queryObject.fieldsToInclude) {
        queryString.push(
          `fieldsToInclude=[${_.map(
            queryObject.fieldsToInclude,
            field => '"' + Utils.safeEncodeURIComponent(field.replace('@', '')) + '"'
          ).join(',')}]`
        );
      }
    } else if (query) {
      queryString.push('q=' + Utils.safeEncodeURIComponent(query));
    }

    return queryString;
  }

  private buildViewAsHtmlQueryString(uniqueId: string, callOptions?: IViewAsHtmlOptions): string[] {
    callOptions = _.extend({}, callOptions);
    let queryString: string[] = this.buildBaseQueryString(callOptions);
    queryString.push('uniqueId=' + Utils.safeEncodeURIComponent(uniqueId));

    if (callOptions.query || callOptions.queryObject) {
      queryString.push('enableNavigation=true');
    }

    if (callOptions.requestedOutputSize) {
      queryString.push('requestedOutputSize=' + Utils.safeEncodeURIComponent(callOptions.requestedOutputSize.toString()));
    }

    if (callOptions.contentType) {
      queryString.push('contentType=' + Utils.safeEncodeURIComponent(callOptions.contentType));
    }
    return queryString;
  }

  private performOneCall<T>(params: IEndpointCallParameters, callOptions?: IEndpointCallOptions, autoRenewToken = true): Promise<T> {
    let queryString = this.buildBaseQueryString(callOptions);
    params.queryString = params.queryString.concat(queryString);
    params.queryString = _.uniq(params.queryString);

    return this.caller
      .call(params)
      .then((response?: ISuccessResponse<T>) => {
        if (response.data == null) {
          response.data = <any>{};
        }
        return response.data;
      })
      .catch((error?: IErrorResponse) => {
        if (autoRenewToken && this.canRenewAccessToken() && this.isAccessTokenExpiredStatus(error.statusCode)) {
          return this.renewAccessToken()
            .then(() => {
              return this.performOneCall(params, callOptions, autoRenewToken);
            })
            .catch(() => {
              return Promise.reject(this.handleErrorResponse(error));
            });
        } else if (error.statusCode == 0 && this.isRedirecting) {
          // The page is getting redirected
          // Set timeout on return with empty string, since it does not really matter
          _.defer(function() {
            return '';
          });
        } else {
          return Promise.reject(this.handleErrorResponse(error));
        }
      });
  }

  private handleErrorResponse(errorResponse: IErrorResponse): Error {
    if (this.isMissingAuthenticationProviderStatus(errorResponse.statusCode)) {
      return new MissingAuthenticationError(errorResponse.data['provider']);
    } else if (errorResponse.data && errorResponse.data.message && errorResponse.data.type) {
      return new QueryError(errorResponse);
    } else if (errorResponse.data && errorResponse.data.message) {
      return new AjaxError(`Request Error : ${errorResponse.data.message}`, errorResponse.statusCode);
    } else {
      return new AjaxError('Request Error', errorResponse.statusCode);
    }
  }

  private canRenewAccessToken(): boolean {
    return Utils.isNonEmptyString(this.options.accessToken) && _.isFunction(this.options.renewAccessToken);
  }

  private renewAccessToken(): Promise<string> {
    this.logger.info('Renewing expired access token');
    return this.options
      .renewAccessToken()
      .then((token: string) => {
        Assert.isNonEmptyString(token);
        this.options.accessToken = token;
        this.createEndpointCaller();
        return token;
      })
      .catch((e: string) => {
        this.logger.error('Failed to renew access token', e);
        return e;
      });
  }

  private removeTrailingSlash(uri: string) {
    if (this.hasTrailingSlash(uri)) {
      uri = uri.substr(0, uri.length - 1);
    }
    return uri;
  }

  private hasTrailingSlash(uri: string) {
    return uri.charAt(uri.length - 1) == '/';
  }

  private isMissingAuthenticationProviderStatus(status: number): boolean {
    return status == 402;
  }

  private isAccessTokenExpiredStatus(status: number): boolean {
    return status == 419;
  }
}

// It's taken for granted that methods using decorators have :
// IEndpointCallOptions as their second to last parameter
// IEndpointCallParameters as their last parameter
// The default parameters for each member of the injected {@link IEndpointCallParameters} are the following:
// url: '',
// queryString: [],
// requestData: {},
// requestDataType: undefined,
// method: '',
// responseType: '',
// errorsAsSuccess: false

function decoratorSetup(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  return {
    originalMethod: descriptor.value,
    nbParams: target[key].prototype.constructor.length
  };
}

function defaultDecoratorEndpointCallParameters() {
  const params: IEndpointCallParameters = {
    url: '',
    queryString: [],
    requestData: {},
    method: '',
    responseType: '',
    errorsAsSuccess: false
  };
  return params;
}

function path(path: string) {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);

    descriptor.value = function(...args: any[]) {
      const url = this.buildBaseUri(path);
      if (args[nbParams - 1]) {
        args[nbParams - 1].url = url;
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { url: url });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

function alertsPath(path: string) {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);

    descriptor.value = function(...args: any[]) {
      const url = this.buildSearchAlertsUri(path);
      if (args[nbParams - 1]) {
        args[nbParams - 1].url = url;
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { url: url });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

function requestDataType(type: string) {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);

    descriptor.value = function(...args: any[]) {
      if (args[nbParams - 1]) {
        args[nbParams - 1].requestDataType = type;
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { requestDataType: type });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

function method(met: string) {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);

    descriptor.value = function(...args: any[]) {
      if (args[nbParams - 1]) {
        args[nbParams - 1].method = met;
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { method: met });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

function responseType(resp: string) {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);

    descriptor.value = function(...args: any[]) {
      if (args[nbParams - 1]) {
        args[nbParams - 1].responseType = resp;
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { responseType: resp });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

function accessTokenInUrl(tokenKey: string = 'access_token') {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);
    const buildAccessToken = (tokenKey: string, endpointInstance: SearchEndpoint): string[] => {
      let queryString: string[] = [];

      if (Utils.isNonEmptyString(endpointInstance.options.accessToken)) {
        queryString.push(tokenKey + '=' + Utils.safeEncodeURIComponent(endpointInstance.options.accessToken));
      }

      return queryString;
    };

    descriptor.value = function(...args: any[]) {
      const queryString = buildAccessToken(tokenKey, this);
      if (args[nbParams - 1]) {
        args[nbParams - 1].queryString = args[nbParams - 1].queryString.concat(queryString);
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { queryString: queryString });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

function includeActionsHistory(historyStore: CoveoAnalytics.HistoryStore = new history.HistoryStore()) {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);

    descriptor.value = function(...args: any[]) {
      let historyFromStore = historyStore.getHistory();
      if (historyFromStore == null) {
        historyFromStore = [];
      }

      if (args[nbParams - 1]) {
        args[nbParams - 1].requestData.actionsHistory = historyFromStore;
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), {
          requestData: { actionsHistory: historyFromStore }
        });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

function includeReferrer() {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);
    descriptor.value = function(...args: any[]) {
      let referrer = document.referrer;
      if (referrer == null) {
        referrer = '';
      }

      if (args[nbParams - 1]) {
        args[nbParams - 1].requestData.referrer = referrer;
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), {
          requestData: { referrer: referrer }
        });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

function includeVisitorId() {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);
    descriptor.value = function(...args: any[]) {
      let visitorId = Cookie.get('visitorId');
      if (visitorId == null) {
        visitorId = '';
      }

      if (args[nbParams - 1]) {
        args[nbParams - 1].requestData.visitorId = visitorId;
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), {
          requestData: { visitorId: visitorId }
        });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

function includeIsGuestUser() {
  return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const { originalMethod, nbParams } = decoratorSetup(target, key, descriptor);
    descriptor.value = function(...args: any[]) {
      let isGuestUser = this.options.isGuestUser;

      if (args[nbParams - 1]) {
        args[nbParams - 1].requestData.isGuestUser = isGuestUser;
      } else {
        const endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), {
          requestData: { isGuestUser: isGuestUser }
        });
        args[nbParams - 1] = endpointCallParams;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
