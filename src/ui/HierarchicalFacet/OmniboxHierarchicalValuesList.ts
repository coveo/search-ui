/// <reference path="../HierarchicalFacet/HierarchicalFacet.ts" />

import { OmniboxValuesList } from '../Facet/OmniboxValuesList';
import { FacetValue } from '../Facet/FacetValue';
import { HierarchicalFacet } from '../HierarchicalFacet/HierarchicalFacet';
import { IPopulateOmniboxObject } from '../Omnibox/OmniboxInterface';
import { OmniboxHierarchicalValueElement } from './OmniboxHierarchicalValueElement';

export class OmniboxHierarchicalValuesList extends OmniboxValuesList {
  constructor(public facet: HierarchicalFacet, public facetValues: FacetValue[], public omniboxObject: IPopulateOmniboxObject) {
    super(facet, facetValues, omniboxObject, OmniboxHierarchicalValueElement);
  }
}
