import {
  IDynamicHierarchicalFacetSearchValueProperties,
  IDynamicHierarchicalFacet
} from '../DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { DynamicHierarchicalFacetSearchValueRenderer } from './DynamicHierarchicalFacetSearchValueRenderer';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';

export class DynamicHierarchicalFacetSearchValue implements IDynamicHierarchicalFacetSearchValueProperties {
  public renderer: DynamicHierarchicalFacetSearchValueRenderer;
  private element: HTMLElement;

  constructor(private facetValue: IDynamicHierarchicalFacetSearchValueProperties, private facet: IDynamicHierarchicalFacet) {
    this.renderer = new DynamicHierarchicalFacetSearchValueRenderer(this, facet);
  }

  public get fullPath() {
    return this.facetValue.fullPath;
  }

  public get displayValue() {
    return this.facetValue.displayValue;
  }

  public get numberOfResults() {
    return this.facetValue.numberOfResults;
  }

  public get moreValuesAvailable() {
    return this.facetValue.moreValuesAvailable;
  }

  public get renderedElement() {
    if (this.element) {
      return this.element;
    }

    return this.render();
  }

  public logSelectActionToAnalytics() {
    this.facet.logAnalyticsEvent(analyticsActionCauseList.dynamicFacetSelect);
  }

  private render() {
    this.element = this.renderer.render();
    return this.element;
  }
}
