/// <reference path="HierarchicalFacet.ts" />

import { FacetValuesList } from '../Facet/FacetValuesList';
import { FacetValue } from '../Facet/FacetValues';
import { HierarchicalFacet, IValueHierarchy } from './HierarchicalFacet';
import { IFacetValueElementKlass } from '../Facet/FacetValueElement';
import * as _ from 'underscore';

export class HierarchicalFacetValuesList extends FacetValuesList {
  public hierarchyFacetValues: FacetValue[];

  constructor(public facet: HierarchicalFacet, public facetValueElementKlass: IFacetValueElementKlass) {
    super(facet, facetValueElementKlass);
  }

  public sortFacetValues(hierarchyFacetValues = this.hierarchyFacetValues): FacetValue[] {
    if (!this.facet.shouldReshuffleFacetValuesClientSide) {
      let sortArray = _.map(hierarchyFacetValues, (hierarchy: FacetValue, idx: number) => {
        return {
          hierarchy: hierarchy,
          idx: idx
        };
      });

      // If we exclude the top level, the alpha order is not respected (since it is done by the index, and the first level is omitted by client side code).
      // Do the ordering client side, in the precise case where its alpha ordering and the starting level is not 0;
      if (
        this.facet.options.levelStart != 0 &&
        this.facet.options.sortCriteria &&
        this.facet.options.sortCriteria.toLowerCase().indexOf('alpha') != -1
      ) {
        let reversed = this.facet.options.sortCriteria.toLowerCase().indexOf('descending') != -1;

        sortArray = sortArray.sort((first, second) => {
          let firstInTopLevel =
            _.find(this.facet.topLevelHierarchy, (hierarchy: IValueHierarchy) => {
              return hierarchy.facetValue.value.toLowerCase() == first.hierarchy.value.toLowerCase();
            }) != null;

          let secondInTopLevel =
            _.find(this.facet.topLevelHierarchy, (hierarchy: IValueHierarchy) => {
              return hierarchy.facetValue.value.toLowerCase() == first.hierarchy.value.toLowerCase();
            }) != null;

          if (firstInTopLevel && secondInTopLevel) {
            let firstValue = this.facet.getValueCaption(first.hierarchy);
            let secondValue = this.facet.getValueCaption(second.hierarchy);
            let compared = firstValue.localeCompare(secondValue);
            return reversed ? -1 * compared : compared;
          }
          return first.idx - second.idx;
        });
      }

      // Normally facet values are sorted by selected first, then inactive, then excluded values.
      // For hierarchical, we want selected first, then those that have childs selected, then normal sorting.
      sortArray = sortArray.sort((first, second) => {
        if (first.hierarchy.selected === second.hierarchy.selected) {
          let firstFromHierarchy = this.facet.getValueFromHierarchy(first.hierarchy);
          let secondFromHierarchy = this.facet.getValueFromHierarchy(second.hierarchy);
          if (firstFromHierarchy.hasChildSelected === secondFromHierarchy.hasChildSelected) {
            return first.idx - second.idx;
          } else {
            return firstFromHierarchy.hasChildSelected ? -1 : 1;
          }
        } else {
          return first.hierarchy.selected ? -1 : 1;
        }
      });
      return _.pluck(sortArray, 'hierarchy');
    }
    return hierarchyFacetValues;
  }

  protected getValuesToBuildWith() {
    if (this.facet.shouldReshuffleFacetValuesClientSide) {
      return this.hierarchyFacetValues;
    } else {
      return this.sortFacetValues();
    }
  }
}
