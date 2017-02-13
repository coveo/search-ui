import { IComputedFieldRequest } from './ComputedFieldRequest';
import { IRangeValue } from './RangeValue';

/**
 * Describe a group by request to perform against the index.<br/>
 * See : https://developers.coveo.com/display/SearchREST/Group+By+Parameters
 */
export interface IGroupByRequest {
  /**
   * This specifies the field on which the Group By operation is performed. The Group By will return a Group By value for each distinct value of this field within the result set.
   */
  field: string;
  lookupField?: string;
  /**
   * This specifies how the Group By values should be sorted by the indexer. If not specified, the default value is Score.<br/>
   * Possible values are :<br/>
   * -- score : the score is computed from the number of occurrences as well as from the position in the result set where the items having this value are appearing. Using this criterion, an item with 100 occurrences might appear after one with only 10 occurrences if those occurrences tend to appear sooner in the ranked result set.<br/>
   * -- occurrences : Sort by number of occurrences, with values having the highest number appearing first. <br/>
   * -- alphaascending / alphadescending : Sort alphabetically on the field values. <br/>
   * -- computedfieldascending / computedfielddescending : Sort on the values of the first computed field for each Group By value. <br/>
   * -- chisquare : Sort based on the relative frequency of values in the result set compared to the frequency in the whole index. This means that a value that doesn't appear often in the index but does appear often in the result set will tend to appear higher in the list.<br/>
   * -- nosort : Do not sort the Group By values. The values will be returned in a random order.
   */
  sortCriteria?: string;
  /**
   * This specifies the maximum number of values that the Group By operation will return.<br/>
   * If not specified, the default value is 10.
   */
  maximumNumberOfValues?: number;
  /**
   * This specifies how deep the index will scan the results to identify missing Group By values.<br/>
   * If not specified, the default value is 1000.<br/>
   * When executing a Group By operation, the index uses various heuristics to list all the values that are appearing in the result set. In some corner cases, some values might be omitted (it's a classical trade-off of precision vs performance). Using injection means that the index will explicitly scan the field values of the top n results of the query, and ensure that the values present in those results are included. Using higher values for this parameter may impact query performance.
   */
  injectionDepth?: number;
  /**
   * This specifies a different query expression on which to compute the Group By operation.<br/>
   * By default, the query expression being executed is used.<br/>
   * This feature is typically used for performance reasons to retrieve Group By values on separate expressions while executing a normal query in a single operation.
   */
  queryOverride?: string;
  advancedQueryOverride?: string;
  /**
   * This specifies a constant query expression on which to compute the Group By operation.<br/>
   * By default, the constant part of the query expression being executed is used.<br/>
   * This feature is much like the normal queryOverride except that the index will keep the query expression in cache for faster queries. Do no put dynamic query expression in this parameter, as it will negatively impact the performance.
   */
  constantQueryOverride?: string;
  /**
   * This explicitly specifies a list of values for which Group By values should be generated.<br/>
   * Trailing wildcards can be used to include ranges of values.<br/>
   * eg : The array ["foo", "bar*"] would return Group By values for foo and any value starting with bar.
   */
  allowedValues?: string[];
  /**
   * This specifies an array of computed fields that should be computed for each Group By value that is returned.<br/>
   * Computed fields are used to perform aggregate operations on other fields for all the matching documents having a specific value in the Group By field in the results
   */
  computedFields?: IComputedFieldRequest[];
  /**
   * This explicitly specifies a list of range values for which Group By values should be generated.
   */
  rangeValues?: IRangeValue[];
  /**
   * By setting the parameter generateAutomaticRanges to true, the ranges will be calculated by the Coveo index.
   */
  generateAutomaticRanges?: boolean;
  completeFacetWithStandardValues?: boolean;
}
