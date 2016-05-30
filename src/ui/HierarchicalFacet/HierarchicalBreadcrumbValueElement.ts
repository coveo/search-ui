import {BreadcrumbValueElement} from '../Facet/BreadcrumbValueElement';
import {FacetValue} from '../Facet/FacetValues';
import {HierarchicalFacet} from './HierarchicalFacet';
import {Dom} from '../../utils/Dom';

export class HierarchicalBreadcrumbValueElement extends BreadcrumbValueElement {
  constructor(public facet: HierarchicalFacet, public facetValue: FacetValue) {
    super(facet, facetValue);
  }

  public build() {
    var build = super.build();
    build.addClass('coveo-hierarchical-facet-value');
    var caption = build.find('.coveo-facet-value-caption');
    caption.innerHTML = this.facetValue.value.split(this.facet.options.delimitingCharacter).join("<span class='coveo-hierarchical-breadcrumb-separator'></span>");
    return build;
  }
}
