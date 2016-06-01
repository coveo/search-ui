/**
 * Describe an exception that was triggered by the index when performing the query.
 */
export interface IQueryException {
  /**
   * The exception code
   */
  code: string;
  context: string;
}
