

module Coveo {
  export class HierarchicalBreadcrumbValueElement extends BreadcrumbValueElement {
    constructor(public facet: HierarchicalFacet, public facetValue: FacetValue) {
      super(facet, facetValue);
    }

    public build() {
      var build = super.build();
      build.addClass('coveo-hierarchical-facet-value');
      build.find('.coveo-facet-value-caption').html(this.facetValue.value.split(this.facet.options.delimitingCharacter).join("<span class='coveo-hierarchical-breadcrumb-separator'></span>"));
      return build;
    }
  }
} 