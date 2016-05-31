/// <reference path="../ui/HierarchicalFacet/HierarchicalFacet.ts" />
/// <reference path="./FacetQueryController.ts" />

import {FacetQueryController} from './FacetQueryController';
import {IGroupByResult} from '../rest/GroupByResult';
import {HierarchicalFacet} from '../ui/HierarchicalFacet/HierarchicalFacet';

export class HierarchicalFacetQueryController extends FacetQueryController {
  private lastGroupByIndexForCountOf: number;
  public lastGroupByForCountOf: IGroupByResult;

  constructor(public facet: HierarchicalFacet) {
    super(facet);
  }
}
