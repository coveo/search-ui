/// <reference path="HierarchicalFacet.ts" />

import {FacetValuesList} from '../Facet/FacetValuesList';
import {FacetValue} from '../Facet/FacetValues';
import {HierarchicalFacet} from './HierarchicalFacet';
import {FacetValueElementKlass} from '../Facet/FacetValueElement';

export class HierarchicalFacetValuesList extends FacetValuesList {
  public hierarchyFacetValues: FacetValue[];

  constructor(public facet: HierarchicalFacet, public facetValueElementKlass: FacetValueElementKlass) {
    super(facet, facetValueElementKlass);
  }

  protected getValuesToBuildWith() {
    return this.hierarchyFacetValues;
  }
}
