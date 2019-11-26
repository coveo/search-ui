import { FacetType } from '../../rest/Facet/FacetRequest';
import { FacetValueState } from '../../rest/Facet/FacetValueState';

/**
 * Describes the current condition of a single dynamic facet value.
 */
export interface IAnalyticsFacetState {
  /**
   * The name of the field the dynamic facet displaying the value is based on.
   *
   * **Example:** `author`
   */
  field: string;
  /**
   * The unique identifier of the dynamic facet displaying the value.
   *
   * **Example:** `author`
   */
  id: string;
  /**
   * The title of the dynamic facet.
   *
   * **Example:** `Author`
   */
  title: string;
  /**
   * The original name (i.e., field value) of the dynamic facet value.
   *
   * **Example:** `alice_r_smith`
   */
  value?: string;
  /**
   * The minimum value of the dynamic range facet value.
   *
   * **Examples:**
   * > - `0`
   * > - `2018-01-01T00:00:00.000Z`
   */
  start?: string;
  /**
   * The maximum value of the dynamic range facet value.
   *
   * **Examples:**
   * > - `500`
   * > - `2018-12-31T23:59:59.999Z`
   */
  end?: string;
  /**
   * Whether the [`end`]{@link IRangeValue.end} value is included in the dynamic range facet value.
   */
  endInclusive?: boolean;
  /**
   * The current 1-based position of the dynamic facet value, relative to other values in the same dynamic facet.
   */
  valuePosition?: number;
  /**
   * The custom display name of the dynamic facet value that was interacted with.
   *
   * **Example:** `Alice R. Smith`
   */
  displayValue?: string;
  /**
   * The type of values displayed in the dynamic facet.
   */
  facetType?: FacetType;
  /**
   * The new state of the dynamic facet value that was interacted with.
   */
  state?: FacetValueState;
  /*
  * The 1-based position of the dynamic facet, relative to other dynamic facets in the page.
  */
  facetPosition?: number;
}
