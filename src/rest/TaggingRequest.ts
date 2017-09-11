/**
 * The `ITaggingRequest` interface describes a tag request on an item.
 */
export interface ITaggingRequest {
  /**
   * Contains the field name to tag.
   */
  fieldName: string;

  /**
   * Contains the value to tag.
   */
  fieldValue: string;

  /**
   * Indicates whether to add the tag value, or to remove the tag value.
   */
  doAdd: boolean;

  /**
   * Contains the unique ID of the item to tag.
   */
  uniqueId: string;
}
