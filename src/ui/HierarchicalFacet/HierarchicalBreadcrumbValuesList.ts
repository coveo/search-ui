/// <reference path="HierarchicalFacet.ts" />

import { BreadcrumbValueList } from '../Facet/BreadcrumbValuesList';
import { HierarchicalFacet, IValueHierarchy } from './HierarchicalFacet';
import { FacetValue } from '../Facet/FacetValues';
import { HierarchicalBreadcrumbValueElement } from './HierarchicalBreadcrumbValueElement';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';

export class HierarchicalBreadcrumbValuesList extends BreadcrumbValueList {
  constructor(
    public facet: HierarchicalFacet,
    public facetValues: FacetValue[],
    public valueHierarchy: { [facetValue: string]: IValueHierarchy }
  ) {
    super(facet, facetValues, HierarchicalBreadcrumbValueElement);
  }

  public buildAsString() {
    this.build();
    if (this.elem) {
      let joined =
        `${this.facet.options.title}: ` +
        _.map($$(this.elem).findAll('.coveo-facet-breadcrumb-value'), (value: HTMLElement) => {
          _.each($$(value).findAll('.coveo-hierarchical-breadcrumb-separator'), separator => {
            // small right black triangle
            $$(separator).text('\u25B8');
          });
          return $$(value).text();
        }).join(', ');
      return joined;
    }
    return '';
  }
}
