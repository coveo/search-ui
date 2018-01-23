/// <reference path="Facet.ts" />

import { Facet } from './Facet';
import { FacetValue } from './FacetValues';
import { IPopulateOmniboxObject } from '../Omnibox/OmniboxInterface';
import { ValueElement } from './ValueElement';
import { IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';

export interface IOmniboxValueElementKlass {
  new (
    facet: Facet,
    facetValue: FacetValue,
    eventArg: IPopulateOmniboxObject,
    onSelect?: (elem: ValueElement, cause: IAnalyticsActionCause) => void,
    onExclude?: (elem: ValueElement, cause: IAnalyticsActionCause) => void
  ): OmniboxValueElement;
}

export class OmniboxValueElement extends ValueElement {
  constructor(
    public facet: Facet,
    public facetValue: FacetValue,
    public eventArg: IPopulateOmniboxObject,
    onSelect?: (elem: ValueElement, cause: IAnalyticsActionCause) => void,
    onExclude?: (elem: ValueElement, cause: IAnalyticsActionCause) => void
  ) {
    super(facet, facetValue, onSelect, onExclude);
  }

  public bindEvent() {
    super.bindEvent({ displayNextTime: false, pinFacet: false, omniboxObject: this.eventArg });
  }
}
