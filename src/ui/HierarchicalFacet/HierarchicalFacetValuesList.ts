/// <reference path="../../Base.ts" />

module Coveo {
  export class HierarchicalFacetValuesList extends FacetValuesList {
    public hierarchyFacetValues: FacetValue[];

    constructor(public facet: HierarchicalFacet, public facetValueElementKlass: FacetValueElementKlass) {
      super(facet, facetValueElementKlass);
    }

    protected getValuesToBuildWith() {
      return this.hierarchyFacetValues;
    }
  }
} 