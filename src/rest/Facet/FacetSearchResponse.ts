/**
 * TODO: documentation
 */
export interface IFacetSearchResultValue {
  displayValue: string;
  rawValue: string;
  count: number;
}

/**
 * A Search API facet search response.
 *
 * TODO: documentation
 */
export interface IFacetSearchResponse {
  values: IFacetSearchResultValue[];
  totalFacetValues: number;
}
