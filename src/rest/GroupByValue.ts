import { IIndexFieldValue } from './FieldValue';

/**
 * Describe a single group by value, returned by a {@link IGroupByResult}
 */
export interface IGroupByValue extends IIndexFieldValue {
  /**
   * The string value. Think : Facet label.
   */
  value: string;
  /**
   * The lookup value if it was specified.
   */
  lookupValue?: string;
  /**
   * The number of results that match this value in the index for this particular group by request
   */
  numberOfResults: number;
  /**
   * The relevance score.
   */
  score: number;
  /**
   * If there was ny computed field request, the results will be available here.
   */
  computedFieldResults?: number[];
}
