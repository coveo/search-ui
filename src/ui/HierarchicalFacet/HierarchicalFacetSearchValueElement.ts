/// <reference path="../../Base.ts" />

module Coveo {
  export class HierarchicalFacetSearchValueElement extends FacetValueElement {
    constructor(public facet: HierarchicalFacet, public facetValue: FacetValue, public keepDisplayedValueNextTime: boolean) {
      super(facet, facetValue, keepDisplayedValueNextTime);
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