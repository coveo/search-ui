/**
 * The allowed sort criteria for a Search API
 * [facet request]{@link IFacetRequest}.
 */
export enum FacetSortCriteria {
  /**
   * Sort facet values in descending score order.
   *
   * Facet value scores are based on number of occurrences and position in the
   * ranked query result set.
   *
   * The Coveo Machine Learning dynamic navigation experience feature only
   * works with this sort criterion.
   */
  score = 'score',
  /**
   * Sort facet values in ascending alphanumeric order.
   */
  alphanumeric = 'alphanumeric',
  /**
   * Sort facet values in descending number of occurences.
   */
  occurrences = 'occurrences'
}

export function isFacetSortCriteria(sortCriteria: string) {
  return !!FacetSortCriteria[sortCriteria];
}
