/**
 * Describe a ranking expression performed against the index (qre)
 */
export interface IRankingExpression {
  /**
   * The expression that was executed in the ranking expression
   */
  expression: string;
  /**
   * The relevance modifier that was applied
   */
  modifier: string;
}
