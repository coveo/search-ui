/// <reference path="HierarchicalFacet.ts" />

import {FacetSearch} from '../Facet/FacetSearch';
import {HierarchicalFacet} from './HierarchicalFacet';
import {IFacetSearchValuesListKlass} from '../Facet/FacetSearchValuesList'
import {FacetSearchParameters} from '../Facet/FacetSearchParameters';

export class HierarchicalFacetSearch extends FacetSearch {
  constructor(public facet: HierarchicalFacet, public facetSearchValuesListKlass: IFacetSearchValuesListKlass) {
    super(facet, facetSearchValuesListKlass)
  }

  protected buildParamsForExcludingCurrentlyDisplayedValues() {
    var params = super.buildParamsForExcludingCurrentlyDisplayedValues();
    params.alwaysExclude = this.facet.getDisplayedValues();
    if (this.facet.facetSearch.currentlyDisplayedResults) {
      params.alwaysExclude = params.alwaysExclude.concat(this.facet.facetSearch.currentlyDisplayedResults);
    }
    return params;
  }
}
