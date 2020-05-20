import { IQuery } from '../Query';

export enum FacetSearchType {
  /**
   * Request facet values representing specific values.
   */
  specific = 'specific',
  /**
   * Request facet values representing a hierarchy.
   */
  hierarchical = 'hierarchical'
}

/**
 * A Search API facet search request.
 */
export interface IFacetSearchRequest {
  /**
   * The name of the field against which to execute the facet search request.
   */
  field: string;
  /**
   * The kind of values to request for the facet.
   *
   * **Default:** `specific`
   */
  type?: FacetSearchType;
  /**
   * A list of index field values to filter out from the facet search results.
   *
   * **Example:** `["blue", "green"]`
   */
  ignoreValues?: String[];
  /**
   * A list of paths to filter out from the hierarchical facet search results.
   *
   * **Example:** `[["A","B","C"], ["D", "E"]]`
   */
  ignorePaths?: String[][];
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
  /**
   * The character to use to split field values into a hierarchical sequence.
   *
   * **Example:**
   *
   * For a multi-value field containing the following values:
   * ```
   * c; c>folder2; c>folder2>folder3;
   * ```
   * The delimiting character is `>`.
   *
   * For a hierarchical field containing the following values:
   * ```
   * c;folder2;folder3;
   * ```
   * The delimiting character is `;`.
   *
   * **Default:** `;`
   */
  delimitingCharacter?: string;
  /**
   * The base path shared by all values for the facet.
   *
   * **Note:** This parameter has no effect unless the facet `type` is `hierarchical`.
   */
  basePath?: string[];
}
