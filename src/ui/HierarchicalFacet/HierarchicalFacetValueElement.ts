/// <reference path="HierarchicalFacet.ts" />

import { FacetValueElement } from '../Facet/FacetValueElement';
import { HierarchicalFacet } from './HierarchicalFacet';
import { FacetValue } from '../Facet/FacetValues';

export class HierarchicalFacetValueElement extends FacetValueElement {
  constructor(public facet: HierarchicalFacet, public facetValue: FacetValue, public keepDisplayedValueNextTime: boolean) {
    super(facet, facetValue, keepDisplayedValueNextTime);
  }
}
