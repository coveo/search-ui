/// <reference path="Facet.ts" />

import {Facet} from './Facet';
import {FacetValue} from './FacetValues';
import {QueryEvents} from '../../events/QueryEvents';
import {$$} from '../../utils/Dom';
import {ValueElement} from './ValueElement';


export interface IFacetValueElementKlass {
  new (facet: Facet, facetValue: FacetValue, displayNextTime?: boolean): FacetValueElement;
}

export class FacetValueElement extends ValueElement {
  private firstQuery = true;

  constructor(public facet: Facet, public facetValue: FacetValue, public keepDisplayedValueNextTime: boolean) {
    super(facet, facetValue);
    // The analytics code expect a first query to be made to link the user action with a query UID
    $$(facet.root).one(QueryEvents.querySuccess, () => {
      this.firstQuery = false;
    })
  }

  public bindEvent() {
    super.bindEvent({ displayNextTime: this.keepDisplayedValueNextTime, pinFacet: this.facet.options.preservePosition });
  }
}
