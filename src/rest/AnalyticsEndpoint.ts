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
import { AccessToken } from './AccessToken';

export interface IAnalyticsEndpointOptions {
  accessToken: AccessToken;
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
      accessToken: this.options.accessToken.token
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

  private async sendToService<D, R>(data: D, path: string, paramName: string): Promise<R> {
    const versionToCall = AnalyticsEndpoint.CUSTOM_ANALYTICS_VERSION || AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION;
    const urlNormalized = UrlUtils.normalizeAsParts({
      paths: [this.options.serviceUrl, '/rest/', versionToCall, '/analytics/', path],
      query: {
        org: this.organization,
        visitorId: Cookie.get('visitorId')
      }
    });
    // We use pendingRequest because we don't want to have 2 request to analytics at the same time.
    // Otherwise the cookie visitId won't be set correctly.
    if (AnalyticsEndpoint.pendingRequest != null) {
      try {
        await AnalyticsEndpoint.pendingRequest;
      } finally {
        return this.sendToService<D, R>(data, path, paramName);
      }
    }

    const request: Promise<any> = (AnalyticsEndpoint.pendingRequest = this.endpointCaller.call<R>({
      errorsAsSuccess: false,
      method: 'POST',
      queryString: urlNormalized.queryNormalized,
      requestData: data,
      url: urlNormalized.path,
      responseType: 'text',
      requestDataType: 'application/json'
    }));

    try {
      const results = await request;
      AnalyticsEndpoint.pendingRequest = null;
      this.handleAnalyticsEventResponse(results.data);
      return results.data;
    } catch (error) {
      AnalyticsEndpoint.pendingRequest = null;
      if (this.options.accessToken.isExpired(error)) {
        const successfullyRenewed = await this.options.accessToken.doRenew();
        if (successfullyRenewed) {
          return this.sendToService<D, R>(data, path, paramName);
        }
      }

      throw error;
    }
  }

  private getFromService<T>(url: string, params: IStringMap<string>): Promise<T> {
    const paramsToSend = { ...params, access_token: this.options.accessToken.token };
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
