import {ISearchEndpointOptions, ISearchEndpoint, IViewAsHtmlOptions} from './SearchEndpointInterface';
import {EndpointCaller, IEndpointCallParameters, ISuccessResponse, IErrorResponse} from '../rest/EndpointCaller';
import {IEndpointCallOptions} from '../rest/SearchEndpointInterface';
import {IStringMap} from './GenericParam';
import {Logger} from '../misc/Logger';
import {Assert} from '../misc/Assert';
import {IQuery} from '../rest/Query';
import {IQueryResults} from '../rest/QueryResults';
import {IQueryResult} from '../rest/QueryResult';
import {version} from '../misc/Version';
import {IListFieldValuesRequest} from '../rest/ListFieldValuesRequest';
import {IIndexFieldValue} from '../rest/FieldValue';
import {IFieldDescription} from '../rest/FieldDescription';
import {ListFieldsResult} from '../rest/ListFieldsResult';
import {IExtension} from '../rest/Extension';
import {IRatingRequest} from '../rest/RatingRequest';
import {ITaggingRequest} from '../rest/TaggingRequest';
import {IRevealQuerySuggestRequest, IRevealQuerySuggestResponse} from '../rest/RevealQuerySuggest';
import {ISubscriptionRequest, ISubscription} from '../rest/Subscription';
import {AjaxError} from '../rest/AjaxError';
import {MissingAuthenticationError} from '../rest/MissingAuthenticationError';
import {QueryUtils} from '../utils/QueryUtils';
import {QueryError} from '../rest/QueryError';
import {Utils} from '../utils/Utils';
import {Promise} from 'es6-promise';
import _ = require('underscore');

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
 * A search endpoint allows to execute various actions against the Coveo Search API and index.<br/>
 * For example, you can search, list field values, get the quickview content for a document, etc.<br/>
 * Any actions that you execute using this class will not trigger a full query cycle for the Coveo components.<br/>
 * This is because this class will not trigger any query events directly.<br/>
 * If you wish to execute a query that all components will react to (and trigger the corresponding query events), use the {@link QueryController}
 */
export class SearchEndpoint implements ISearchEndpoint {
  /**
   * A map of all the initialized endpoint.<br/>
   * eg : Coveo.SearchEndpoint.endpoints['default'] will return the default endpoint that was created at initialization
   * @type {{}}
   */
  static endpoints: { [endpoint: string]: SearchEndpoint; } = {};

  /**
   * Configure an endpoint that will point to a Coveo Cloud index, which contains a set of public sources with no security on them.<br/>
   * Used for demo purposes and ease of setup.
   * @param otherOptions A set of additional options to use when configuring this endpoint
   */
  static configureSampleEndpoint(otherOptions?: ISearchEndpointOptions) {
    if (SearchEndpoint.isUseLocalArgumentPresent()) {
      // This is a handy flag to quickly test a local search API and alerts
      SearchEndpoint.endpoints["default"] = new SearchEndpoint(_.extend({
        restUri: 'http://localhost:8100/rest/search',
        searchAlertsUri: 'http://localhost:8088/rest/search/alerts/'
      }, otherOptions));
    } else {
      // This OAuth token points to the organization used for samples.
      // It contains a set of harmless content sources.
      SearchEndpoint.endpoints["default"] = new SearchEndpoint(_.extend({
        restUri: 'https://cloudplatform.coveo.com/rest/search',
        accessToken: '52d806a2-0f64-4390-a3f2-e0f41a4a73ec'
      }, otherOptions));
    }
  }

  /**
   * Configure an endpoint to a Coveo Cloud index.
   * @param organization The organization id of your Coveo cloud index
   * @param token The token to use to execute query. If null, you will most probably need to login when querying.
   * @param uri The uri of your cloud Search API. By default, will point to the production environment
   * @param otherOptions A set of additional options to use when configuring this endpoint
   */
  static configureCloudEndpoint(organization?: string, token?: string, uri: string = 'https://cloudplatform.coveo.com/rest/search', otherOptions?: ISearchEndpointOptions) {

    var merged = SearchEndpoint.mergeConfigOptions({
      restUri: uri,
      accessToken: token,
      queryStringArguments: {
        workgroup: organization
      }
    }, otherOptions);

    SearchEndpoint.endpoints["default"] = new SearchEndpoint(SearchEndpoint.removeUndefinedConfigOption(merged))
  }

