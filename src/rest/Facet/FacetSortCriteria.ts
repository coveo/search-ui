export enum FacetSortCriteria {
  score = 'score',
  alphaascending = 'alphaascending',
  alphadescending = 'alphadescending',
  occurrences = 'occurrences'
}

export function isFacetSortCriteria(sortCriteria: string) {
  return !!FacetSortCriteria[sortCriteria];
}
