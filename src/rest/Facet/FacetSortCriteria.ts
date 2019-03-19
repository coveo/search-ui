export enum FacetSortCriteria {
  score = 'score',
  alphaascending = 'alphaascending',
  alphadescending = 'alphadescending',
  occurrences = 'occurrences'
}

export function isFacetSortCriteria(sortCriteria: string) {
  return (
    Object.keys(FacetSortCriteria)
      .map(key => FacetSortCriteria[key])
      .indexOf(sortCriteria) !== -1
  );
}
