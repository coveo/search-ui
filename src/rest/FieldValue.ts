/**
 * Describe a field value returned by index
 */
export interface IIndexFieldValue {
  /**
   * The value
   */
  value: string;
  /**
   * The optional lookupValue, if requested in the {@link IGroupByRequest}
   */
  lookupValue?: string;
  /**
   * The number of results in the index which have this value
   */
  numberOfResults: number;
  /**
   * The optional computedFieldResults, if requested in the {@link IGroupByRequest}
   */
  computedFieldResults?: number[];
}
