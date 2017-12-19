import { IStringMap } from '../rest/GenericParam';
import { Logger } from '../misc/Logger';
import { Assert } from '../misc/Assert';
import { TimeSpan } from '../utils/TimeSpanUtils';
import { DeviceUtils } from '../utils/DeviceUtils';
import { Utils } from '../utils/Utils';
import { JQueryUtils } from '../utils/JQueryutils';
import * as _ from 'underscore';

declare const XDomainRequest;

/**
 * Parameters that can be used when calling an {@link EndpointCaller}
 */
export interface IEndpointCallParameters {
  /**
   * Url to target
   */
  url: string;
  /**
   * Array of query string params.<br/>
   * eg: ['foo=1','bar=2']
   */
  queryString: string[];
  /**
   * Body of the request.<br/>
   * key -> value map (JSON)
   */
  requestData: IStringMap<any>;
  /**
   * Request data type.<br/>
   * eg: "application/json", "application/x-www-form-urlencoded; charset=\"UTF-8\""
   */
  requestDataType?: string;
  /**
   * Or HTTP verb : GET, POST, PUT, etc.
   */
  method: string;
  /**
   * responseType of the request.</br>
   * eg: "text", "arraybuffer" etc.
   */
  responseType: string;
  /**
   * Flag to specify if the endpoint should return different type of error as actual 200 success for the browser, but with the error code/message contained in the response.
   */
  errorsAsSuccess: boolean;
}

/**
 * Information about a request
 */
export interface IRequestInfo<T> {
  /**
   * Url that was requested
   */
  url: string;
  /**
   * The query string parameters that were used for this request
   */
  queryString: string[];
  /**
   * The data that was sent for this request
   */
  requestData: IStringMap<T>;
  /**
   * The requestDataType that was used for this request
   */
  requestDataType: string;
  /**
   * The timestamp at which the request started
   */
  begun: Date;
  /**
   * The method that was used for this request
   */
  method: string;
  /**
   * The headers for the request.
   */
  headers?: IStringMap<string>;
}

/**
 * A generic response
 */
export interface IResponse<T> {
  /**
   * Data of the response
   */
  data?: T;
}

/**
 * A generic success response
 */
export interface ISuccessResponse<T> extends IResponse<T> {
  /**
   * The time that the successfull response took to complete
   */
  duration: number;
  /**
   * Data of the response
   */
  data: T;
}

/**
 * An error response
 */
export interface IErrorResponse extends IResponse<IStringMap<any>> {
  /**
   * Status code for the error
   */
  statusCode: number;
  /**
   * Data about the error
   */
  data?: {
    /**
     * Message for the error
     */
    message?: string;
    /**
     * Type of the error
     */
    type?: string;
    /**
     * A report provided by the search api
     */
    executionReport?: string;
    [key: string]: any;
  };
}

/**
 * Possible options when creating a {@link EndpointCaller}
 */
export interface IEndpointCallerOptions {
  /**
   * The access token to use for this endpoint.
   */
  accessToken?: string;
  /**
   * The username to use to log into this endpoint. Used for basic auth.<br/>
   * Not used if accessToken is provided.
   */
  username?: string;
  /**
   * The password to use to log into this endpoint. Used for basic auth.<br/>
   * Not used if accessToken is provided.
   */
  password?: string;
  /**
   * A function which will allow external code to modify all endpoint call parameters before they are sent by the browser.
   *
   * Used in very specific scenario where the network infrastructure require special request headers to be added or removed, for example.
   */
  requestModifier?: (params: IRequestInfo<any>) => IRequestInfo<any>;

  /**
   * The XmlHttpRequest implementation to use instead of the native one.
   * If not specified, the native one is used.
   */
  xmlHttpRequest?: new () => XMLHttpRequest;
}

// In ie8, XMLHttpRequest has no status property, so let's use this enum instead
enum XMLHttpRequestStatus {
  OPENED = XMLHttpRequest.OPENED || 1,
  HEADERS_RECEIVED = XMLHttpRequest.HEADERS_RECEIVED || 2,
  DONE = XMLHttpRequest.DONE || 4
}

/**
 * This class is in charge of calling an endpoint (eg: a {@link SearchEndpoint}).
 *
 * This means it's only uses to execute an XMLHttpRequest (for example), massage the response and check if there are errors.
 *
 * Will execute the call and return a Promise.
 *
 * Call using one of those options :
 *
 * * XMLHttpRequest for recent browser that support CORS, or if the endpoint is on the same origin.
 * * XDomainRequest for older IE browser that do not support CORS.
 * * Jsonp if all else fails, or is explicitly enabled.
 */
export class EndpointCaller {
  public logger: Logger;

