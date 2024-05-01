import { Request } from '@playwright/test';

/**
 * Tranform a query string into a json key value object.
 * @param queryString
 */
export function parseQueryString(queryString: string) {
  const res = {};
  new URLSearchParams(decodeURI(queryString)).forEach((value, name) => {
    res[name] = value;
  });
  return res;
}

export const searchUrlRegex = /\/rest\/search\/v2/;
export const querySuggestUrlRegex = /\/rest\/search\/v2\/querySuggest/;
export const analyticsSearchesUrlRegex = /\/rest(\/ua)?\/v15\/analytics\/search(es)?/;
export const searchInsightUrlRegex = /\/insight\/v1\/configs?/;
export const analyticsCustomUrlRegex = /\/rest(\/ua)?\/v15\/analytics\/custom?/;
export const analyticsClickUrlRegex = /\/rest(\/ua)?\/v15\/analytics\/click?/;
export const facetSearchUrlRegex = /\/rest\/search\/v2\/facet/;

/**
 * Indicates whether the specified request corresponds to a search request.
 * @param request The request to check.
 */
export function isSearchRequest(request: Request): boolean {
  return request.method() === 'POST' && searchUrlRegex.test(request.url());
}

/**
 * Indicates whether the specified request corresponds to a Search Usage Analytics request.
 * @param request The request to check.
 */
export function isUaSearchEvent(request: Request): boolean {
  return request.method() === 'POST' && analyticsSearchesUrlRegex.test(request.url());
}

/**
 * Indicates whether the specified request corresponds to a Click Usage Analytics request.
 * @param request The request to check.
 */
export function isUaClickEvent(request: Request): boolean {
  return request.method() === 'POST' && analyticsClickUrlRegex.test(request.url());
}

/**
 * Indicates whether the specified request corresponds to a Custom Usage Analytics request.
 * @param request The request to check.
 */
export function isUaCustomEvent(request: Request): boolean {
  return request.method() === 'POST' && analyticsCustomUrlRegex.test(request.url());
}

/**
 * Indicates whether the specified request corresponds to a Query Suggest request.
 * @param request The request to check.
 */
export function isQuerySuggestRequest(request: Request): boolean {
  return request.method() === 'POST' && querySuggestUrlRegex.test(request.url());
}

/**
 * Indicates whether the specified request corresponds to a Insight search request.
 * @param request The request to check.
 */
export function isSearchInsightRequest(request: Request): boolean {
  return request.method() === 'POST' && searchInsightUrlRegex.test(request.url());
}

export function isFacetSearchRequest(request:Request):boolean{
  return request.method() === 'POST' && facetSearchUrlRegex.test(request.url());
}