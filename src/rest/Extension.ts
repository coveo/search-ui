/**
 * Information about a query extension
 */
export interface IExtension {
  /**
   * The name of the extension
   */
  name: string;
  /**
   * An array of all possible arguments
   */
  argumentNames: string[];
}
