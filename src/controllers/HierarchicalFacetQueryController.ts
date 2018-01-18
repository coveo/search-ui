/// <reference path="../ui/HierarchicalFacet/HierarchicalFacet.ts" />
/// <reference path="./FacetQueryController.ts" />

import { FacetQueryController } from './FacetQueryController';
import { HierarchicalFacet, IValueHierarchy } from '../ui/HierarchicalFacet/HierarchicalFacet';
import { FacetSearchParameters } from '../ui/Facet/FacetSearchParameters';
import { IIndexFieldValue } from '../rest/FieldValue';
import { FacetUtils } from '../ui/Facet/FacetUtils';
import * as _ from 'underscore';

export class HierarchicalFacetQueryController extends FacetQueryController {
  constructor(public facet: HierarchicalFacet) {
    super(facet);
  }

  public search(params: FacetSearchParameters, oldLength = params.nbResults): Promise<IIndexFieldValue[]> {
    // Do a client side search, since HierarchicalFacet should normally have all value client side
    let regex = FacetUtils.getRegexToUseForFacetSearch(
      this.facet.facetSearch.getValueInInputForFacetSearch(),
      this.facet.options.facetSearchIgnoreAccents
    );
    return new Promise<IIndexFieldValue[]>(resolve => {
      const match = _.chain(this.facet.getAllValueHierarchy())
        .toArray()
        .filter((v: IValueHierarchy) => {
          return (
            this.facet.getValueCaption(v.facetValue).match(regex) != null &&
            !_.contains(<any>_.map(params.alwaysExclude, toExclude => toExclude.toLowerCase()), v.facetValue.value.toLowerCase())
          );
        })
        .first(this.facet.options.numberOfValuesInFacetSearch)
        .value();

      const facetValues: IIndexFieldValue[] = _.map(match, (v: IValueHierarchy) => {
        return <any>v.facetValue;
      });

      resolve(facetValues);
    });
  }

  protected getAllowedValuesFromSelected() {
    return [];
  }
}
