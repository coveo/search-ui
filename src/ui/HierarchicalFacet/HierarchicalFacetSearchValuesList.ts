/// <reference path="../Facet/Facet.ts" />

import { Facet } from '../Facet/Facet';
import { FacetSearchValuesList } from '../Facet/FacetSearchValuesList';
import { HierarchicalFacetSearchValueElement } from './HierarchicalFacetSearchValueElement';

export class HierarchicalFacetSearchValuesList extends FacetSearchValuesList {
  constructor(public facet: Facet) {
    super(facet, HierarchicalFacetSearchValueElement);
  }
}
