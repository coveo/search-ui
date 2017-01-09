/// <reference path="HierarchicalFacet.ts" />

import {FacetValuesList} from '../Facet/FacetValuesList';
import {FacetValue} from '../Facet/FacetValues';
import {HierarchicalFacet, IValueHierarchy} from './HierarchicalFacet';
import {IFacetValueElementKlass} from '../Facet/FacetValueElement';

export class HierarchicalFacetValuesList extends FacetValuesList {
  public hierarchyFacetValues: FacetValue[];

  constructor(public facet: HierarchicalFacet, public facetValueElementKlass: IFacetValueElementKlass) {
    super(facet, facetValueElementKlass);
  }

  public sortFacetValues(hierarchyFacetValues = this.hierarchyFacetValues): FacetValue[] {
    // If we exclude the top level, the alpha order is not respected (since it is done by the index, and the first level is omitted by client side code).
    // Do the ordering client side, in the precise case where its alpha ordering and the starting level is not 0;
    if (this.facet.options.levelStart != 0 && this.facet.options.sortCriteria && this.facet.options.sortCriteria.toLowerCase().indexOf('alpha') != -1) {
      let reversed = this.facet.options.sortCriteria.toLowerCase().indexOf('descending') != -1;

      hierarchyFacetValues = hierarchyFacetValues.sort((first, second) => {
        let firstInTopLevel = _.find(this.facet.topLevelHierarchy, (hierarchy: IValueHierarchy) => {
          return hierarchy.facetValue.value.toLowerCase() == first.value.toLowerCase();
        }) != null;

        let secondInTopLevel = _.find(this.facet.topLevelHierarchy, (hierarchy: IValueHierarchy) => {
          return hierarchy.facetValue.value.toLowerCase() == first.value.toLowerCase();
        }) != null;

        if (firstInTopLevel && secondInTopLevel) {
          let firstValue = this.facet.getValueCaption(first);
          let secondValue = this.facet.getValueCaption(second);
          let compared = firstValue.localeCompare(secondValue);
          return reversed ? -1 * compared : compared;
        }
        return 0;
      });
    }

    // Normally facet values are sorted by selected first, then inactive, then excluded values.
    // For hierarchical, we want selected first, then those that have childs selected, then normal sorting.
    hierarchyFacetValues = hierarchyFacetValues.sort((first, second) => {
      if (first.selected === second.selected) {
        let firstFromHierarchy = this.facet.getValueFromHierarchy(first);
        let secondFromHierarchy = this.facet.getValueFromHierarchy(second);
        return (firstFromHierarchy.hasChildSelected === secondFromHierarchy.hasChildSelected) ? 0 : firstFromHierarchy.hasChildSelected ? -1 : 1;
      }
      return 0;
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
