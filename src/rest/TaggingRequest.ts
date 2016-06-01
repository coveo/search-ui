/**
 * Describe a tag request on a document
 */
export interface ITaggingRequest {
  /**
   * The field name to tag
   */
  fieldName: string;
  /**
   * The value to tag
   */
  fieldValue: string;
  /**
   * Decide whether to add the tag value, or remove the tag value
   */
  doAdd: boolean;
  /**
   * The unique id of the document to tag
   */
  uniqueId: string;
}
