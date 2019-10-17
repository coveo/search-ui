export enum RangeEndScope {
  Inclusive = 'inc',
  Exclusive = 'exc'
}

export type RangeType = string | number | Date;

/**
 * Describes a single range value in a [group by request]{@link IGroupByRequest} or [facet request]{@link IFacetRequest}.
 */
export interface IRangeValue {
  /**
   * The value to start the range at.
   *
   * **Examples:**
   * > - `0`
   * > - `2018-01-01T00:00:00.000Z`
   */
  start?: RangeType;

  /**
   * The value to end the range at.
   *
   * **Examples:**
   * > - `500`
   * > - `2018-12-31T23:59:59.999Z`
   */
  end?: RangeType;

  /**
   * The label to associate with the range value.
   *
   * **Examples:**
   * > - `0 - 500`
   * > - `In 2018`
   */
  label?: string;

  /**
   * Whether to include the [`end`]{@link IRangeValue.end} value in the range.
   */
  endInclusive?: boolean;
}
