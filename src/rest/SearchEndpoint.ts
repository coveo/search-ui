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
import { IRevealQuerySuggestRequest, IRevealQuerySuggestResponse } from '../rest/RevealQuerySuggest';
import { ISentryLog } from './SentryLog';
import { ISubscriptionRequest, ISubscription } from '../rest/Subscription';
import { AjaxError } from '../rest/AjaxError';
import { MissingAuthenticationError } from '../rest/MissingAuthenticationError';
import { QueryUtils } from '../utils/QueryUtils';
import { QueryError } from '../rest/QueryError';
import { Utils } from '../utils/Utils';
import { Promise } from 'es6-promise';
import { shim } from '../misc/PromisesShim';
import _ = require('underscore');
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
      SearchEndpoint.endpoints['default'] = new SearchEndpoint(_.extend({
        restUri: 'http://localhost:8100/rest/search',
        searchAlertsUri: 'http://localhost:8088/rest/search/alerts/'
      }, otherOptions));
    } else {
      // This OAuth token points to the organization used for samples.
      // It contains a set of harmless content sources.
      SearchEndpoint.endpoints['default'] = new SearchEndpoint(_.extend({
        restUri: 'https://cloudplatform.coveo.com/rest/search',
        accessToken: '52d806a2-0f64-4390-a3f2-e0f41a4a73ec'
      }, otherOptions));
    }
  }

  /**
   * Configure an endpoint that will point to a Coveo Cloud index V2, which contains a set of public sources with no security on them.<br/>
   * Used for demo purposes and ease of setup.
   * @param otherOptions A set of additional options to use when configuring this endpoint
   */
  static configureSampleEndpointV2(optionsOPtions?: ISearchEndpointOptions) {
    SearchEndpoint.endpoints['default'] = new SearchEndpoint(_.extend({
      restUri: 'https://platform.cloud.coveo.com/rest/search',
      accessToken: 'xx564559b1-0045-48e1-953c-3addd1ee4457',
      queryStringArguments: {
        organizationID: 'searchuisamples',
        viewAllContent: 1
      }
    }));
  }

  /**
   * Configure an endpoint to a Coveo Cloud index.
   * @param organization The organization id of your Coveo cloud index
   * @param token The token to use to execute query. If null, you will most probably need to login when querying.
   * @param uri The uri of your cloud Search API. By default, will point to the production environment
   * @param otherOptions A set of additional options to use when configuring this endpoint
   */
  static configureCloudEndpoint(organization?: string, token?: string, uri: string = 'https://cloudplatform.coveo.com/rest/search', otherOptions?: ISearchEndpointOptions) {
    let options: ISearchEndpointOptions = {
      restUri: uri,
      accessToken: token,
      queryStringArguments: { organizationId: organization }
    };

    let merged = SearchEndpoint.mergeConfigOptions(options, otherOptions);

    SearchEndpoint.endpoints['default'] = new SearchEndpoint(SearchEndpoint.removeUndefinedConfigOption(merged));
  }

  /**
   * Configure an endpoint to a Coveo Cloud index, in the V2 platform.
   * @param organization The organization id of your Coveo cloud index
   * @param token The token to use to execute query. If null, you will most probably need to login when querying.
   * @param uri The uri of your cloud Search API. By default, will point to the production environment
   * @param otherOptions A set of additional options to use when configuring this endpoint
   */
  static configureCloudV2Endpoint(organization?: string, token?: string, uri: string = 'https://platform.cloud.coveo.com/rest/search', otherOptions?: ISearchEndpointOptions) {
    return SearchEndpoint.configureCloudEndpoint(organization, token, uri, otherOptions);
  }

  /**
   * Configure an endpoint to a Coveo on premise index.
   * @param uri The uri of your Coveo Search API endpoint. eg : http://myserver:8080/rest/search
   * @param token The token to use to execute query. If null, you will most probably need to login when querying (unless the search api is configured using advanced auth options, like windows auth or claims)
   * @param otherOptions A set of additional options to use when configuring this endpoint
   */
  static configureOnPremiseEndpoint(uri: string, token?: string, otherOptions?: ISearchEndpointOptions) {
    let merged = SearchEndpoint.mergeConfigOptions({
      restUri: uri,
      accessToken: token
    }, otherOptions);

    SearchEndpoint.endpoints['default'] = new SearchEndpoint(SearchEndpoint.removeUndefinedConfigOption(merged));
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
  private onUnload: (...args: any[]) => void;

  /**
   * Create a new SearchEndpoint.<br/>
   * Will use a set of sane default options, and merge them with the options parameter.<br/>
   * Will create an {@link EndpointCaller} and use it to communicate with the endpoint internally
   * @param options
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
   * Set a function which will allow external code to modify all endpoint call parameters before they are sent by the browser.
   *
   * Used in very specific scenario where the network infrastructure require special request headers to be added or removed, for example.
   * @param requestModifier
   */
  public setRequestModifier(requestModifier: (params: IRequestInfo<any>) => IRequestInfo<any>) {
    this.caller.options.requestModifier = requestModifier;
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
   * Get the uri that can be used to authenticate against the given provider
   * @param provider The provider name
   * @param returnUri The uri at which to return after the authentication is completed
   * @param message The message for authentication
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {string}
   */
  @path('/login/')
  @accessTokenInUrl()
  public getAuthenticationProviderUri(provider: string, returnUri?: string, message?: string, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): string {
    let queryString = this.buildBaseQueryString(callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    callParams.url += provider + '?';

    if (Utils.isNonEmptyString(returnUri)) {
      callParams.url += 'redirectUri=' + encodeURIComponent(returnUri) + '&';
    } else if (Utils.isNonEmptyString(message)) {
      callParams.url += 'message=' + encodeURIComponent(message) + '&';
    }
    callParams.url += callParams.queryString.join('&');
    return callParams.url;
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
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<IQueryResults>}
   */
  @path('/')
  @method('POST')
  @responseType('text')
  public search(query: IQuery, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IQueryResults> {
    Assert.exists(query);

    callParams.requestData = query;

    this.logger.info('Performing REST query', query);

    return this.performOneCall(callParams, callOptions).then((results?: IQueryResults) => {
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
    });
  }
  /**
   * Get a link/uri to download a set of results, for a given query, to an xlsx format.<br/>
   * Note : This does not download automatically the documents, merely provide an url at which to download them.
   * @param query The query for which to get the xlsx documents
   * @param numberOfResults The number of results that should be downloaded
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {string}
   */
  @path('/')
  @accessTokenInUrl()
  public getExportToExcelLink(query: IQuery, numberOfResults: number, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): string {
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
   * Get the raw datastream for a given document. This is typically used to get a thumbnail for a document.<br/>
   * Return an array buffer : <br/>
   * eg : let rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));<br/>
   * img.setAttribute('src', 'data:image/png;base64,' + btoa(rawBinary));
   * @param documentUniqueId Typically the {@link IQueryResult.uniqueId} on each result
   * @param dataStreamType Normally : '$Thumbnail'
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<TResult>|Promise<U>}
   */
  @path('/datastream')
  @accessTokenInUrl()
  @method('GET')
  @responseType('arraybuffer')
  public getRawDataStream(documentUniqueId: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions, callParams?: IEndpointCallParameters): Promise<ArrayBuffer> {
    Assert.exists(documentUniqueId);

    let queryString = this.buildViewAsHtmlQueryString(documentUniqueId, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    this.logger.info('Performing REST query for datastream ' + dataStreamType + ' on document uniqueID' + documentUniqueId);

    callParams.queryString.push('dataStream=' + dataStreamType);
    return this.performOneCall(callParams).then((results) => {
      this.logger.info('REST query successful', results, documentUniqueId);
      return results;
    });
  }

  /**
   * Return an url that will allow to see the datastream for a given document. This is typically used to get a thumbnail for a document.<br/>
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param dataStreamType Normally : '$Thumbnail'
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {string}
   */
  @path('/datastream')
  @accessTokenInUrl()
  public getViewAsDatastreamUri(documentUniqueID: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions, callParams?: IEndpointCallParameters): string {
    callOptions = _.extend({}, callOptions);

    let queryString = this.buildBaseQueryString(callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    queryString = this.buildCompleteQueryString(callOptions.query, callOptions.queryObject);
    callParams.queryString = callParams.queryString.concat(queryString);


    return callParams.url + '?' + callParams.queryString.join('&') + '&dataStream=' + encodeURIComponent(dataStreamType);
  }

  /**
   * Return a single document, using it's uniqueId
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<IQueryResult>}
   */
  @path('/document')
  @method('GET')
  @responseType('text')
  public getDocument(documentUniqueID: string, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IQueryResult> {
    let queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    return this.performOneCall<IQueryResult>(callParams);
  }

  /**
   * Return the content for a single document, as text.<br/>
   * Think : quickview
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<string>}
   */
  @path('/text')
  @method('GET')
  @responseType('text')
  public getDocumentText(documentUniqueID: string, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<string> {
    let queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    return this.performOneCall<{ content: string, duration: number }>(callParams)
      .then((data) => {
        return data.content;
      });
  }

  /**
   * Return the content for a single document, as an HTMLDocument.<br/>
   * Think : quickview
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<HTMLDocument>}
   */
  @path('/html')
  @method('POST')
  @responseType('document')
  public getDocumentHtml(documentUniqueID: string, callOptions?: IViewAsHtmlOptions, callParams?: IEndpointCallParameters): Promise<HTMLDocument> {
    callOptions = _.extend({}, callOptions);

    let queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
    callParams.queryString = callParams.queryString.concat(queryString);

    callParams.requestData = callOptions.queryObject || { q: callOptions.query };

    return this.performOneCall<HTMLDocument>(callParams);
  }

  /**
   * Return an url that will allow to see a single document content, as HTML.<br/>
   * Think : quickview
   * @param documentUniqueID Typically the {@link IQueryResult.uniqueId} on each result
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {string}
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
  public batchFieldValues(request: IListFieldValuesRequest, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IIndexFieldValue[]> {
    Assert.exists(request);

    return this.performOneCall<any>(callParams)
      .then((data) => {
        this.logger.info('REST list field values successful', data.values, request);
        return data.values;
      });
  }

  /**
   * List the possible values for a given request
   * @param request The request for which to list the possible field values
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<TResult>|Promise<U>}
   */
  @path('/values')
  @method('POST')
  @responseType('text')
  public listFieldValues(request: IListFieldValuesRequest, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IIndexFieldValue[]> {
    Assert.exists(request);

    callParams.requestData = request;

    this.logger.info('Listing field values', request);

    return this.performOneCall<any>(callParams)
      .then((data) => {
        this.logger.info('REST list field values successful', data.values, request);
        return data.values;
      });
  }

  /**
   * List all fields for the index, and return an array of their description
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<TResult>|Promise<U>}
   */
  @path('/fields')
  @method('GET')
  @responseType('text')
  public listFields(callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IFieldDescription[]> {
    this.logger.info('Listing fields');

    return this.performOneCall<IListFieldsResult>(callParams).then((data) => {
      return data.fields;
    });
  }

  /**
   * List all available query extensions for the search endpoint
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<IExtension[]>}
   */
  @path('/extensions')
  @method('GET')
  @responseType('text')
  public extensions(callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IExtension[]> {
    this.logger.info('Listing extensions');

    return this.performOneCall<IExtension[]>(callParams);
  }

  /**
   * Allow to rate a single document in the index (granted that collaborative rating is enabled on your index)
   * @param ratingRequest Document id and rating
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<boolean>|Promise<T>}
   */
  @path('/rating')
  @method('POST')
  @responseType('text')
  public rateDocument(ratingRequest: IRatingRequest, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<boolean> {
    this.logger.info('Rating a document', ratingRequest);

    callParams.requestData = ratingRequest;

    return this.performOneCall<any>(callParams).then(() => {
      return true;
    });
  }

  /**
   * Allow to tag a single document
   * @param taggingRequest Document id and tag action to perform
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<boolean>|Promise<T>}
   */
  @path('/tag')
  @method('POST')
  @responseType('text')
  public tagDocument(taggingRequest: ITaggingRequest, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<boolean> {
    this.logger.info('Tagging a document', taggingRequest);

    callParams.requestData = taggingRequest;

    return this.performOneCall<any>(callParams).then(() => {
      return true;
    });
  }

  /**
   * Returns a list of Coveo Machine Learning query suggestions, based on the given request
   * @param request query and number of suggestions to return
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<IRevealQuerySuggestResponse>}
   */
  @path('/querySuggest')
  @method('GET')
  @responseType('text')
  public getRevealQuerySuggest(request: IRevealQuerySuggestRequest, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<IRevealQuerySuggestResponse> {
    this.logger.info('Get Reveal Query Suggest', request);

    callParams.requestData = request;

    return this.performOneCall<IRevealQuerySuggestResponse>(callParams);
  }

  /**
   * Allow to follow a document or a query on the search alerts service
   * @param request
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<ISubscription>}
   */
  @alertsPath('/subscriptions')
  @accessTokenInUrl('accessToken')
  @method('POST')
  @requestDataType('application/json')
  @responseType('text')
  public follow(request: ISubscriptionRequest, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<ISubscription> {
    callParams.requestData = request;

    this.logger.info('Following a document or a query', request);

    return this.performOneCall<ISubscription>(callParams);
  }

  private currentListSubscriptions: Promise<ISubscription[]>;

  /**
   * Return a Promise of array of current subscriptions
   * @param page The page of the subsctiptions
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {any}
   */
  @alertsPath('/subscriptions')
  @accessTokenInUrl('accessToken')
  @method('GET')
  @requestDataType('application/json')
  @responseType('text')
  public listSubscriptions(page: number, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters) {
    if (this.options.isGuestUser) {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
    if (this.currentListSubscriptions == null) {
      callParams.queryString.push('page=' + (page || 0));

      this.currentListSubscriptions = this.performOneCall<ISubscription[]>(callParams);
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
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<ISubscription>}
   */
  @alertsPath('/subscriptions/')
  @accessTokenInUrl('accessToken')
  @method('PUT')
  @requestDataType('application/json')
  @responseType('text')
  public updateSubscription(subscription: ISubscription, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<ISubscription> {
    callParams.requestData = subscription;

    this.logger.info('Updating a subscription', subscription);

    callParams.url += subscription.id;

    return this.performOneCall<ISubscription>(callParams);
  }

  /**
   * Delete a subscription
   * @param subscription The subscription to delete
   * @param callOptions Additional set of options to use for this call.
   * @param callParams Options injected by the applied decorators.
   * @returns {Promise<ISubscription>}
   */
  @alertsPath('/subscriptions/')
  @accessTokenInUrl('accessToken')
  @method('DELETE')
  @requestDataType('application/json')
  @responseType('text')
  public deleteSubscription(subscription: ISubscription, callOptions?: IEndpointCallOptions, callParams?: IEndpointCallParameters): Promise<ISubscription> {
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

  // see https://github.com/palantir/tslint/issues/1421
  // tslint:disable-next-line:no-unused-variable
  private buildAccessToken(tokenKey: string): string[] {
    let queryString: string[] = [];

    if (Utils.isNonEmptyString(this.options.accessToken)) {
      queryString.push(tokenKey + '=' + encodeURIComponent(this.options.accessToken));
    }

    return queryString;
  }

  private buildBaseQueryString(callOptions?: IEndpointCallOptions): string[] {
    callOptions = _.extend({}, callOptions);
    let queryString: string[] = [];

    for (let name in this.options.queryStringArguments) {
      queryString.push(name + '=' + encodeURIComponent(this.options.queryStringArguments[name]));
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
      _.each(['q', 'aq', 'cq', 'dq', 'searchHub', 'tab', 'language', 'pipeline', 'lowercaseOperators'], (key) => {
        if (queryObject[key]) {
          queryString.push(key + '=' + encodeURIComponent(queryObject[key]));
        }
      });

      _.each(queryObject.context, (value, key) => {
        queryString.push('context[' + key + ']=' + encodeURIComponent(value));
      });

      if (queryObject.fieldsToInclude) {
        queryString.push(`fieldsToInclude=[${_.map(queryObject.fieldsToInclude, (field) => '"' + encodeURIComponent(field.replace('@', '')) + '"').join(',')}]`);
      }

    } else if (query) {
      queryString.push('q=' + encodeURIComponent(query));
    }

    return queryString;
  }

  private buildViewAsHtmlQueryString(uniqueId: string, callOptions?: IViewAsHtmlOptions): string[] {
    callOptions = _.extend({}, callOptions);
    let queryString: string[] = this.buildBaseQueryString(callOptions);
    queryString.push('uniqueId=' + encodeURIComponent(uniqueId));

    if (callOptions.query || callOptions.queryObject) {
      queryString.push('enableNavigation=true');
    }

    if (callOptions.requestedOutputSize) {
      queryString.push('requestedOutputSize=' + encodeURIComponent(callOptions.requestedOutputSize.toString()));
    }

    if (callOptions.contentType) {
      queryString.push('contentType=' + encodeURIComponent(callOptions.contentType));
    }
    return queryString;
  }

  private performOneCall<T>(params: IEndpointCallParameters, callOptions?: IEndpointCallOptions, autoRenewToken = true): Promise<T> {
    let queryString = this.buildBaseQueryString(callOptions);
    params.queryString = params.queryString.concat(queryString);
    params.queryString = _.uniq(params.queryString);

    return this.caller.call(params)
      .then((response?: ISuccessResponse<T>) => {
        if (response.data && (<any>response.data).clientDuration) {
          (<any>response.data).clientDuration = response.duration;
        }
        return response.data;
      }).catch((error?: IErrorResponse) => {
        if (autoRenewToken && this.canRenewAccessToken() && this.isAccessTokenExpiredStatus(error.statusCode)) {
          this.renewAccessToken().then(() => {
            return this.performOneCall(params, callOptions, autoRenewToken);
          })
            .catch(() => {
              return Promise.reject(this.handleErrorResponse(error));
            });
        } else if (error.statusCode == 0 && this.isRedirecting) {
          // The page is getting redirected
          // Set timeout on return with empty string, since it does not really matter
          _.defer(function () {
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
    return this.options.renewAccessToken().then((token: string) => {
      Assert.isNonEmptyString(token);
      this.options.accessToken = token;
      this.createEndpointCaller();
      return token;
    }).catch((e: string) => {
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


function path(path: string) {
  return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    let originalMethod = descriptor.value;
    let nbParams = target[key].prototype.constructor.length;

    descriptor.value = function (...args: any[]) {
      let uri = this.buildBaseUri(path);
      if (args[nbParams - 1]) {
        args[nbParams - 1].url = uri;
      } else {
        let params: IEndpointCallParameters = {
          url: uri,
          queryString: [],
          requestData: {},
          method: '',
          responseType: '',
          errorsAsSuccess: false
        };
        args[nbParams - 1] = params;
      }
      let result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}

function alertsPath(path: string) {
  return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    let originalMethod = descriptor.value;
    let nbParams = target[key].prototype.constructor.length;

    descriptor.value = function (...args: any[]) {
      let uri = this.buildSearchAlertsUri(path);
      if (args[nbParams - 1]) {
        args[nbParams - 1].url = uri;
      } else {
        let params: IEndpointCallParameters = {
          url: uri,
          queryString: [],
          requestData: {},
          method: '',
          responseType: '',
          errorsAsSuccess: false
        };
        args[nbParams - 1] = params;
      }
      let result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}

function requestDataType(type: string) {
  return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    let originalMethod = descriptor.value;
    let nbParams = target[key].prototype.constructor.length;

    descriptor.value = function (...args: any[]) {
      if (args[nbParams - 1]) {
        args[nbParams - 1].requestDataType = type;
      } else {
        let params: IEndpointCallParameters = {
          url: '',
          queryString: [],
          requestData: {},
          requestDataType: type,
          method: '',
          responseType: '',
          errorsAsSuccess: false
        };
        args[nbParams - 1] = params;
      }
      let result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}

function method(met: string) {
  return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    let originalMethod = descriptor.value;
    let nbParams = target[key].prototype.constructor.length;

    descriptor.value = function (...args: any[]) {
      if (args[nbParams - 1]) {
        args[nbParams - 1].method = met;
      } else {
        let params: IEndpointCallParameters = {
          url: '',
          queryString: [],
          requestData: {},
          method: met,
          responseType: '',
          errorsAsSuccess: false
        };
        args[nbParams - 1] = params;
      }
      let result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}

function responseType(resp: string) {
  return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    let originalMethod = descriptor.value;
    let nbParams = target[key].prototype.constructor.length;

    descriptor.value = function (...args: any[]) {
      if (args[nbParams - 1]) {
        args[nbParams - 1].responseType = resp;
      } else {
        let params: IEndpointCallParameters = {
          url: '',
          queryString: [],
          requestData: {},
          method: '',
          responseType: resp,
          errorsAsSuccess: false
        };
        args[nbParams - 1] = params;
      }
      let result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}

function accessTokenInUrl(tokenKey: string = 'access_token') {
  return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    let originalMethod = descriptor.value;
    let nbParams = target[key].prototype.constructor.length;

    descriptor.value = function (...args: any[]) {
      let queryString = this.buildAccessToken(tokenKey);
      if (args[nbParams - 1]) {
        args[nbParams - 1].queryString = args[nbParams - 1].queryString.concat(queryString);
      } else {
        let params: IEndpointCallParameters = {
          url: '',
          queryString: queryString,
          requestData: {},
          method: '',
          responseType: '',
          errorsAsSuccess: false
        };
        args[nbParams - 1] = params;
      }
      let result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}
