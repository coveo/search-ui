

module Coveo {
  export class OmniboxHierarchicalValuesList extends OmniboxValuesList {
    constructor(public facet: HierarchicalFacet, public facetValues: FacetValue[], public omniboxObject: PopulateOmniboxObject) {
      super(facet, facetValues, omniboxObject, OmniboxHierarchicalValueElement);
    }
  }
}