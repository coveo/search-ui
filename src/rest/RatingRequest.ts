/**
 * Describe a request to rate a document in the index
 */
export interface IRatingRequest {
  /**
   * The uniqueId of the document to rate
   */
  uniqueId: string;
  /**
   * String to describe the rating.<br/>
   * Can be 'Undefined' | 'Lowest' | 'Low' | 'Average' | 'Good' | 'Best'
   */
  rating: string;
}
