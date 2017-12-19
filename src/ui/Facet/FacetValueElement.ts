/// <reference path="Facet.ts" />

import { Facet } from './Facet';
import { FacetValue } from './FacetValues';
import { ValueElement } from './ValueElement';

export interface IFacetValueElementKlass {
  new (facet: Facet, facetValue: FacetValue, displayNextTime?: boolean): FacetValueElement;
}

export class FacetValueElement extends ValueElement {
  constructor(public facet: Facet, public facetValue: FacetValue, public keepDisplayedValueNextTime: boolean) {
    super(facet, facetValue);
  }

  public bindEvent() {
    super.bindEvent({
      displayNextTime: this.keepDisplayedValueNextTime,
      pinFacet: this.facet.options.preservePosition
    });
  }
}
