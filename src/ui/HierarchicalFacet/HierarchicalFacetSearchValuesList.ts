/// <reference path='../../Base.ts' />
/// <reference path="HierarchicalFacetSearchValueElement.ts" />
module Coveo {
  export class HierarchicalFacetSearchValuesList extends FacetSearchValuesList {
    constructor(public facet: Facet) {
      super(facet, HierarchicalFacetSearchValueElement);
    }
  }
} 