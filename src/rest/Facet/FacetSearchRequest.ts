import { IQuery } from '../Query';

/**
 * A Search API facet search request.
 */
export interface IFacetSearchRequest {
  /**
   * The name of the field against which to execute the facet search request.
   */
  field: string;
  /**
   * A list of index field values to filter out from the facet search results.
   *
   * **Example:** `["blue", "green"]`
   */
  ignoreValues?: String[];
  /**
   * The maximum number of facet values to fetch.
   *
   * **Default (Search API):** `10`
   */
  numberOfValues?: number;
  /**
   * The string to match.
   *
   * Typically, the text entered by the end-user in the facet search box, to which one or more wildcard characters (`*`) may be added.
   *
   * **Example:** `"*oran*"`
   */
  query?: string;
  /**
   * A dictionary that maps index field values to facet value display names.
   *
   * **Example**
   * > `{"acme_productA": "ACME Product A", "acme_productB": "ACME Product B"}`
   */
  captions?: Record<string, string>;
  /**
   * The query parameters representing the current state of the search interface.
   *
   * See the [query]{@link IQuery} documentation.
   */
  searchContext?: IQuery;
}
