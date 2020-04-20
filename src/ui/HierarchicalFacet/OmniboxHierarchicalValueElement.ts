/// <reference path="HierarchicalFacet.ts" />

import { OmniboxValueElement } from '../Facet/OmniboxValueElement';
import { HierarchicalFacet } from './HierarchicalFacet';
import { FacetValue } from '../Facet/FacetValue';
import { IPopulateOmniboxObject } from '../Omnibox/OmniboxInterface';
import { IValueElementEventsBinding } from '../Facet/ValueElement';

export class OmniboxHierarchicalValueElement extends OmniboxValueElement {
  constructor(public facet: HierarchicalFacet, public facetValue: FacetValue, public eventArg: IPopulateOmniboxObject) {
    super(facet, facetValue, eventArg);
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
