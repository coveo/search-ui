import { $$, Dom } from '../../../utils/Dom';
import { INoNameFacetOptions } from '../NoNameFacetOptions';
import { NoNameFacet } from '../NoNameFacet';
import { NoNameFacetValue, INoNameFacetValue } from './NoNameFacetValue';

export class NoNameFacetValues {
  private list: Dom;
  public element: HTMLElement;

  constructor(private options: INoNameFacetOptions, private facet: NoNameFacet) {
    this.list = $$('ul', { className: 'coveo-facet-values' });
    this.element = this.list.el;
  }

  public updateValues(facetValues: INoNameFacetValue[]) {
    this.list.empty();

    facetValues.forEach(facetValue => {
      this.list.append(new NoNameFacetValue(this.options, facetValue, this.facet).element);
    });
  }
}