  /**
   * Configure an endpoint to a Coveo on premise index.
   * @param uri The uri of your Coveo Search API endpoint. eg : http://myserver:8080/rest/search
   * @param token The token to use to execute query. If null, you will most probably need to login when querying (unless the search api is configured using advanced auth options, like windows auth or claims)
   * @param otherOptions A set of additional options to use when configuring this endpoint
   */
  static configureOnPremiseEndpoint(uri: string, token?: string, otherOptions?: ISearchEndpointOptions) {
    var merged = SearchEndpoint.mergeConfigOptions({
      restUri: uri,
      accessToken: token
    }, otherOptions);

    SearchEndpoint.endpoints["default"] = new SearchEndpoint(SearchEndpoint.removeUndefinedConfigOption(merged));
  }

  static removeUndefinedConfigOption(config: ISearchEndpointOptions) {
    _.each(_.keys(config), (key) => {
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
  private onUnload: (...args: any[]) => void

  /**
   * Create a new SearchEndpoint.<br/>
   * Will use a set of sane default options, and merge them with the options parameter.<br/>
   * Will create an {@link EndpointCaller} and use it to communicate with the endpoint internally
   * @param options
   */
  constructor(public options?: ISearchEndpointOptions) {
    Assert.exists(options);

    // For backward compatibility, we set anonymous to true when an access token
    // is specified on a page loaded through the filesystem. This causes withCredentials
    // to NOT be set, allowing those pages to work with non Windows/Basic/Cookie
    // authentication. If anonymous is explicitly set to false, we'll use withCredentials.
    var defaultOptions = new DefaultSearchEndpointOptions();
    defaultOptions.anonymous = window.location.href.indexOf('file://') == 0 && Utils.isNonEmptyString(options.accessToken);
    this.options = <ISearchEndpointOptions>_.extend({}, defaultOptions, options);

    // Forward any debug=1 query argument to the REST API to ease debugging
    if (SearchEndpoint.isDebugArgumentPresent()) {
      this.options.queryStringArguments['debug'] = 1;
    }
    this.onUnload = () => {
      this.handleUnload();
    }
    window.addEventListener('beforeunload', this.onUnload);
    this.logger = new Logger(this);
    this.createEndpointCaller();
  }

  public reset() {
    this.createEndpointCaller();
  }

  /**
   * Return the base uri of the endpoint to perform search
   * @returns {string}
   */
  public getBaseUri(): string {
    return this.buildBaseUri('');
  }

  /**
   * Return the base uri of the endpoint for search alert
   * @returns {string}
   */
  public getBaseAlertsUri(): string {
    return this.buildSearchAlertsUri('');
  }

  /**
   * Get the uri that can be use to authenticate against the given provider
   * @param provider The provider name
   * @param returnUri The uri at which to return after the authentication is completed
   * @param message The message for authentication
   * @returns {string}
   */
  public getAuthenticationProviderUri(provider: string, returnUri?: string, message?: string): string {
    var uri = this.buildBaseUri('/login/' + provider) + '?';

    if (Utils.isNonEmptyString(this.options.accessToken)) {
      uri += 'access_token=' + encodeURIComponent(this.options.accessToken) + '&';
    }

    if (Utils.isNonEmptyString(returnUri)) {
      uri += 'redirectUri=' + encodeURIComponent(returnUri);
    } else if (Utils.isNonEmptyString(message)) {
      uri += 'message=' + encodeURIComponent(message);
    }
    return uri;
  }

  /**
   * is the search endpoint using jsonp internally to communicate with Search API
   * @returns {boolean}
   */
  public isJsonp(): boolean {
    return this.caller.useJsonp;
  }

  /**
   * Perform a search on the index and returns a Promise of {@link IQueryResults}.<br/>
   * Will modify the query results slightly, by adding additional information on each results (an id, the state object, etc.)
   * @param query The query to execute. Typically, the query object is built using a {@link QueryBuilder}
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<IQueryResults>}
   */
  public search(query: IQuery, callOptions?: IEndpointCallOptions): Promise<IQueryResults> {
    Assert.exists(query);

    this.logger.info('Performing REST query', query);

    callOptions = _.extend({}, callOptions);

    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/'),
      queryString: this.buildBaseQueryString(callOptions),
      requestData: query,
      errorsAsSuccess: true,
      responseType: 'text',
      method: 'POST'
    };

    return this.performOneCall(params).then((results?: IQueryResults) => {
      this.logger.info('REST query successful', results, query);

      // Version check
      // If the SearchAPI doesn't give us any apiVersion info, we assume version 1 (before apiVersion was implemented)
      if (results.apiVersion == null) {
        results.apiVersion = 1;
      }
      if (results.apiVersion < version.supportedApiVersion) {
        this.logger.error('Please update your REST Search API');
      }

      // If the server specified no search ID generated one using the client-side
      // GUID generator. We prefer server generated guids to allow tracking a query
      // all the way from the analytics to the logs.
      if (Utils.isNullOrEmptyString(results.searchUid)) {
        results.searchUid = QueryUtils.createGuid();
      }
      QueryUtils.setIndexAndUidOnQueryResults(query, results, results.searchUid, results.pipeline, results.splitTestRun);
      QueryUtils.setTermsToHighlightOnQueryResults(query, results);
      return results;
    })
  }

  /**
   * Get a link/uri to download a set of results, for a given query, to an xlsx format.<br/>
   * Note : This does not download automatically the documents, merely provide an url at which to download them.
   * @param query The query for which to get the xlsx documents
   * @param numberOfResults The number of results that should be downloaded
   * @param callOptions Additional set of options to use for this call.
   * @returns {string}
   */
  public getExportToExcelLink(query: IQuery, numberOfResults: number, callOptions?: IEndpointCallOptions): string {
    var baseUri = this.buildBaseUri('/');
    var queryString = this.buildCompleteQueryString(callOptions, null, query);

    if (Utils.isNonEmptyString(this.options.accessToken)) {
      queryString.push('access_token=' + encodeURIComponent(this.options.accessToken));
    }

    if (numberOfResults != null) {
      queryString.push("numberOfResults=" + numberOfResults);
    }

    queryString.push('format=xlsx');

    return baseUri + '?' + queryString.join('&');
  }

  /**
   * Get the raw datastream for a given document. This is typically used to get a thumbnail for a document.<br/>
   * Return an array buffer : <br/>
   * eg : var rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));<br/>
   * img.setAttribute('src', 'data:image/png;base64,' + btoa(rawBinary));
   * @param documentUniqueId Typically the {@link IQueryResult.uniqueId} on each result
   * @param dataStreamType Normally : '$Thumbnail'
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<TResult>|Promise<U>}
   */
  public getRawDataStream(documentUniqueId: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions): Promise<ArrayBuffer> {
    Assert.exists(documentUniqueId);
    callOptions = _.extend({}, callOptions);

    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/datastream'),
      queryString: this.buildViewAsHtmlQueryString(documentUniqueId, callOptions).concat(["dataStream=" + dataStreamType]),
      requestData: {},
      errorsAsSuccess: false,
      method: 'GET',
      responseType: 'arraybuffer'
    };
    this.logger.info('Performing REST query for datastream ' + dataStreamType + ' on document uniqueID' + documentUniqueId);
    return this.performOneCall(params).then((results) => {
      this.logger.info('REST query successful', results, documentUniqueId);
      return results;
    })
  }

  /**
   * Return an url that will allow to see the datastream for a given document. This is typically used to get a thumbnail for a document.<br/>
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param dataStreamType Normally : '$Thumbnail'
   * @param callOptions Additional set of options to use for this call.
   * @returns {string}
   */
  public getViewAsDatastreamUri(documentUniqueID: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions): string {
    callOptions = _.extend({}, callOptions);
    return this.buildViewAsHtmlUri("/datastream", documentUniqueID, callOptions) + '&dataStream=' + encodeURIComponent(dataStreamType);
  }

  /**
   * Return a single document, using it's uniqueId
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<IQueryResult>}
   */
  public getDocument(documentUniqueID: string, callOptions?: IEndpointCallOptions): Promise<IQueryResult> {
    callOptions = _.extend({}, callOptions);

    var params: IEndpointCallParameters = {
      url: this.buildBaseUri("/document"),
      queryString: this.buildViewAsHtmlQueryString(documentUniqueID, callOptions),
      method: "GET",
      requestData: {},
      responseType: "text",
      errorsAsSuccess: true
    };

    return this.performOneCall<IQueryResult>(params);
  }

  /**
   * Return the content for a single document, as text.<br/>
   * Think : quickview
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<string>}
   */
  public getDocumentText(documentUniqueID: string, callOptions?: IEndpointCallOptions): Promise<string> {
    callOptions = _.extend({}, callOptions);

    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/text'),
      queryString: this.buildViewAsHtmlQueryString(documentUniqueID, callOptions),
      method: 'GET',
      requestData: {},
      responseType: 'text',
      errorsAsSuccess: true
    };

    return this.performOneCall<{ content: string, duration: number }>(params)
      .then((data) => {
        return data.content
      });
  }

