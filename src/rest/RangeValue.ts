/**
 * The IRangeValue interface describes a single range of values in a group by clause.
 */
export interface IRangeValue {
  /**
   * Specifies the start of the range.
   *
   * E.g., `0`
   */
  start?: any;

  /**
   * Specifies the end of the range.
   *
   * E.g., `500`
   */
  end?: any;

  /**
   * Specifies the label to generate for this range.
   *
   * E.g., `0 - 500`
   */
  label?: string;

  /**
   * Specifies whether to include the value of the [end]{@link IRangeValue.end} property in this range.
   */
  endInclusive?: boolean;
}
