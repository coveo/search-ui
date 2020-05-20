export interface IFacetSearchResultValue {
  /**
   * The custom facet value display name, as specified in the `captions` argument of the facet request.
   *
   * **Example:** `ACME Product A`
   */
  displayValue: string;
  path: string[];
  /**
   * The original facet value, as retrieved from the field in the index.
   *
   * **Example:** `acme_productA`
   */
  rawValue: string;
  /**
   * An estimate number of result items matching both the current query and
   * the filter expression that would get generated if the facet value were selected.
   */
  count: number;
  /**
   * Whether additional facet values matching the request are available.
   */
  moreValuesAvailable: boolean;
}

/**
 * A Search API facet search response.
 */
export interface IFacetSearchResponse {
  /**
   * The facet values.
   */
  values: IFacetSearchResultValue[];
}
