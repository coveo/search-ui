import { DynamicFacet } from '../DynamicFacet';
import { FacetUtils } from '../../Facet/FacetUtils';
import { ValueFormatter } from './DynamicFacetValues';

export class DynamicFacetValueFormatter implements ValueFormatter {
  constructor(private facet: DynamicFacet) {}

  public format(value: string) {
    let returnValue = FacetUtils.tryToGetTranslatedCaption(<string>this.facet.options.field, value);

    if (this.facet.options.valueCaption && typeof this.facet.options.valueCaption === 'object') {
      returnValue = this.facet.options.valueCaption[value] || returnValue;
    }

    return returnValue;
  }
}
