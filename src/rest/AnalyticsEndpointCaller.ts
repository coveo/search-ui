import { IEndpointCaller, IEndpointCallerOptions, ISuccessResponse, IEndpointCallParameters, EndpointCaller } from './EndpointCaller';
import { UrlUtils } from '../utils/UrlUtils';

export class AnalyticsEndpointCaller implements IEndpointCaller {
  private passthrough: EndpointCaller;

  constructor(public options: IEndpointCallerOptions = {}) {
    this.passthrough = new EndpointCaller(options);
  }

  public call<T>(params: IEndpointCallParameters): Promise<ISuccessResponse<T>> {
    if (this.shouldSendAsBeacon(params)) {
      this.sendBeacon(params);
      return;
    }

    return this.passthrough.call(params);
  }

  private get beaconApiIsUsable() {
    return typeof navigator.sendBeacon === 'function';
  }

  private sendBeacon(params: IEndpointCallParameters) {
    const queryAsString = params.queryString.concat(this.additionalQueryStringParams);
    const url = UrlUtils.normalizeAsString({ paths: params.url, queryAsString });
    const data = EndpointCaller.convertJsonToFormBody({ clickEvent: params.requestData });
    navigator.sendBeacon(url, new Blob([data], { type: 'application/x-www-form-urlencoded' }));
  }

  private get additionalQueryStringParams() {
    const tokenParam = this.accessTokenAsQueryString;
    return tokenParam ? [tokenParam] : [];
  }

  private get accessTokenAsQueryString() {
    const token = this.options.accessToken;
    return token ? `access_token=${token}` : '';
  }

  private shouldSendAsBeacon(params: IEndpointCallParameters): boolean {
    return params.url.indexOf('/click') != -1 && this.beaconApiIsUsable;
  }
}
