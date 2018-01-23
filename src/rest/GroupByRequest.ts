import { IComputedFieldRequest } from './ComputedFieldRequest';
import { IRangeValue } from './RangeValue';

/**
 * The `IGroupByRequest` interface describes a Group By operation to perform against the index.
 *
 * See [Group By Parameters](https://developers.coveo.com/x/jQEv).
 */
export interface IGroupByRequest {
  /**
   * Specifies the field on which to perform the Group By request. The Group By request returns a Group By value for
   * each distinct value of this field within the result set.
   */
  field: string;
  lookupField?: string;

  /**
   * Specifies how the indexer should sort the Group By values.
   *
   * The possible values are:
   * - `score`: Sort by score. Score is computed from the number of occurrences of a field value, as well as from the
   * position where results having this field value appear in the ranked result set. When using this sort criterion, a
   * field value with 100 occurrences might appear after one with only 10 occurrences, if the occurrences of the latter
   * tend to appear sooner in the ranked result set.
   * - `occurrences`: Sort by number of occurrences, with values having the highest number of occurrences appearing
   * first.
   * - `alphaascending` / `alphadescending`: Sort alphabetically on the field values.
   * - `computedfieldascending` / `computedfielddescending`: Sort on the values of the first computed field for each
   * Group By value (see [Computed Field Parameters](https://developers.coveo.com/x/jwEv)).
   * - `chisquare`: Sort based on the relative frequency of values in the result set compared to the frequency in the
   * entire index. This means that a value that does not appear often in the index but does appear often in the result
   * set will tend to appear first.
   * - `nosort`: Do not sort the Group By values. When using this sort criterion, the index returns the Group By values
   * in a random order.
   *
   * Default value is `score`.
   */
  sortCriteria?: string;

  /**
   * Specifies the maximum number of values that the Group By operation can return.
   *
   * Default value is `10`. Minimum value is `0`.
   */
  maximumNumberOfValues?: number;

  /**
   * Specifies how deep the index should scan the results to identify missing Group By values.
   *
   * When executing a Group By operation, the index uses various heuristics to try to list all of the field values that
   * appear in the result set. In some corner cases, certain values might be omitted (it is a classical example of a
   * trade-off between precision and performance). Using `injectionDepth` forces the index to explicitly scan the field
   * values of the top n results of the query, and ensure that the field values present in those results are included.
   *
   * Consequently, specifying a high value for this parameter may negatively impact query performance.
   *
   * Default value is `1000`. Minimum value is `0`.
   */
  injectionDepth?: number;

  /**
   * Specifies a different query expression on which to compute the Group By operation.
   *
   * This feature is typically used for performance reasons to retrieve Group By values on separate expressions while
   * executing a normal query in a single operation.
   *
   * By default, the query expression being executed is used.
   */
  queryOverride?: string;
  advancedQueryOverride?: string;

  /**
   * Specifies a constant query expression on which to compute the Group By operation.
   *
   * This feature is similar to the [`queryOverride`]{@link IGroupByRequest.queryOverride} feature, except that in this
   * case, the index keeps the constant query expression in cache for faster queries. You should avoid specifying a
   * dynamic query expression for this parameter, for doing so will negatively impact performance.
   *
   * By default, the constant part of the query expression being executed is used.
   */
  constantQueryOverride?: string;

  /**
   * Explicitly specifies a list of values for which to generate Group By values.
   *
   * You can use trailing wildcards to include ranges of values.
   *
   * **Example:**
   * > The array `["foo", "bar*"]` would return Group By values for `foo` and any value starting with `bar`.
   */
  allowedValues?: string[];

  /**
   * Specifies an array of computed fields that should be evaluated for each Group By value that is returned.
   *
   * Computed fields are used to perform aggregate operations on other fields for all the matching items having a
   * specific value in the Group By field in the results. See
   * [Computed Field Parameters](https://developers.coveo.com/x/jwEv).
   */
  computedFields?: IComputedFieldRequest[];

  /**
   * Explicitly specifies a list of range values for which Group By values should be generated.
   */
  rangeValues?: IRangeValue[];

  /**
   * Specifies whether to let the index calculate the ranges.
   *
   * Default value is `false`.
   */
  generateAutomaticRanges?: boolean;
  completeFacetWithStandardValues?: boolean;
}