  /**
   * Set this property to true to enable Jsonp call to the endpoint.<br/>
   * Be aware that jsonp is "easier" to setup endpoint wise, but has a lot of drawback and limitation for the client code.<br/>
   * Default to false.
   * @type {boolean}
   */
  public useJsonp = false;

  private static JSONP_ERROR_TIMEOUT = 10000;
  /**
   * Create a new EndpointCaller.
   * @param options Specify the authentication that will be used for this endpoint. Not needed if the endpoint is public and has no authentication
   */
  constructor(public options: IEndpointCallerOptions = {}) {
    this.logger = new Logger(this);
  }

  /**
   * Generic call to the endpoint using the provided {@link IEndpointCallParameters}.<br/>
   * Internally, will decide which method to use to call the endpoint :<br/>
   * -- XMLHttpRequest for recent browser that support CORS, or if the endpoint is on the same origin.<br/>
   * -- XDomainRequest for older IE browser that do not support CORS.<br/>
   * -- Jsonp if all else fails, or is explicitly enabled.
   * @param params The parameters to use for the call
   * @returns {any} A promise of the given type
   */
  public call<T>(params: IEndpointCallParameters): Promise<ISuccessResponse<T>> {
    let requestInfo: IRequestInfo<T> = {
      url: params.url,
      queryString: params.errorsAsSuccess ? params.queryString.concat(['errorsAsSuccess=1']) : params.queryString,
      requestData: params.requestData,
      requestDataType: params.requestDataType || 'application/x-www-form-urlencoded; charset="UTF-8"',
      begun: new Date(),
      method: params.method
    };
    requestInfo.headers = this.buildRequestHeaders(requestInfo);
    if (_.isFunction(this.options.requestModifier)) {
      requestInfo = this.options.requestModifier(requestInfo);
    }

    this.logger.trace('Performing REST request', requestInfo);
    const urlObject = this.parseURL(requestInfo.url);
    // In IE8, hostname and port return "" when we are on the same domain.
    const isLocalHost = window.location.hostname === urlObject.hostname || urlObject.hostname === '';

    const currentPort = window.location.port != '' ? window.location.port : window.location.protocol == 'https:' ? '443' : '80';
    const isSamePort = currentPort == urlObject.port;
    const isCrossOrigin = !(isLocalHost && isSamePort);
    if (!this.useJsonp) {
      if (this.isCORSSupported() || !isCrossOrigin) {
        return this.callUsingXMLHttpRequest(requestInfo, params.responseType);
      } else if (this.isXDomainRequestSupported()) {
        return this.callUsingXDomainRequest(requestInfo);
      } else {
        return this.callUsingAjaxJsonP(requestInfo);
      }
    } else {
      return this.callUsingAjaxJsonP(requestInfo);
    }
  }

