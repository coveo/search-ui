/**
 * Argument sent to all handlers bound on {@link QuerySummaryEvents.cancelLastAction}
 */
export interface IQuerySummaryCancelLastActionArgs {}

/**
 * This static class is there to contains the different string definition for all the events related to the {@link AdvancedSearch} component.
 */
export class QuerySummaryEvents {
  /**
   * Triggered when the last action is being cancelled by the query summary component
   *
   * Allows external code to revert their last action.
   * @type {string}
   */
  public static cancelLastAction = 'cancelLastAction';
}
