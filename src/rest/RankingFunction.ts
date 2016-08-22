/**
 * Describe a ranking function that can be executed against the index.<br/>
 * See : https://developers.coveo.com/display/SearchREST/Ranking+Function
 */
export interface IRankingFunction {
  /**
   * The mathematical expression that calculates the ranking value to add to the result score.
   */
  expression: string;
  /**
   * Whether to normalize the value using the standard index scale or not. If you don't want to completely override the index ranking and use the qrf as a boost, you should turn this on.
   */
  normalizeWeight: boolean;
}
