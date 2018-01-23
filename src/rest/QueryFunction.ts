/**
 * Describe a query function that can be executed against the index<br/>
 * See : https://developers.coveo.com/display/SearchREST/Query+Function
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