  /**
   * Call the endpoint using XMLHttpRequest. Used internally by {@link EndpointCaller.call}.<br/>
   * Will try internally to handle error if it can.<br/>
   * Promise will otherwise fail with the error type.
   * @param requestInfo The info about the request
   * @param responseType The responseType. Default to text. https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
   * @returns {Promise<T>|Promise}
   */
  public callUsingXMLHttpRequest<T>(requestInfo: IRequestInfo<T>, responseType = 'text'): Promise<ISuccessResponse<T>> {
    return new Promise((resolve, reject) => {
      const xmlHttpRequest = this.getXmlHttpRequest();

      // Beware, most stuff must be set on the event that says the request is OPENED.
      // Otherwise it'll bork on some browsers. Gotta love standards.

      // This sent variable allowed to remove the second call of onreadystatechange with the state OPENED in IE11
      let sent = false;

      xmlHttpRequest.onreadystatechange = ev => {
        if (xmlHttpRequest.readyState == XMLHttpRequestStatus.OPENED && !sent) {
          sent = true;
          xmlHttpRequest.withCredentials = true;

          _.each(requestInfo.headers, (headerValue, headerKey) => {
            xmlHttpRequest.setRequestHeader(headerKey, headerValue);
          });

          if (requestInfo.method == 'GET') {
            xmlHttpRequest.send();
          } else if (requestInfo.requestDataType.indexOf('application/json') === 0) {
            xmlHttpRequest.send(JSON.stringify(requestInfo.requestData));
          } else {
            xmlHttpRequest.send(this.convertJsonToFormBody(requestInfo.requestData));
          }

          // The "responseType" varies if the request is a success or not.
          // Therefore we postpone setting "responseType" until we know if the
          // request is a success or not. Doing so, we avoid this potential
          // error in Chrome:
          //
          //   Uncaught InvalidStateError: Failed to read the 'responseText'
          //   property from 'XMLHttpRequest': The value is only accessible if
          //   the object's 'responseType' is '' or 'text' (was 'document').
          //
        } else if (xmlHttpRequest.readyState == XMLHttpRequestStatus.HEADERS_RECEIVED) {
          const status = xmlHttpRequest.status;

          if (this.isSuccessHttpStatus(status)) {
            xmlHttpRequest.responseType = <XMLHttpRequestResponseType>responseType;
          } else {
            xmlHttpRequest.responseType = 'text';
          }
        } else if (xmlHttpRequest.readyState == XMLHttpRequestStatus.DONE) {
          const status = xmlHttpRequest.status;
          let data;
          switch (responseType) {
            case 'json':
              data = xmlHttpRequest.response;
              // Work around a bug in IE11 where responseType jsonis not supported : the response comes back as a plain string
              // Force the json parse manually
              if (responseType == 'json' && DeviceUtils.getDeviceName() == 'IE') {
                try {
                  data = JSON.parse(data);
                } catch (e) {
                  // Do nothing, it probably means the data was JSON already
                }
              }
              break;
            case 'text':
              data = this.tryParseResponseText(xmlHttpRequest.responseText, xmlHttpRequest.getResponseHeader('Content-Type'));
              break;
            default:
              data = xmlHttpRequest.response;
              break;
          }

          if (data == undefined) {
            data = this.tryParseResponseText(xmlHttpRequest.responseText, xmlHttpRequest.getResponseHeader('Content-Type'));
          }

          if (this.isSuccessHttpStatus(status)) {
            this.handleSuccessfulResponseThatMightBeAnError(requestInfo, data, resolve, reject);
          } else {
            this.handleError(requestInfo, xmlHttpRequest.status, data, reject);
          }
        }
      };

      let queryString = requestInfo.queryString;
      if (requestInfo.method == 'GET') {
        queryString = queryString.concat(this.convertJsonToQueryString(requestInfo.requestData));
      }
      xmlHttpRequest.open(requestInfo.method, this.combineUrlAndQueryString(requestInfo.url, queryString));
    });
  }

  /**
   * Call the endpoint using XDomainRequest https://msdn.microsoft.com/en-us/library/cc288060(v=vs.85).aspx<br/>
   * Used for IE8/9
   * @param requestInfo The info about the request
   * @returns {Promise<T>|Promise}
   */
  public callUsingXDomainRequest<T>(requestInfo: IRequestInfo<T>): Promise<ISuccessResponse<T>> {
    return new Promise((resolve, reject) => {
      let queryString = requestInfo.queryString.concat([]);

      // XDomainRequest don't support including stuff in the header, so we must
      // put the access token in the query string if we have one.
      if (this.options.accessToken) {
        queryString.push('access_token=' + Utils.safeEncodeURIComponent(this.options.accessToken));
      }

      const xDomainRequest = new XDomainRequest();
      if (requestInfo.method == 'GET') {
        queryString = queryString.concat(this.convertJsonToQueryString(requestInfo.requestData));
      }
      xDomainRequest.open(requestInfo.method, this.combineUrlAndQueryString(requestInfo.url, queryString));

      xDomainRequest.onload = () => {
        const data = this.tryParseResponseText(xDomainRequest.responseText, xDomainRequest.contentType);
        this.handleSuccessfulResponseThatMightBeAnError(requestInfo, data, resolve, reject);
      };

      xDomainRequest.onerror = () => {
        const data = this.tryParseResponseText(xDomainRequest.responseText, xDomainRequest.contentType);
        this.handleError(requestInfo, 0, data, reject);
      };

      // We must set those functions otherwise it will sometime fail in IE
      xDomainRequest.ontimeout = () => this.logger.error('Request timeout', xDomainRequest, requestInfo.requestData);
      xDomainRequest.onprogress = () => this.logger.trace('Request progress', xDomainRequest, requestInfo.requestData);

      // We must open the request in a separate thread, for obscure reasons
      _.defer(() => {
        if (requestInfo.method == 'GET') {
          xDomainRequest.send();
        } else {
          xDomainRequest.send(this.convertJsonToFormBody(requestInfo.requestData));
        }
      });
    });
  }

