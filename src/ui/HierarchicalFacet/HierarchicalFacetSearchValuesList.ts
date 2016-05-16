

module Coveo {
  export class HierarchicalFacetSearchValuesList extends FacetSearchValuesList {
    constructor(public facet: Facet) {
      super(facet, HierarchicalFacetSearchValueElement);
    }
  }
} 