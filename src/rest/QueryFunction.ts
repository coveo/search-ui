/**
 * Describe a query function that can be executed against the index<br/>
 * See: [Query Functions](https://docs.coveo.com/en/1451/)
 */
export interface IQueryFunction {
  /**
   * Function to execute, as a string
   */
  function: string;
  /**
   * The field name on which to store the query function result when the query returns
   */
  fieldName: string;
}
