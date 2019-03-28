/**
 * The allowed [`sortCriteria`]{@link MLFacet.options.sortCriteria} option
 * values for the `MLFacet` component.
 */
export enum FacetSortCriteria {
  /**
   * Sort facet values in descending score order.
   *
   * Facet value scores are based on number of occurrences and position in the
   * ranked query result set.
   *
   * The Coveo ML _Facet Sense_ feature only works with the Score sort criterion.
   */
  Score = 'score',

  /**
   * Sort facet values in ascending alphanumeric order.
   */
  Alphanumeric = 'alphanumeric',
  Occurrences = 'occurrences'
}

export function isFacetSortCriteria(sortCriteria: string) {
  return !!FacetSortCriteria[sortCriteria];
}
