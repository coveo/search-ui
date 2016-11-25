/// <reference path="../ui/HierarchicalFacet/HierarchicalFacet.ts" />
/// <reference path="./FacetQueryController.ts" />

import {FacetQueryController} from './FacetQueryController';
import {IGroupByResult} from '../rest/GroupByResult';
import {HierarchicalFacet, IValueHierarchy} from '../ui/HierarchicalFacet/HierarchicalFacet';
import {FacetSearchParameters} from '../ui/Facet/FacetSearchParameters';
import {IIndexFieldValue} from '../rest/FieldValue';
import {FacetUtils} from '../ui/Facet/FacetUtils';

export class HierarchicalFacetQueryController extends FacetQueryController {
  public lastGroupByForCountOf: IGroupByResult;

  constructor(public facet: HierarchicalFacet) {
    super(facet);
  }

  public search(params: FacetSearchParameters, oldLength = params.nbResults): Promise<IIndexFieldValue[]> {
    let regex = FacetUtils.getRegexToUseForFacetSearch(this.facet.facetSearch.getValueInInputForFacetSearch(), this.facet.options.facetSearchIgnoreAccents);
    return new Promise((resolve, reject)=> {
      let match = _.filter(_.toArray(this.facet.getAllValueHierarchy()), (v: IValueHierarchy)=> {
        return this.facet.getValueCaption(v.facetValue).match(regex) != null;
      });
      resolve(_.map(match, (v: IValueHierarchy)=> {
        return v.facetValue;
      }))
    })
  }
}
