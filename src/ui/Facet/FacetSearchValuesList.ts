/// <reference path="Facet.ts" />
import {Facet} from './Facet';
import {FacetValueElementKlass} from './FacetValueElement';
import {FacetValue} from './FacetValues';

export interface FacetSearchValuesListKlass {
  new (facet: Facet, facetValueElementKlass: FacetValueElementKlass): FacetSearchValuesList;
}

export class FacetSearchValuesList {
  constructor(public facet: Facet, public facetValueElementKlass: FacetValueElementKlass) {
  }

  public build(facetValues: FacetValue[]): HTMLElement[] {
    var valuesToBuildWith = _.map(facetValues, (facetValue) => {
      return _.find(this.facet.values.getAll(), (valueAlreadyInFacet: FacetValue) => {
        return valueAlreadyInFacet.value == facetValue.value
      }) || facetValue
    });
    return _.map(valuesToBuildWith, (facetValue) => {
      return new this.facetValueElementKlass(this.facet, facetValue, this.facet.keepDisplayedValuesNextTime).build().renderer.listElement;
    })
  }
}
