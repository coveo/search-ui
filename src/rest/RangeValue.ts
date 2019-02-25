/**
 * Describes a single range value to request in a [Group By](https://docs.coveo.com/en/203/) operation.
 */
export interface IRangeValue {
  /**
   * The value to start the range at.
   *
   * **Examples:**
   * > - `0`
   * > - `2018-01-01T00:00:00.000Z`
   */
  start?: any;

  /**
   * The value to end the range at.
   *
   * **Examples:**
   * > - `500`
   * > - `2018-12-31T23:59:59.999Z`
   */
  end?: any;

  /**
   * The label to associate with the range value.
   *
   * **Examples:**
   * > - `0 - 500`
   * > - `In 2018`
   */
  label?: string;

  /**
   * Whether to include the [`end`]{@link IRangeValue.end} value in the range.
   */
  endInclusive?: boolean;
}
