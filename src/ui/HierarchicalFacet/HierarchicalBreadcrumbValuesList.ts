/// <reference path="HierarchicalFacet.ts" />

import {BreadcrumbValueList} from '../Facet/BreadcrumbValuesList';
import {HierarchicalFacet, ValueHierarchy} from './HierarchicalFacet';
import {FacetValue} from '../Facet/FacetValues';
import {HierarchicalBreadcrumbValueElement} from './HierarchicalBreadcrumbValueElement';

export class HierarchicalBreadcrumbValuesList extends BreadcrumbValueList {
  constructor(public facet: HierarchicalFacet, public facetValues: FacetValue[], public valueHierarchy: { [facetValue: string]: ValueHierarchy }) {
    super(facet, facetValues, HierarchicalBreadcrumbValueElement);
  }
}
