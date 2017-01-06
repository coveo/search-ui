/// <reference path="HierarchicalFacet.ts" />

import {FacetValuesList} from '../Facet/FacetValuesList';
import {FacetValue} from '../Facet/FacetValues';
import {HierarchicalFacet} from './HierarchicalFacet';
import {IFacetValueElementKlass} from '../Facet/FacetValueElement';

export class HierarchicalFacetValuesList extends FacetValuesList {
  public hierarchyFacetValues: FacetValue[];

  constructor(public facet: HierarchicalFacet, public facetValueElementKlass: IFacetValueElementKlass) {
    super(facet, facetValueElementKlass);
  }

  public sortFacetValues(hierarchyFacetValues = this.hierarchyFacetValues): FacetValue[] {
    // Normally facet values are sorted by selected first, then inactive, then excluded values.
    // For hierarchical, we want selected first, then those that have childs selected, then normal sorting.
    hierarchyFacetValues = hierarchyFacetValues.sort((first, second) => {
      if (first.selected === second.selected) {
        let firstFromHierarchy = this.facet.getValueFromHierarchy(first);
        let secondFromHierarchy = this.facet.getValueFromHierarchy(second);
        return (firstFromHierarchy.hasChildSelected === secondFromHierarchy.hasChildSelected) ? 0 : firstFromHierarchy.hasChildSelected ? -1 : 1;
      }
    });
    return hierarchyFacetValues;
  }

  protected getValuesToBuildWith() {
    if (this.facet.keepDisplayedValuesNextTime) {
      return this.hierarchyFacetValues;
    } else {
      return this.sortFacetValues();
    }
  }
}
