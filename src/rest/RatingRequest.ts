/**
 * The `IRatingRequest` interface describes a request to rate an item in the index.
 */
export interface IRatingRequest {
  /**
   * Contains the unique ID of the item to rate.
   */
  uniqueId: string;

  /**
   * Contains the rating description.
   *
   * Possible values are `Undefined` | `Lowest` | `Low` | `Average` | `Good` | `Best`.
   */
  rating: string;
}
