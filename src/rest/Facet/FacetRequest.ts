import { FacetValueState } from './FacetValueState';
import { FacetSortCriteria } from './FacetSortCriteria';
import { IRangeValue } from '../RangeValue';

/**
 * The allowed values for the [`facetType`]{@link IFacetRequest.facetType} property of a [facet request]{@link IFacetRequest}.
 */
export enum FacetType {
  /**
   * Request facet values representing specific values.
   */
  specific = 'specific',
  /**
   * Request facet values representing ranges of numbers.
   */
  numericalRange = 'numericalRange',
  /**
   * Request facet values representing ranges of dates.
   */
  dateRange = 'dateRange',
  /**
   * Request facet values representing a hierarchy.
   */
  hierarchical = 'hierarchical'
}

/**
 * A [`currentValues`]{@link IFacetRequest.currentValues} item in a Search API
 * [facet request]{@link IFacetRequest}.
 */
export interface IFacetRequestValue extends IRangeValue {
  /**
   * The current facet value state in the search interface.
   *
   * **Default (Search API):** `idle`
   */
  state: FacetValueState;
  /**
   * **Required (Search API).** The facet value name.
   */
  value?: string;
  /**
   * Whether to prevent Coveo ML from automatically selecting the facet value.
   *
   * **Default:** `false`
   */
  preventAutoSelect?: boolean;
  /**
   * Whether to retrieve the children of this category facet value. Can only be used on leaf values in the request (i.e., values with no current children).
   *
   * **Default:** `false`
   */
  retrieveChildren?: boolean;
  /**
   * If [retrieveChildren]{@link IFacetRequestValue.retrieveChildren} is true, the maximum number of children to retrieve for this leaf value.
   *
   * **Default (Search API):** `0`
   */
  retrieveCount?: number;
  /**
   * The children of this category facet value.
   * Each child is a full-fledged category facet value that may in turn have its own children and so forth,
   * up to a maximum depth of 50 levels
   */
  children?: IFacetRequestValue[];
}

/**
 * A Search API facet request.
 */
export interface IFacetRequest {
  /**
   * The unique identifier of the facet in the search interface.
   *
   * **Note:** Must match `^[A-Za-z0-9-_]{1,60}$`.
   *
   * **Example:** `author-1`
   */
  facetId: string;

  /**
   * **Required (Search API).** The name of the field on which to base the
   * facet request.
   *
   * **Note:** Must reference an index field whose **Facet** option is enabled.
   *
   * **Example:** `author`
   */
  field: string;

  /**
   * The kind of values to request for the facet.
   *
   * **Default (Search API):** [`Specific`]{@link FacetType.Specific}
   */
  type?: FacetType;

  /**
   * The sort criterion to apply to the returned facet values.
   *
   * **Default behavior (Search API):**
   * - When [`isFieldExpanded`]{@link IFacetRequest.isFieldExpanded} is `false`
   * in the facet request, and
   * [`moreValuesAvailable`]{@link IFacetResponse.moreValuesAvailable} is
   * `true` in the corresponding [facet response]{@link IFacetResponse}, use
   * `score`.
   * - Otherwise, use `alphanumeric`.
   */
  sortCriteria?: FacetSortCriteria;

  /**
   * The maximum number of facet values to fetch.
   *
   * **Note:** If
   * [`freezeCurrentValues`]{@link IFacetRequest.freezeCurrentValues} is
   * `true`, `numberOfValues` must be equal to the
   * [`currentValues`]{@link IFacetRequest.currentValues} array length.
   *
   * **Default (Search API):** `8`
   */
  numberOfValues?: number;

  /**
   * The maximum number of items to scan for facet values.
   *
   * **Note:** A high `injectionDepth` may negatively impact the facet request
   * performance.
   *
   * **Default (Search API):** `1000`
   */
  injectionDepth?: number;

  /**
   * Whether to include the facet request's
   * [`currentValues`]{@link IFacetRequest.currentValues} in the corresponding
   * [facet response]{@link IFacetResponse}'s
   * [`values`]{@link IFacetResponse.values} array.
   *
   * **Note:** Setting this to `true` is useful to ensure that the facet does
   * not move around while the end-user is interacting with it in the search
   * interface.
   *
   * **Default (Search API):** `false`
   */
  freezeCurrentValues?: boolean;

  /**
   * The values displayed by the facet in the search interface at the moment of
   * the request.
   *
   * See [IFacetRequestValue]{@link IFacetRequestValue}.
   *
   * **Default (Search API):** `[]`
   */
  currentValues?: IFacetRequestValue[];

  /**
   * Whether the facet is expanded in the search interface at the moment of the
   * request.
   *
   * **Default (Search API):** `false`
   */
  isFieldExpanded?: boolean;

  /**
   * Whether to automatically generate range values for the facet.
   *
   * **Notes:**
   * - Setting this to `true` is only effective when [`type`]{@link IFacetRequest.type} is set to [`dateRange`]{@link FaceType.dateRange}
   * or [`numericalRange`]{@link FacetType.numericalRange}, and the referenced [`field`]{@link IFacetRequest.field} is of a corresponding type (i.e., date or numeric).
   * - Automatic range generation will fail if the referenced `field` is dynamically generated by a query function.
   * - Enabling the **Use cache for numeric queries** option on the referenced `field` will speed up automatic range generation (see [Add or Edit Fields](https://docs.coveo.com/en/1982/)).
   *
   * **Default (Search API):** `false`
   */
  generateAutomaticRanges?: boolean;

  /**
   * The character to use to split field values into a hierarchical sequence.
   *
   * **Example:**
   * For a multi-value field containing the following values: `c; c&gt;folder2; c&gt;folder2&gt;folder3;`
   * The delimiting character is `&gt;`.
   *
   * **Default (Search API):** `;`
   */
  delimitingCharacter?: string;

  /**
   * Whether to exclude folded result parents when estimating result counts for facet values.
   *
   * **Default (Search API):** `true`
   */
  filterFacetCount?: boolean;

  /**
   * The base path shared by all values for a given hierarchical facet.
   *
   * **Default (Search API):** `[]`
   */
  basePath?: string[];

  /**
   * Whether to use `basePath` as a filter for the results.
   *
   * **Default (Search API):** `true`
   */
  filterByBasePath?: boolean;

  /**
   * Whether to prevent Coveo ML from automatically selecting values from that facet.
   *
   * **Default:** `false`
   */
  preventAutoSelect?: boolean;
}
