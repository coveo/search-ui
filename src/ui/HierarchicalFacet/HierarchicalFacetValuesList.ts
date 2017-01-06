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

  protected getValuesToBuildWith() {
    if (this.facet.keepDisplayedValuesNextTime) {
      return this.hierarchyFacetValues;
    } else {
      let ret = [];
      let groupedByLevel = _.chain(this.facet.getAllValueHierarchy())
        .toArray()
        .groupBy('level')
        .value();

      _.each(groupedByLevel, (groupByLevel: IValueHierarchy[]) => {
        groupByLevel = groupByLevel.sort((first, second) => {
          if (first.facetValue.selected === second.facetValue.selected) {
            return (first.hasChildSelected === second.hasChildSelected) ? 0 : first.hasChildSelected ? -1 : 1;
          }
          return 0;
        });
        ret = ret.concat(groupByLevel);
      });
      return _.pluck(ret, 'facetValue');
    }

  }
}
