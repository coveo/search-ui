

module Coveo {
  export class OmniboxHierarchicalValueElement extends OmniboxValueElement {
    constructor(public facet: HierarchicalFacet, public facetValue: FacetValue, public eventArg: PopulateOmniboxObject) {
      super(facet, facetValue, eventArg)
    }

    public _handleSelectValue(eventBindings: ValueElementEventsBinding) {
      this.facet.open(this.facetValue);
      super.handleSelectValue(eventBindings);
    }

    public _handleExcludeClick(eventBindings: ValueElementEventsBinding) {
      this.facet.open(this.facetValue);
      super.handleExcludeClick(eventBindings);
    }
  }
}  