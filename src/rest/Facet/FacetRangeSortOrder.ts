export enum FacetRangeSortOrder {
  /**
   * Sort facet values in ascending order.
   */
  ascending = 'ascending',
  /**
   * Sort facet values in ascending order.
   */
  descending = 'descending'
}

export function isFacetRangeSortOrder(sortOrder: string) {
  return !!FacetRangeSortOrder[sortOrder];
}
