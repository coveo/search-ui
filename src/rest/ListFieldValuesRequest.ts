import { IIndexFieldValue } from './FieldValue';

/**
 * Describe a request to list the possible values of a field.
 */
export interface IListFieldValuesRequest {
  /**
   * The field for which to list values
   */
  field: string;
  /**
   * The lookup field to use
   */
  lookupField?: string;
  /**
   * Whether to ignore accents in the values
   */
  ignoreAccents?: boolean;
  /**
   * The sort order for the returned field.
   */
  sortCriteria?: string;
  /**
   * Maximum number of field values to return
   */
  maximumNumberOfValues?: number;
  /**
   * A query to execute when returning possible field values
   */
  queryOverride?: string;
  /**
   * A query to execute when returning possible field values, put in cache in the index
   */
  constantQueryOverride?: string;
  /**
   * A pattern to filter out results
   */
  pattern?: string;
  /**
   * The type of the pattern (eg: regex)
   */
  patternType?: string;
}

/**
 * Describe a request to list the possible values of multiple fields.
 */
export interface IListFieldValuesBatchRequest {
  /**
   * The list of fields to request.
   */
  batch: IListFieldValuesRequest[];
}

export interface IFieldValueBatchResponse {
  batch: IIndexFieldValue[][];
}
