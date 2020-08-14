import { FacetValueElement } from '../Facet/FacetValueElement';
import { HierarchicalFacet } from '../HierarchicalFacet/HierarchicalFacet';
import { IValueElementEventsBinding } from '../Facet/ValueElement';
import { FacetValue } from '../Facet/FacetValue';

export class HierarchicalFacetSearchValueElement extends FacetValueElement {
  constructor(public facet: HierarchicalFacet, public facetValue: FacetValue, public keepDisplayedValueNextTime: boolean) {
    super(facet, facetValue, keepDisplayedValueNextTime);
  }

  public _handleSelectValue(eventBindings: IValueElementEventsBinding) {
    this.facet.open(this.facetValue);
    super.handleSelectValue(eventBindings);
  }

  public _handleExcludeClick(eventBindings: IValueElementEventsBinding) {
    this.facet.open(this.facetValue);
    super.handleExcludeClick(eventBindings);
  }
}
