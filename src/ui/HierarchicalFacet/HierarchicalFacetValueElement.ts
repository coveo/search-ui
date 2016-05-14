/// <reference path="../../Base.ts" />

module Coveo {
  export class HierarchicalFacetValueElement extends FacetValueElement {
    constructor(public facet:HierarchicalFacet, public facetValue:FacetValue, public keepDisplayedValueNextTime:boolean) {
      super(facet, facetValue, keepDisplayedValueNextTime)
    }
  }
} 
