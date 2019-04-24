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
    const url = UrlUtils.normalizeAsString({
      paths: params.url,
      queryAsString: params.queryString.concat(`access_token=${this.options.accessToken}`)
    });
    const data = EndpointCaller.convertJsonToFormBody({ clickEvent: params.requestData });
    navigator.sendBeacon(url, new Blob([data], { type: 'application/x-www-form-urlencoded' }));
  }

  private shouldSendAsBeacon(params: IEndpointCallParameters): boolean {
    return params.url.indexOf('/click') != -1 && this.beaconApiIsUsable;
  }
}