  /**
   * Call the endpoint using Jsonp https://en.wikipedia.org/wiki/JSONP<br/>
   * Should be used for dev only, or for very special setup as using jsonp has a lot of drawbacks.
   * @param requestInfo The info about the request
   * @returns {Promise<T>|Promise}
   */
  public callUsingAjaxJsonP<T>(requestInfo: IRequestInfo<T>): Promise<ISuccessResponse<T>> {
    let jQuery = JQueryUtils.getJQuery();
    Assert.check(jQuery, 'Using jsonp without having included jQuery is not supported.');
    return new Promise((resolve, reject) => {
      const queryString = requestInfo.queryString.concat(this.convertJsonToQueryString(requestInfo.requestData));

      // JSONP don't support including stuff in the header, so we must
      // put the access token in the query string if we have one.
      if (this.options.accessToken) {
        queryString.push('access_token=' + Utils.safeEncodeURIComponent(this.options.accessToken));
      }

      queryString.push('callback=?');

      jQuery.ajax({
        url: this.combineUrlAndQueryString(requestInfo.url, queryString),
        dataType: 'jsonp',
        success: (data: any) => this.handleSuccessfulResponseThatMightBeAnError(requestInfo, data, resolve, reject),
        timeout: EndpointCaller.JSONP_ERROR_TIMEOUT,
        error: () => this.handleError(requestInfo, 0, undefined, reject)
      });
    });
  }

  private parseURL(url: string) {
    const urlObject = document.createElement('a');
    urlObject.href = url;
    return urlObject;
  }

  private getXmlHttpRequest(): XMLHttpRequest {
    const newXmlHttpRequest = this.options.xmlHttpRequest || XMLHttpRequest;
    return new newXmlHttpRequest();
  }

  private convertJsonToQueryString(json: { [key: string]: any }): string[] {
    Assert.exists(json);

    const result: string[] = [];
    _.each(json, (value, key) => {
      if (value != null) {
        if (_.isObject(value)) {
          result.push(key + '=' + Utils.safeEncodeURIComponent(JSON.stringify(value)));
        } else {
          result.push(key + '=' + Utils.safeEncodeURIComponent(value.toString()));
        }
      }
    });

    return result;
  }

  private convertJsonToFormBody(json: { [key: string]: any }): string {
    return this.convertJsonToQueryString(json).join('&');
  }

  private handleSuccessfulResponseThatMightBeAnError<T>(requestInfo: IRequestInfo<T>, data: any, success, error) {
    if (this.isErrorResponseBody(data)) {
      this.handleError(requestInfo, data.statusCode, data, error);
    } else {
      this.handleSuccess(requestInfo, data, success);
    }
  }

  private handleSuccess<T>(requestInfo: IRequestInfo<T>, data: T, success) {
    const querySuccess: ISuccessResponse<T> = {
      duration: TimeSpan.fromDates(requestInfo.begun, new Date()).getMilliseconds(),
      data
    };

    this.logger.trace('REST request successful', data, requestInfo);
    success(querySuccess);
  }

  private handleError<T>(requestInfo: IRequestInfo<T>, status: number, data: any, error) {
    const queryError: IErrorResponse = {
      statusCode: status,
      data: data
    };
    this.logger.error('REST request failed', status, data, requestInfo);
    error(queryError);
  }

  private combineUrlAndQueryString(url: String, queryString: string[]): string {
    let questionMark = '?';
    if (url.match(/\?$/)) {
      questionMark = '';
    }
    return url + (queryString.length > 0 ? questionMark + queryString.join('&') : '');
  }

  private isXDomainRequestSupported(): boolean {
    return 'XDomainRequest' in window;
  }

  private isCORSSupported(): boolean {
    return 'withCredentials' in this.getXmlHttpRequest();
  }

  private isSuccessHttpStatus(status: number): boolean {
    return (status >= 200 && status < 300) || status === 304;
  }

  private tryParseResponseText(json: string, contentType: string): any {
    if (contentType != null && contentType.indexOf('application/json') != -1) {
      if (Utils.isNonEmptyString(json)) {
        try {
          return JSON.parse(json);
        } catch (ex) {
          return undefined;
        }
      } else {
        return undefined;
      }
    } else {
      return json;
    }
  }

  private isErrorResponseBody(data: any): boolean {
    if (data && data.statusCode) {
      return !this.isSuccessHttpStatus(data.statusCode);
    } else {
      return false;
    }
  }

  private buildRequestHeaders<T>(requestInfo: IRequestInfo<T>): IStringMap<string> {
    let headers: IStringMap<string> = {};
    if (this.options.accessToken) {
      headers['Authorization'] = `Bearer ${this.options.accessToken}`;
    } else if (this.options.username && this.options.password) {
      headers['Authorization'] = `Basic ${btoa(this.options.username + ':' + this.options.password)}`;
    }

    if (requestInfo.method == 'GET') {
      return headers;
    }

    if (requestInfo.requestDataType.indexOf('application/json') === 0) {
      headers['Content-Type'] = 'application/json; charset="UTF-8"';
    } else {
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset="UTF-8"';
    }

    return headers;
  }
}
