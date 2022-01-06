import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';

export function filterDuplicateFacetValues(values: IFacetResponseValue[]) {
  let resolvedValues: IFacetResponseValue[] = [];
  const map: Record<string, IFacetResponseValue[]> = {};

  values.forEach(facetValue => {
    const value = facetValue.value;
    const lowercase = value.toLowerCase();

    const entry = map[lowercase];

    map[lowercase] = entry ? entry.concat(facetValue) : [facetValue];
  });

  Object.keys(map).forEach(key => {
    const collection = map[key];

    if (collection.length < 2) {
      resolvedValues = resolvedValues.concat(collection);
      return;
    }

    const sorted = collection.sort((a, b) => b.numberOfResults - a.numberOfResults);
    const state = resolveState(sorted);
    const [facetValueSourceOfTruth] = sorted;
    resolvedValues.push({ ...facetValueSourceOfTruth, state });
  });

  return resolvedValues;
}

function resolveState(facetValues: IFacetResponseValue[]) {
  const hasNonIdleValue = facetValues.some(facetValue => facetValue.state !== FacetValueState.idle);
  return hasNonIdleValue ? FacetValueState.selected : FacetValueState.idle;
}
