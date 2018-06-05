/**
 * The possible values for the [allowedValuesPatternType]{@link IGroupByRequest.allowedValuesPatternType} property of the `IGroupByRequest` interface.
 */
export enum AllowedValuesPatternType {
  /**
   * Only supports trailing wildcards in the pattern.
   */
  Legacy = 'legacy',
  /**
   * Fully supports wildcards.
   */
  Wildcards = 'wildcards',
  /**
   * Supports regular expression as the pattern.
   */
  Regex = 'regex',
  /**
   *Applies the Edit Distance algorithm to match values that are close to the specified pattern.
   */
  EditDistance = 'editdistance',
  /**
   *Applies a phonetic algorithm to match values that are phonetically similar to the specified pattern.
   */
  Phonetic = 'phonetic'
}
