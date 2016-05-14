/// <reference path='../Base.ts' />

module Coveo {
  export class HierarchicalFacetQueryController extends FacetQueryController {
    private lastGroupByIndexForCountOf: number;
    public lastGroupByForCountOf: GroupByResult;

    constructor(public facet: HierarchicalFacet) {
      super(facet);
    }
  }
}