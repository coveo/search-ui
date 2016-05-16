

module Coveo {
  export class HierarchicalBreadcrumbValuesList extends BreadcrumbValueList {
    constructor(public facet: HierarchicalFacet, public facetValues: FacetValue[], public valueHierarchy: { [facetValue: string]: ValueHierarchy }) {
      super(facet, facetValues, HierarchicalBreadcrumbValueElement);
    }
  }
}