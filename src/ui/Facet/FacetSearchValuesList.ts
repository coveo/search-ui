/// <reference path="Facet.ts" />
import { Facet } from './Facet';
import { IFacetValueElementKlass } from './FacetValueElement';
import { FacetValue } from './FacetValue';
import * as _ from 'underscore';

export interface IFacetSearchValuesListKlass {
  new (facet: Facet, facetValueElementKlass: IFacetValueElementKlass): FacetSearchValuesList;
}

export class FacetSearchValuesList {
  constructor(public facet: Facet, public facetValueElementKlass: IFacetValueElementKlass) {}

  public build(facetValues: FacetValue[]): HTMLElement[] {
    var valuesToBuildWith = _.map(facetValues, facetValue => {
      return (
        _.find(this.facet.values.getAll(), (valueAlreadyInFacet: FacetValue) => {
          return valueAlreadyInFacet.value == facetValue.value;
        }) || facetValue
      );
    });
    return _.map(valuesToBuildWith, facetValue => {
      const valueElement = new this.facetValueElementKlass(this.facet, facetValue, this.facet.keepDisplayedValuesNextTime).build();
      return valueElement.renderer.listItem;
    });
  }
}
