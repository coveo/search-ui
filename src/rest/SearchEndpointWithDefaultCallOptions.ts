import {
  ISearchEndpoint,
  IEndpointCallOptions,
  IGetDocumentOptions,
  ISearchEndpointOptions,
  IViewAsHtmlOptions
} from './SearchEndpointInterface';
import { IQuery } from './Query';
import { ITaggingRequest } from './TaggingRequest';
import { IRatingRequest } from './RatingRequest';
import { IQuerySuggestRequest } from './QuerySuggest';
import { IQuerySuggestResponse } from './QuerySuggest';
import { IIndexFieldValue } from '../rest/FieldValue';
import { IQueryResult } from '../rest/QueryResult';
import { IEndpointError } from '../rest/EndpointError';
import { IExtension } from '../rest/Extension';
import { IQueryResults } from './QueryResults';
import { IFieldDescription } from '../rest/FieldDescription';
import { IListFieldValuesRequest } from './ListFieldValuesRequest';
import { ISubscriptionRequest, ISubscription } from './Subscription';
import { ISentryLog } from './SentryLog';
import * as _ from 'underscore';

export class SearchEndpointWithDefaultCallOptions implements ISearchEndpoint {
  options: ISearchEndpointOptions;

  constructor(private endpoint: ISearchEndpoint, private callOptions?: IEndpointCallOptions) {
    this.options = endpoint.options;
  }

  public getBaseUri(): string {
    return this.endpoint.getBaseUri();
  }

  public getBaseAlertsUri(): string {
    return this.endpoint.getBaseAlertsUri();
  }

  public getAuthenticationProviderUri(provider: string, returnUri: string, message: string): string {
    return this.endpoint.getAuthenticationProviderUri(provider, returnUri, message);
  }

  public isJsonp(): boolean {
    return this.endpoint.isJsonp();
  }

  public search(query: IQuery, callOptions?: IEndpointCallOptions): Promise<IQueryResults> {
    return this.endpoint.search(query, this.enrichCallOptions(callOptions));
  }

  public getExportToExcelLink(query: IQuery, numberOfResults: number, callOptions?: IEndpointCallOptions): string {
    return this.endpoint.getExportToExcelLink(query, numberOfResults, this.enrichCallOptions(callOptions));
  }

  public tagDocument(taggingRequest: ITaggingRequest, callOptions?: IEndpointCallOptions): Promise<boolean> {
    return this.endpoint.tagDocument(taggingRequest, this.enrichCallOptions(callOptions));
  }

  public getQuerySuggest(request: IQuerySuggestRequest, callOptions?: IEndpointCallOptions): Promise<IQuerySuggestResponse> {
    return this.endpoint.getQuerySuggest(request, this.enrichCallOptions(callOptions));
  }

  public rateDocument(ratingRequest: IRatingRequest, callOptions?: IEndpointCallOptions): Promise<boolean> {
    return this.endpoint.rateDocument(ratingRequest, this.enrichCallOptions(callOptions));
  }

  public getRawDataStream(documentUniqueId: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions): Promise<ArrayBuffer> {
    return this.endpoint.getRawDataStream(documentUniqueId, dataStreamType, this.enrichCallOptions(callOptions));
  }

  public getDocument(documentUniqueId: string, callOptions?: IGetDocumentOptions): Promise<IQueryResult> {
    return this.endpoint.getDocument(documentUniqueId, this.enrichCallOptions(callOptions));
  }

  public getDocumentText(documentUniqueID: string, callOptions?: IEndpointCallOptions): Promise<string> {
    return this.endpoint.getDocumentText(documentUniqueID, this.enrichCallOptions(callOptions));
  }

  public getDocumentHtml(documentUniqueID: string, callOptions?: IViewAsHtmlOptions): Promise<HTMLDocument> {
    return this.endpoint.getDocumentHtml(documentUniqueID, this.enrichCallOptions(callOptions));
  }

  public getViewAsHtmlUri(documentUniqueID: string, callOptions?: IViewAsHtmlOptions): string {
    return this.endpoint.getViewAsHtmlUri(documentUniqueID, this.enrichCallOptions(callOptions));
  }

  public getViewAsDatastreamUri(documentUniqueID: string, dataStreamType: string, callOptions?: IViewAsHtmlOptions): string {
    return this.endpoint.getViewAsDatastreamUri(documentUniqueID, dataStreamType, this.enrichCallOptions(callOptions));
  }

  public listFieldValues(request: IListFieldValuesRequest, callOptions?: IEndpointCallOptions): Promise<IIndexFieldValue[]> {
    return this.endpoint.listFieldValues(request, this.enrichCallOptions(callOptions));
  }

  public listFields(callOptions?: IEndpointCallOptions): Promise<IFieldDescription[]> {
    return this.endpoint.listFields(this.enrichCallOptions(callOptions));
  }

  public extensions(callOptions?: IEndpointCallOptions): Promise<IExtension[]> | Promise<IEndpointError> {
    return this.endpoint.extensions(this.enrichCallOptions(callOptions));
  }

  public follow(request: ISubscriptionRequest): Promise<ISubscription> {
    return this.endpoint.follow(request);
  }

  public listSubscriptions(page: number): Promise<ISubscription[]> {
    return this.endpoint.listSubscriptions(page);
  }

  public updateSubscription(subscription: ISubscription): Promise<ISubscription> {
    return this.endpoint.updateSubscription(subscription);
  }

  public deleteSubscription(subscription: ISubscription): Promise<ISubscription> {
    return this.endpoint.deleteSubscription(subscription);
  }

  public logError(sentryLog: ISentryLog): Promise<boolean> {
    return this.endpoint.logError(sentryLog);
  }

  private enrichCallOptions<T extends IEndpointCallOptions>(callOptions?: T): T {
    return _.extend({}, callOptions, this.callOptions);
  }
}
