import { Logger } from '../misc/Logger';
import { EndpointCaller, IEndpointCallerOptions } from '../rest/EndpointCaller';
import { IAPIAnalyticsVisitResponseRest } from './APIAnalyticsVisitResponse';
import { IErrorResponse } from '../rest/EndpointCaller';
import { IAPIAnalyticsSearchEventsResponse } from '../rest/APIAnalyticsSearchEventsResponse';
import { ISearchEvent } from '../rest/SearchEvent';
import { IClickEvent } from '../rest/ClickEvent';
import { IAPIAnalyticsEventResponse } from './APIAnalyticsEventResponse';
import { Assert } from '../misc/Assert';
import { ICustomEvent } from './CustomEvent';
import { ITopQueries } from './TopQueries';
import { Cookie } from '../utils/CookieUtils';
import { ISuccessResponse } from '../rest/EndpointCaller';
import { IStringMap } from '../rest/GenericParam';
import * as _ from 'underscore';
import { Utils } from '../utils/Utils';
import { UrlUtils } from '../utils/UrlUtils';

export interface IAnalyticsEndpointOptions {
  token: string;
  serviceUrl: string;
  organization: string;
}

export class AnalyticsEndpoint {
  logger: Logger;

  static DEFAULT_ANALYTICS_URI = 'https://usageanalytics.coveo.com';
  static DEFAULT_ANALYTICS_VERSION = 'v15';
  static CUSTOM_ANALYTICS_VERSION = undefined;
  static VISITOR_COOKIE_TIME = 10000 * 24 * 60 * 60 * 1000;

  static pendingRequest: Promise<any>;

  private visitId: string;
  private organization: string;
  public endpointCaller: EndpointCaller;

  constructor(public options: IAnalyticsEndpointOptions) {
    this.logger = new Logger(this);

    const endpointCallerOptions: IEndpointCallerOptions = {
      accessToken: this.options.token && this.options.token != '' ? this.options.token : null
    };
    this.endpointCaller = new EndpointCaller(endpointCallerOptions);
    this.organization = options.organization;
  }

  public getCurrentVisitId(): string {
    return this.visitId;
  }

  public getCurrentVisitIdPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.getCurrentVisitId()) {
        resolve(this.getCurrentVisitId());
      } else {
        const url = this.buildAnalyticsUrl('/analytics/visit');
        this.getFromService<IAPIAnalyticsVisitResponseRest>(url, {})
          .then((response: IAPIAnalyticsVisitResponseRest) => {
            this.visitId = response.id;
            resolve(this.visitId);
          })
          .catch((response: IErrorResponse) => {
            reject(response);
          });
      }
    });
  }

  public sendSearchEvents(searchEvents: ISearchEvent[]): Promise<IAPIAnalyticsSearchEventsResponse> {
    if (searchEvents.length > 0) {
      this.logger.info('Logging analytics search events', searchEvents);
      return this.sendToService<ISearchEvent[], IAPIAnalyticsSearchEventsResponse>(searchEvents, 'searches', 'searchEvents');
    }
  }

  public sendDocumentViewEvent(documentViewEvent: IClickEvent): Promise<IAPIAnalyticsEventResponse> {
    Assert.exists(documentViewEvent);
    this.logger.info('Logging analytics document view', documentViewEvent);
    return this.sendToService(documentViewEvent, 'click', 'clickEvent');
  }

  public sendCustomEvent(customEvent: ICustomEvent) {
    Assert.exists(customEvent);
    this.logger.info('Logging analytics custom event', customEvent);
    return this.sendToService(customEvent, 'custom', 'customEvent');
  }

  public getTopQueries(params: ITopQueries): Promise<string[]> {
    const url = this.buildAnalyticsUrl('/stats/topQueries');
    return this.getFromService<string[]>(url, params);
  }

  private sendToService<D, R>(data: D, path: string, paramName: string): Promise<R> {
    const versionToCall = AnalyticsEndpoint.CUSTOM_ANALYTICS_VERSION || AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION;
    const url = UrlUtils.normalizeAsString({
      paths: [this.options.serviceUrl, '/rest/', versionToCall, '/analytics/', path],
      query: {
        org: this.organization,
        visitorId: Cookie.get('visitorId')
      }
    });

    // We use pendingRequest because we don't want to have 2 request to analytics at the same time.
    // Otherwise the cookie visitId won't be set correctly.
    if (AnalyticsEndpoint.pendingRequest == null) {
      AnalyticsEndpoint.pendingRequest = this.endpointCaller
        .call<R>({
          errorsAsSuccess: false,
          method: 'POST',
          queryString: [],
          requestData: data,
          url: url,
          responseType: 'text',
          requestDataType: 'application/json'
        })
        .then((res: ISuccessResponse<R>) => {
          return this.handleAnalyticsEventResponse(<any>res.data);
        })
        .finally(() => {
          AnalyticsEndpoint.pendingRequest = null;
        });
      return AnalyticsEndpoint.pendingRequest;
    } else {
      return AnalyticsEndpoint.pendingRequest.finally(() => {
        return this.sendToService<D, R>(data, path, paramName);
      });
    }
  }

  private getFromService<T>(url: string, params: IStringMap<string>): Promise<T> {
    const paramsToSend = this.options.token && this.options.token != '' ? _.extend({ access_token: this.options.token }, params) : params;
    return this.endpointCaller
      .call<T>({
        errorsAsSuccess: false,
        method: 'GET',
        queryString: this.options.organization ? ['org=' + Utils.safeEncodeURIComponent(this.options.organization)] : [],
        requestData: paramsToSend,
        responseType: 'json',
        url: url
      })
      .then((res: ISuccessResponse<T>) => {
        return res.data;
      });
  }

  private handleAnalyticsEventResponse(response: IAPIAnalyticsEventResponse | IAPIAnalyticsSearchEventsResponse) {
    let visitId: string;
    let visitorId: string;

    if (response['visitId']) {
      visitId = response['visitId'];
      visitorId = response['visitorId'];
    } else if (response['searchEventResponses']) {
      visitId = (<IAPIAnalyticsEventResponse>_.first(response['searchEventResponses'])).visitId;
      visitorId = (<IAPIAnalyticsEventResponse>_.first(response['searchEventResponses'])).visitorId;
    }

    if (visitId) {
      this.visitId = visitId;
    }
    if (visitorId) {
      Cookie.set('visitorId', visitorId, AnalyticsEndpoint.VISITOR_COOKIE_TIME);
    }

    return response;
  }

  private buildAnalyticsUrl(path: string) {
    return UrlUtils.normalizeAsString({
      paths: [
        this.options.serviceUrl,
        '/rest/',
        AnalyticsEndpoint.CUSTOM_ANALYTICS_VERSION || AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION,
        path
      ]
    });
  }
}
