/**
 * The allowed states of a facet value in a Search API facet
 * [request]{@link IFacetRequestValue.state} or
 * [response]{@link IFacetResponseValue.state}.
 */
export enum FacetValueState {
  /**
   * The facet value is not currently selected or excluded in the search
   * interface.
   */
  idle = 'idle',
  /**
   * The facet value is currently selected in the search interface.
   */
  selected = 'selected'
}
