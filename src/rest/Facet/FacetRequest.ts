import { FacetValueState } from './FacetValueState';
import { FacetSortCriteria } from './FacetSortCriteria';

/**
 * A Search API facet request value.
 */
export interface IFacetRequestValue {
  /**
   * **Required (Search API).** The facet value name.
   */
  value: string;

  /**
   * The facet value state.
   *
   * **Allowed values (Search API):**
   * - `idle`
   * - `selected`
   *
   * **Default (Search API):** `idle`
   */
  state: FacetValueState;
}

/**
 * A Search API facet request.
 */
export interface IFacetRequest {
  /**
   * The unique facet identifier.
   *
   * **Note:** Must match `^[A-Za-z0-9-_]{1,60}$`.
   *
   * **Example:** `author-1`
   */
  facetId: string;

  /**
   * **Required (Search API).** The name of the field on which to base the facet request.
   *
   * **Note:** Must correspond to a field whose **Facet** option is enabled in the index.
   *
   * **Example:** `author`
   */
  field: string;

  /**
   * The sort criterion to use for the facet request.
   *
   * **Allowed values:**
   * - `score`
   * - `alphanumeric`
   *
   * **Note:** The Coveo Machine Learning (Coveo ML) Dynamic Navigation Experience (DNE) feature only works with the `score` value.
   *
   * **Default behavior (Search API):**
   * - When `isFieldExpanded` is `false` and additional facet values are available, use `score`.
   * - Otherwise, use `alphanumeric`.
   */
  sortCriteria?: FacetSortCriteria;

  /**
   * The number of facet values to request.
   *
   * **Note:** If [`freezeCurrentValues`]{@link IFacetRequest.freezeCurrentValues} is `true`, `numberOfValues` must be equal to the [`currentValues`]{@link IFacetRequest.currentValues} array length.
   *
   * **Default (Search API):** `8`
   */
  numberOfValues?: number;

  /**
   * The maximum of items to scan for facet values.
   *
   * **Note:** A high `injectionDepth` may negatively impact performance.
   *
   * **Default (Search API):** `1000`
   */
  injectionDepth?: number;

  /**
   * Whether to include the specified `currentValues` in the response.
   *
   * **Default (Search API):** `false`
   */
  freezeCurrentValues?: boolean;

  /**
   * The values displayed by the facet in the search interface at the moment of the request.
   *
   * **Default (Search API):** `[]`
   */
  currentValues?: IFacetRequestValue[];

  /**
   * Whether the facet is expanded in the search interface at the moment of the request.
   *
   * **Default (Search API):** `false`
   */
  isFieldExpanded?: boolean;
}
