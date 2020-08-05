import { first } from 'underscore';
import { Assert } from '../misc/Assert';
import { Logger } from '../misc/Logger';
import { IAPIAnalyticsSearchEventsResponse } from '../rest/APIAnalyticsSearchEventsResponse';
import { IClickEvent } from '../rest/ClickEvent';
import { IEndpointCallerOptions, IErrorResponse, ISuccessResponse } from '../rest/EndpointCaller';
import { AnalyticsEndpointCaller } from '../rest/AnalyticsEndpointCaller';
import { IStringMap } from '../rest/GenericParam';
import { ISearchEvent } from '../rest/SearchEvent';
import { Cookie } from '../utils/CookieUtils';
import { UrlUtils, IUrlNormalizedParts } from '../utils/UrlUtils';
import { Utils } from '../utils/Utils';
import { AccessToken } from './AccessToken';
import { IAPIAnalyticsEventResponse } from './APIAnalyticsEventResponse';
import { IAPIAnalyticsVisitResponseRest } from './APIAnalyticsVisitResponse';
import { ICustomEvent } from './CustomEvent';
import { ITopQueries } from './TopQueries';
import { SearchEndpoint } from '../rest/SearchEndpoint';

export interface IAnalyticsEndpointOptions {
  accessToken: AccessToken;
  serviceUrl: string;
  organization: string;
}

export class AnalyticsEndpoint {
  logger: Logger;

  static DEFAULT_ANALYTICS_URI = 'https://platform.cloud.coveo.com/rest/ua';
  static DEFAULT_ANALYTICS_VERSION = 'v15';
  static CUSTOM_ANALYTICS_VERSION = undefined;
  static VISITOR_COOKIE_TIME = 365 * 24 * 60 * 60 * 1000;

  static pendingRequest: Promise<any>;

  private visitId: string;
  private organization: string;
  public endpointCaller: AnalyticsEndpointCaller;

  constructor(public options: IAnalyticsEndpointOptions) {
    this.logger = new Logger(this);

    const endpointCallerOptions: IEndpointCallerOptions = {
      accessToken: this.options.accessToken.token
    };

    this.endpointCaller = new AnalyticsEndpointCaller(endpointCallerOptions);
    this.organization = options.organization;
  }

  public static getURLFromSearchEndpoint(endpoint: SearchEndpoint): string {
    if (!endpoint || !endpoint.options || !endpoint.options.restUri) {
      return this.DEFAULT_ANALYTICS_URI;
    }

    const [basePlatform] = endpoint.options.restUri.split('/rest');
    return basePlatform + '/rest/ua';
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
      return this.sendToService(searchEvents, 'searches', 'searchEvents');
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

  private async sendToService(data: Record<string, any>, path: string, paramName: string): Promise<any> {
    // We use pendingRequest because we don't want to have 2 request to analytics at the same time.
    // Otherwise the cookie visitId won't be set correctly.
    if (AnalyticsEndpoint.pendingRequest != null) {
      await AnalyticsEndpoint.pendingRequest;
    }

    const url = this.getURL(path);
    const request = this.executeRequest(url, data);

    try {
      const results = await request;
      AnalyticsEndpoint.pendingRequest = null;
      this.handleAnalyticsEventResponse(results.data);
      return results.data;
    } catch (error) {
      AnalyticsEndpoint.pendingRequest = null;
      if (this.isAnalyticsTokenExpired(error)) {
        const successfullyRenewed = await this.options.accessToken.doRenew();
        if (successfullyRenewed) {
          return this.sendToService(data, path, paramName);
        }
      }

      throw error;
    }
  }

  private isAnalyticsTokenExpired(error: IErrorResponse) {
    return error != null && error.statusCode === 400 && error.data && error.data.type === 'InvalidToken';
  }

  private executeRequest(
    urlNormalized: IUrlNormalizedParts,
    data: Record<string, any>
  ): Promise<ISuccessResponse<IAPIAnalyticsEventResponse>> {
    const request = this.endpointCaller.call<IAPIAnalyticsEventResponse>({
      errorsAsSuccess: false,
      method: 'POST',
      queryString: urlNormalized.queryNormalized,
      requestData: data,
      url: urlNormalized.path,
      responseType: 'text',
      requestDataType: 'application/json'
    });

    if (request) {
      AnalyticsEndpoint.pendingRequest = request;
      return request;
    }

    // In some case, (eg: using navigator.sendBeacon), there won't be any response to read from the service
    // In those case, send back an empty object upstream.
    return Promise.resolve({
      data: {
        visitId: '',
        visitorId: ''
      },
      duration: 0
    });
  }

  private getURL(path: string): IUrlNormalizedParts {
    const versionToCall = AnalyticsEndpoint.CUSTOM_ANALYTICS_VERSION || AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION;
    const urlNormalized = UrlUtils.normalizeAsParts({
      paths: [this.options.serviceUrl, versionToCall, '/analytics/', path],
      query: {
        org: this.organization,
        visitor: Cookie.get('visitorId')
      }
    });
    return urlNormalized;
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
      visitId = (<IAPIAnalyticsEventResponse>first(response['searchEventResponses'])).visitId;
      visitorId = (<IAPIAnalyticsEventResponse>first(response['searchEventResponses'])).visitorId;
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
      paths: [this.options.serviceUrl, AnalyticsEndpoint.CUSTOM_ANALYTICS_VERSION || AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION, path]
    });
  }
}
