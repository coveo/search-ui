/**
 * Information about a single field in the index
 */
export interface IFieldDescription {
  /**
   * It's type, as a string
   */
  type: string;
  /**
   * It's name, as a string
   */
  name: string;
  /**
   * A small(ish) description of the field
   */
  description: string;
  /**
   * The default value of the field
   */
  defaultValue: string;
  /**
   * It's fieldType, as a string.<br/>
   * eg: Date, Double, Integer, LargeString, Long, SmallString
   */
  fieldType: string;
  /**
   * It's fieldSourceType, as a string.
   */
  fieldSourceType: string;
  /**
   * Gets whether the field can be referenced in a query.
   */
  includeInQuery: boolean;
  /**
   * Gets whether the field is returned with results.
   */
  includeInResults: boolean;
  /**
   * Gets whether the field is considered groupBy (facet)
   */
  groupByField: boolean;
  /**
   * Gets whether the field is considered splitGroupBy (facet with ; between values)
   */
  splitGroupByField: boolean;
  /**
   * Gets whether the field can be used to sort results
   */
  sortByField: boolean;
}
