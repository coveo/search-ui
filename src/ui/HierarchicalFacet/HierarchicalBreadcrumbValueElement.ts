import { BreadcrumbValueElement } from '../Facet/BreadcrumbValueElement';
import { FacetValue } from '../Facet/FacetValues';
import { HierarchicalFacet } from './HierarchicalFacet';
import { Dom } from '../../utils/Dom';
import * as _ from 'underscore';

export class HierarchicalBreadcrumbValueElement extends BreadcrumbValueElement {
  constructor(public facet: HierarchicalFacet, public facetValue: FacetValue) {
    super(facet, facetValue);
  }

  public build(): Dom {
    var build = super.build();
    build.addClass('coveo-hierarchical-facet-value');
    var caption = build.find('.coveo-facet-breadcrumb-caption');
    var values = this.facetValue.value.split(this.facet.options.delimitingCharacter);
    values = _.map(values, v => {
      return _.escape(v);
    });
    caption.innerHTML = values.join("<span class='coveo-hierarchical-breadcrumb-separator'></span>");
    return build;
  }
}
