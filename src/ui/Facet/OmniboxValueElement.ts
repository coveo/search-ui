/// <reference path="../../Base.ts" />

module Coveo {
  export interface OmniboxValueElementKlass {
    new (facet: Facet, facetValue: FacetValue, eventArg: PopulateOmniboxObject, onSelect?: (elem: ValueElement, cause: IAnalyticsActionCause) => void, onExclude?: (elem: ValueElement, cause: IAnalyticsActionCause) => void): OmniboxValueElement;
  }
  export class OmniboxValueElement extends ValueElement {
    constructor(public facet: Facet, public facetValue: FacetValue, public eventArg: PopulateOmniboxObject, onSelect?: (elem: ValueElement, cause: IAnalyticsActionCause) => void, onExclude?: (elem: ValueElement, cause: IAnalyticsActionCause) => void) {
      super(facet, facetValue, onSelect, onExclude)
    }

    public bindEvent() {
      super.bindEvent({ displayNextTime: false, pinFacet: false, omniboxObject: this.eventArg });
    }
  }
} 