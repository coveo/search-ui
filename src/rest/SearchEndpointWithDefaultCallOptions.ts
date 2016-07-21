import {ISearchEndpoint, IEndpointCallOptions, IGetDocumentOptions, ISearchEndpointOptions, IViewAsHtmlOptions} from './SearchEndpointInterface';
import {IQuery} from './Query';
import {ITaggingRequest} from './TaggingRequest';
import {IRatingRequest} from './RatingRequest';
import {IRevealQuerySuggestRequest, IRevealQuerySuggestResponse} from './RevealQuerySuggest';
import {IListFieldValuesRequest} from './ListFieldValuesRequest';
import {ISubscriptionRequest, ISubscription} from './Subscription';
import {IQueryResults} from './QueryResults';
import {IQueryResult} from './QueryResult';
import {IIndexFieldValue} from './FieldValue';
import {IFieldDescription} from './FieldDescription';
import {IExtension} from './Extension';
import {IEndpointError} from './EndpointError';
import _ = require('underscore');

export class SearchEndpointWithDefaultCallOptions implements ISearchEndpoint {
  options: ISearchEndpointOptions;

  constructor(private endpoint: ISearchEndpoint, private callOptions?: IEndpointCallOptions) {
    this.options = endpoint.options;
  }

  public getBaseUri() {
    return this.endpoint.getBaseUri();
  }

  public getBaseAlertsUri() {
    return this.endpoint.getBaseAlertsUri();
  }

  public getAuthenticationProviderUri(provider: string, returnUri: string, message: string): string {
    return this.endpoint.getAuthenticationProviderUri(provider, returnUri, message);
  }

  public isJsonp(): boolean {
    return this.endpoint.isJsonp();
  }

  public search(query: IQuery, callOptions?: IEndpointCallOptions) {
    return this.endpoint.search(query, this.enrichCallOptions(callOptions));
  }

  public getExportToExcelLink(query: IQuery, numberOfResults: number, callOptions?: IEndpointCallOptions): string {
    return this.endpoint.getExportToExcelLink(query, numberOfResults, this.enrichCallOptions(callOptions));
  }

  public tagDocument(taggingRequest: ITaggingRequest, callOptions?: IEndpointCallOptions) {
    return this.endpoint.tagDocument(taggingRequest, this.enrichCallOptions(taggingRequest));
  }

  public getRevealQuerySuggest(request: IRevealQuerySuggestRequest, callOptions?: IEndpointCallOptions) {
    return this.endpoint.getRevealQuerySuggest(request, this.enrichCallOptions(callOptions));
  }

  public rateDocument(ratingRequest: IRatingRequest, callOptions?: IEndpointCallOptions) {
    return this.endpoint.rateDocument(ratingRequest, this.enrichCallOptions(callOptions));
  }

  public getRawDataStream(documentUniqueId: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions) {
    return this.endpoint.getRawDataStream(documentUniqueId, dataStreamType, this.enrichCallOptions(callOptions));
  }

  public getDocument(documentUniqueId: string, callOptions?: IGetDocumentOptions) {
    return this.endpoint.getDocument(documentUniqueId, this.enrichCallOptions(callOptions));
  }

  public getDocumentText(documentUniqueID: string, callOptions?: IEndpointCallOptions) {
    return this.endpoint.getDocumentText(documentUniqueID, this.enrichCallOptions(callOptions));
  }

  public getDocumentHtml(documentUniqueID: string, callOptions?: IViewAsHtmlOptions) {
    return this.endpoint.getDocumentHtml(documentUniqueID, this.enrichCallOptions(callOptions));
  }

  public getViewAsHtmlUri(documentUniqueID: string, callOptions?: IViewAsHtmlOptions): string {
    return this.endpoint.getViewAsHtmlUri(documentUniqueID, this.enrichCallOptions(callOptions));
  }

  public getViewAsDatastreamUri(documentUniqueID: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions): string {
    return this.endpoint.getViewAsDatastreamUri(documentUniqueID, dataStreamType, this.enrichCallOptions(callOptions));
  }

  public listFieldValues(request: IListFieldValuesRequest, callOptions?: IEndpointCallOptions) {
    return this.endpoint.listFieldValues(request, this.enrichCallOptions(callOptions));
  }

  public listFields(callOptions?: IEndpointCallOptions) {
    return this.endpoint.listFields(this.enrichCallOptions(callOptions));
  }

  public extensions(callOptions?: IEndpointCallOptions) {
    return this.endpoint.extensions(this.enrichCallOptions(callOptions));
  }

  public follow(request: ISubscriptionRequest) {
    return this.endpoint.follow(request);
  }

  public listSubscriptions(page: number) {
    return this.endpoint.listSubscriptions(page);
  }

  public updateSubscription(subscription: ISubscription) {
    return this.endpoint.updateSubscription(subscription);
  }

  public deleteSubscription(subscription: ISubscription) {
    return this.endpoint.deleteSubscription(subscription);
  }

  private enrichCallOptions<T extends IEndpointCallOptions>(callOptions?: T): T {
    return _.extend({}, callOptions, this.callOptions);
  }
}
