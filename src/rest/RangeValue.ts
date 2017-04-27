/**
 * Describe a single rangle value in a group by
 */
export interface IRangeValue {
  /**
   * Start of the range.
   */
  start?: any;
  /**
   * End of the range
   */
  end?: any;
  /**
   * Label to generate for this range
   */
  label?: string;
  /**
   * Is the end parameter included or excluded in this range.
   */
  endInclusive?: boolean;
}
