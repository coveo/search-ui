export enum FacetSortCriteria {
  score = 'score',
  alphaascending = 'alphaascending',
  alphadescending = 'alphadescending',
  occurrences = 'occurrences'
}

export function isFacetSortCriteria(sortCriteria: string): sortCriteria is FacetSortCriteria {
  return (
    Object.keys(FacetSortCriteria)
      .map(key => FacetSortCriteria[key])
      .indexOf(sortCriteria) !== -1
  );
}