  /**
   * Return the content for a single document, as an HTMLDocument.<br/>
   * Think : quickview
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<HTMLDocument>}
   */
  public getDocumentHtml(documentUniqueID: string, callOptions?: IViewAsHtmlOptions): Promise<HTMLDocument> {
    callOptions = _.extend({}, callOptions);

    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/html'),
      queryString: this.buildViewAsHtmlQueryString(documentUniqueID, callOptions, false),
      method: 'POST',
      requestData: callOptions.queryObject || { q: callOptions.query },
      responseType: 'document',
      errorsAsSuccess: false
    };

    return this.performOneCall<HTMLDocument>(params);
  }

  /**
   * Return an url that will allow to see a single document content, as HTML.<br/>
   * Think : quickview
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param callOptions Additional set of options to use for this call.
   * @returns {string}
   */
  public getViewAsHtmlUri(documentUniqueID: string, callOptions?: IViewAsHtmlOptions): string {
    callOptions = _.extend({}, callOptions);
    return this.buildViewAsHtmlUri("/html", documentUniqueID, callOptions);
  }

  private _batchListFieldValues: IListFieldValuesRequest[] = [];

  public batchFieldValues(request: IListFieldValuesRequest, callOptions?: IEndpointCallOptions): Promise<IIndexFieldValue[]> {
    Assert.exists(request);
    callOptions = _.extend({}, callOptions);

    this.logger.info('Listing field values', request);
    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/values'),
      queryString: this.buildBaseQueryString(callOptions),
      method: "POST",
      requestData: request,
      errorsAsSuccess: true,
      responseType: 'text'
    };

    return this.performOneCall<any>(params)
      .then((data) => {
        this.logger.info('REST list field values successful', data.values, request);
        return data.values;
      })
  }

  /**
   * List the possible values for a given request
   * @param request The request for which to list the possible field values
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<TResult>|Promise<U>}
   */
  public listFieldValues(request: IListFieldValuesRequest, callOptions?: IEndpointCallOptions): Promise<IIndexFieldValue[]> {
    Assert.exists(request);
    callOptions = _.extend({}, callOptions);

    this.logger.info('Listing field values', request);

    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/values'),
      queryString: this.buildBaseQueryString(callOptions),
      method: "POST",
      requestData: request,
      errorsAsSuccess: true,
      responseType: 'text'
    };

    return this.performOneCall<any>(params)
      .then((data) => {
        this.logger.info('REST list field values successful', data.values, request);
        return data.values
      })
  }

  /**
   * List all fields for the index, and return an array of their description
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<TResult>|Promise<U>}
   */
  public listFields(callOptions?: IEndpointCallOptions): Promise<IFieldDescription[]> {
    callOptions = _.extend({}, callOptions);

    this.logger.info('Listing fields');
    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/fields'),
      queryString: this.buildBaseQueryString(callOptions),
      requestData: {},
      method: "GET",
      responseType: "text",
      errorsAsSuccess: true
    };

    return this.performOneCall<ListFieldsResult>(params).then((data) => {
      return data.fields;
    })
  }

  /**
   * List all available query extensions for the search endpoint
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<IExtension[]>}
   */
  public extensions(callOptions?: IEndpointCallOptions): Promise<IExtension[]> {
    callOptions = _.extend({}, callOptions);

    this.logger.info('Listing extensions');

    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/extensions'),
      queryString: this.buildBaseQueryString(callOptions),
      requestData: {},
      method: "GET",
      responseType: "text",
      errorsAsSuccess: true
    };

    return this.performOneCall<IExtension[]>(params)
  }

  /**
   * Allow to rate a single document in the index (granted that collaborative rating is enabled on your index)
   * @param ratingRequest Document id and rating
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<boolean>|Promise<T>}
   */
  public rateDocument(ratingRequest: IRatingRequest, callOptions?: IEndpointCallOptions): Promise<boolean> {
    callOptions = _.extend({}, callOptions);

    this.logger.info('Rating a document', ratingRequest);
    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/rating'),
      queryString: this.buildBaseQueryString(callOptions),
      method: 'POST',
      requestData: ratingRequest,
      errorsAsSuccess: false,
      responseType: "text"
    }

    return this.performOneCall<any>(params).then(() => {
      return true;
    })
  }

  /**
   * Allow to tag a single document
   * @param taggingRequest Document id and tag action to perform
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<boolean>|Promise<T>}
   */
  public tagDocument(taggingRequest: ITaggingRequest, callOptions?: IEndpointCallOptions): Promise<boolean> {
    callOptions = _.extend({}, callOptions);

    this.logger.info('Tagging a document', taggingRequest);
    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/tag'),
      queryString: this.buildBaseQueryString(callOptions),
      method: 'POST',
      requestData: taggingRequest,
      errorsAsSuccess: false,
      responseType: "text"
    }

    return this.performOneCall<any>(params).then(() => {
      return true;
    })
  }

  /**
   * Return a list of reveal query suggestions, based on the given request
   * @param request query and number of suggestions to return
   * @param callOptions Additional set of options to use for this call.
   * @returns {Promise<IRevealQuerySuggestResponse>}
   */
  public getRevealQuerySuggest(request: IRevealQuerySuggestRequest, callOptions?: IEndpointCallOptions): Promise<IRevealQuerySuggestResponse> {
    callOptions = _.extend({}, callOptions);

    this.logger.info('Get Reveal Query Suggest', request);

    var params: IEndpointCallParameters = {
      url: this.buildBaseUri('/querySuggest'),
      queryString: this.buildBaseQueryString(callOptions),
      method: 'GET',
      requestData: request,
      errorsAsSuccess: true,
      responseType: "text"
    }

    return this.performOneCall<IRevealQuerySuggestResponse>(params);
  }

  /**
   * Allow to follow a document or a query on the search alerts service
   * @param request
   * @returns {Promise<ISubscription>}
   */
  public follow(request: ISubscriptionRequest): Promise<ISubscription> {
    var qs = [];
    if (this.options.accessToken) {
      qs = ["accessToken=" + this.options.accessToken]
    }
    var params: IEndpointCallParameters = {
      url: this.buildSearchAlertsUri('/subscriptions'),
      queryString: qs,
      requestDataType: "application/json",
      requestData: request,
      responseType: 'text',
      errorsAsSuccess: true,
      method: 'POST'
    };

    return this.performOneCall<ISubscription>(params);
  }

  private currentListSubscriptions: Promise<ISubscription[]>;

  /**
   * Return a Promise of array of current subscriptions
   * @param page The page of the subsctiptions
   * @returns {any}
   */
  public listSubscriptions(page: number) {
    if (this.options.isGuestUser) {
      return new Promise((resolve, reject) => {
        reject()
      })
    }
    if (this.currentListSubscriptions == null) {
      var queryParameters = [
        "page=" + (page || 0)
      ];
      if (this.options.accessToken) {
        queryParameters.push('accessToken=' + this.options.accessToken);
      }

      var params: IEndpointCallParameters = {
        url: this.buildSearchAlertsUri('/subscriptions'),
        queryString: queryParameters,
        requestDataType: "application/json",
        requestData: {},
        responseType: 'text',
        errorsAsSuccess: true,
        method: 'GET'
      };

      this.currentListSubscriptions = this.performOneCall<ISubscription[]>(params);
      this.currentListSubscriptions.then((data: any) => {
        this.currentListSubscriptions = null;
        return data;
      }).catch((e: AjaxError) => {
        // Trap 503 error, as the listSubscription call is called on every page initialization
        // to check for current subscriptions. By default, the search alert service is not enabled for most organization
        // Don't want to pollute the console with un-needed noise and confusion
        if (e.status != 503) {
          throw e;
        }
      });
    }
    return this.currentListSubscriptions;
  }

  /**
   * Update a subscription with new parameters
   * @param subscription The subscription to update with new parameters
   * @returns {Promise<ISubscription>}
   */
  public updateSubscription(subscription: ISubscription): Promise<ISubscription> {
    var qs = [];
    if (this.options.accessToken) {
      qs = ["accessToken=" + this.options.accessToken];
    }
    var params: IEndpointCallParameters = {
      url: this.buildSearchAlertsUri('/subscriptions/' + subscription.id),
      queryString: qs,
      requestDataType: "application/json",
      requestData: subscription,
      responseType: 'text',
      errorsAsSuccess: true,
      method: 'PUT'
    };

    return this.performOneCall<ISubscription>(params);
  }

  /**
   * Delete a subscription
   * @param subscription The subscription to delete
   * @returns {Promise<ISubscription>}
   */
  public deleteSubscription(subscription: ISubscription): Promise<ISubscription> {
    var qs = [];
    if (this.options.accessToken) {
      qs = ["accessToken=" + this.options.accessToken]
    }
    var params: IEndpointCallParameters = {
      url: this.buildSearchAlertsUri('/subscriptions/' + subscription.id),
      queryString: qs,
      requestDataType: "application/json",
      requestData: {},
      responseType: 'text',
      errorsAsSuccess: true,
      method: 'DELETE'
    };

    return this.performOneCall<ISubscription>(params);
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
    var uri = this.options.restUri;
    uri = this.removeTrailingSlash(uri);

    if (this.options.version != null) {
      uri += '/' + this.options.version;
    }
    uri += path;
    return uri;
  }

  private buildSearchAlertsUri(path: string): string {
    Assert.isString(path);
    var uri = this.options.searchAlertsUri || this.options.restUri + '/alerts';
    if (uri == null) {
      return null;
    }
    uri = this.removeTrailingSlash(uri);
    uri += path;
    return uri;
  }

  private buildBaseQueryString(callOptions?: IEndpointCallOptions): string[] {
    var queryString: string[] = [];

    for (var name in this.options.queryStringArguments) {
      queryString.push(name + '=' + encodeURIComponent(this.options.queryStringArguments[name]));
    }


    if (callOptions && _.isArray(callOptions.authentication) && callOptions.authentication.length != 0) {
      queryString.push('authentication=' + callOptions.authentication.join(','))
    }

    return queryString;
  }

  private buildCompleteQueryString(callOptions?: IEndpointCallOptions, query?: string, queryObject?: IQuery): string[] {
    var queryString = this.buildBaseQueryString(callOptions);

    // In an ideal parallel reality, the entire query used in the 'search' call is used here.
    // In this reality however, we must support GET calls (ex: GET /html) for CORS/JSONP/IE reasons.
    // Therefore, we cherry-pick parts of the query to include in a 'query string' instead of a body payload.
    if (queryObject) {
      _.each(['q', 'aq', 'cq', 'dq', 'searchHub', 'tab', 'language', 'pipeline', 'lowercaseOperators'], (key) => {
        if (queryObject[key]) {
          queryString.push(key + '=' + encodeURIComponent(queryObject[key]));
        }
      });

      _.each(queryObject.context, (value, key) => {
        queryString.push('context[' + key + ']=' + encodeURIComponent(value));
      });
    } else if (query) {
      queryString.push('q=' + encodeURIComponent(query));
    }

    return queryString;
  }

  private buildViewAsHtmlUri(path: string, documentUniqueID: string, callOptions?: IViewAsHtmlOptions): string {
    Assert.isNonEmptyString(documentUniqueID);

    var queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);

    // Since those uri will be loaded in a frame or tab, we must include any
    // authentication token as a query string argument instead of relying on
    // endpoint caller for this.
    if (Utils.isNonEmptyString(this.options.accessToken)) {
      queryString.push('access_token=' + encodeURIComponent(this.options.accessToken));
    }

    var baseUri = this.buildBaseUri(path);

    return baseUri + '?' + queryString.join('&');
  }

  private buildViewAsHtmlQueryString(uniqueId: string, callOptions?: IViewAsHtmlOptions, includeQuery: boolean = true): string[] {
    var queryString = includeQuery ? this.buildCompleteQueryString(callOptions, callOptions.query, callOptions.queryObject) : [];

    queryString.push('uniqueId=' + encodeURIComponent(uniqueId));

    if (callOptions.query || callOptions.queryObject) {
      queryString.push('enableNavigation=true');
    }

    if (callOptions.requestedOutputSize) {
      queryString.push('requestedOutputSize=' + encodeURIComponent(callOptions.requestedOutputSize.toString()))
    }

    if (callOptions.contentType) {
      queryString.push('contentType=' + encodeURIComponent(callOptions.contentType))
    }

    return queryString;
  }

  private performOneCall<T>(params: IEndpointCallParameters, autoRenewToken = true): Promise<T> {
    return this.caller.call(params)
      .then((response?: ISuccessResponse<T>) => {
        if (response.data != null) {
          (<any>response.data).clientDuration = response.duration;
        }
        return response.data
      }).catch((error?: IErrorResponse) => {
        if (autoRenewToken && this.canRenewAccessToken() && this.isAccessTokenExpiredStatus(error.statusCode)) {
          this.renewAccessToken()
            .then(() => {
              return this.performOneCall(params, autoRenewToken);
            })
            .catch(() => {
              return Promise.reject(this.handleErrorResponse(error));
            })
        } else if (error.statusCode == 0 && this.isRedirecting) {
          // The page is getting redirected
          // Set timeout on return with empty string, since it does not really matter
          _.defer(function() {
            return '';
          });
        } else {
          return Promise.reject(this.handleErrorResponse(error));
        }
      })
  }

  private handleErrorResponse(errorResponse: IErrorResponse): Error {
    if (this.isMissingAuthenticationProviderStatus(errorResponse.statusCode)) {
      return new MissingAuthenticationError(errorResponse.data['provider'])
    } else if (errorResponse.data && errorResponse.data.message) {
      return new QueryError(errorResponse)
    } else {
      return new AjaxError('Request Error', errorResponse.statusCode)
    }
  }

  private canRenewAccessToken(): boolean {
    return Utils.isNonEmptyString(this.options.accessToken) && _.isFunction(this.options.renewAccessToken);
  }

  private renewAccessToken(): Promise<string> | Promise<any> {
    this.logger.info('Renewing expired access token');
    return this.options.renewAccessToken().then((token: string) => {
      Assert.isNonEmptyString(token);
      this.options.accessToken = token;
      this.createEndpointCaller();
      return token;
    })
      .catch((e: any) => {
        this.logger.error('Failed to renew access token', e);
        return e;
      })
  }

  private isMissingAuthenticationProviderStatus(status: number): boolean {
    return status == 402;
  }

  private isAccessTokenExpiredStatus(status: number): boolean {
    return status == 419;
  }

  private addTrailingSlash(uri: string) {
    if (!this.hasTrailingSlash(uri)) {
      uri += '/';
    }
    return uri;
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
}
