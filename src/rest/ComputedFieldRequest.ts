/**
 * Describe a computed field request<br/>
 * See: [Computed Fields](https://docs.coveo.com/en/1467/)
 */
export interface IComputedFieldRequest {
  /**
   * This specifies the field on which the aggregate operation will be performed. This field is typically a numerical value.
   */
  field: string;
  /**
   * This specifies the operation to execute on the field value.<br/>
   * Possible operations:
   * -- sum: Computes the sum of all values.
   * -- average: Computes the average of all values.
   * --minimum: Retrieves the smallest of all values.
   * --maximum: Retrieves the largest of all values.
   */
  operation: string;
}
