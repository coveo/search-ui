import { IGroupByValue } from './GroupByValue';

/**
 * A result for a {@link IGroupByRequest}.
 *
 * This is typically what the {@link Facet} component will use to render themselves.
 */
export interface IGroupByResult {
  /**
   * The field on which the group by was performed.
   */
  field: string;
  /**
   * The differents values for this result
   */
  values: IGroupByValue[];
  /**
   * Available if there was any computed field request.
   */
  globalComputedFieldResults?: number[];
}
