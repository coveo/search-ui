import { $$, Dom } from '../../../utils/Dom';
import { NoNameFacet } from '../NoNameFacet';
import { NoNameFacetValue } from './NoNameFacetValue';
import { NoNameFacetValueElement } from './NoNameFacetValueElement';

export class NoNameFacetValuesList {
  private list: Dom;
  public element: HTMLElement;

  constructor(private facet: NoNameFacet) {
    this.list = $$('ul', { className: 'coveo-facet-values' });
    this.element = this.list.el;
  }

  public renderValues(facetValues: NoNameFacetValue[]) {
    this.list.empty();

    facetValues.forEach(facetValue => {
      this.list.append(new NoNameFacetValueElement(this.facet, facetValue).element);
    });
  }
}
