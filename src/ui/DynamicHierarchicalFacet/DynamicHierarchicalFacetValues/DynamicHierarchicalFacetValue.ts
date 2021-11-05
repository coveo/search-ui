import * as Globalize from 'globalize';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { DynamicHierarchicalFacetValueRenderer } from './DynamicHierarchicalFacetValueRenderer';
import { l } from '../../../strings/Strings';
import { DynamicFacetValueShowMoreLessButton } from '../../DynamicFacet/DynamicFacetValues/DynamicFacetValueMoreLessButton';
import {
  IDynamicHierarchicalFacetValue,
  IDynamicHierarchicalFacet,
  IDynamicHierarchicalFacetValueProperties
} from '../IDynamicHierarchicalFacet';
import { analyticsActionCauseList } from '../../Analytics/AnalyticsActionListMeta';

export class DynamicHierarchicalFacetValue implements IDynamicHierarchicalFacetValue {
  private renderer: DynamicHierarchicalFacetValueRenderer;
  private element: HTMLElement = null;
  public retrieveCount: number;

  constructor(private facetValue: IDynamicHierarchicalFacetValueProperties, private facet: IDynamicHierarchicalFacet) {
    this.renderer = new DynamicHierarchicalFacetValueRenderer(this, this.facet);
    this.retrieveCount = Math.max(this.facet.options.numberOfValues, this.facetValue.children.length);
  }

  public get value() {
    return this.facetValue.value;
  }

  public get path() {
    return this.facetValue.path;
  }

  public get state() {
    return this.facetValue.state;
  }

  public set state(state: FacetValueState) {
    this.facetValue.state = state;
  }

  public get moreValuesAvailable() {
    return this.facetValue.moreValuesAvailable;
  }

  public get numberOfResults() {
    return this.facetValue.numberOfResults;
  }

  public get displayValue() {
    return this.facetValue.displayValue;
  }

  public get children() {
    return this.facetValue.children;
  }

  public set children(children: IDynamicHierarchicalFacetValue[]) {
    this.facetValue.children = children;
  }

  public get isLeafValue() {
    return this.facetValue.isLeafValue;
  }

  public get isIdle() {
    return this.state === FacetValueState.idle;
  }

  public get isSelected() {
    return this.state === FacetValueState.selected;
  }

  public select() {
    this.state = FacetValueState.selected;
  }

  public get selectAriaLabel() {
    const resultCount = l('ResultCount', this.formattedCount, this.numberOfResults);
    return `${this.displayValue} ${resultCount}`;
  }

  public get formattedCount(): string {
    return Globalize.format(this.numberOfResults, 'n0');
  }

  private buildShowLess() {
    const showLess = new DynamicFacetValueShowMoreLessButton({
      className: 'coveo-dynamic-hierarchical-facet-show-less coveo-with-space',
      ariaLabel: l('ShowLessHierarchicalResults', this.displayValue),
      label: l('ShowLess'),
      action: () => {
        this.facet.enableFreezeFacetOrderFlag();
        this.retrieveCount = this.facet.options.numberOfValues;
        this.facet.triggerNewIsolatedQuery();
      }
    });

    return showLess.element;
  }

  private buildShowMore() {
    const showMore = new DynamicFacetValueShowMoreLessButton({
      className: 'coveo-dynamic-hierarchical-facet-show-more coveo-with-space',
      ariaLabel: l('ShowMoreHierarchicalResults', this.displayValue),
      label: l('ShowMore'),
      action: () => {
        this.facet.enableFreezeFacetOrderFlag();
        this.retrieveCount += this.facet.options.numberOfValues;
        this.facet.triggerNewIsolatedQuery();
      }
    });

    return showMore.element;
  }

  private get shouldEnableShowLess() {
    return this.children.length > this.facet.options.numberOfValues;
  }

  private get shouldEnableShowMore() {
    return this.moreValuesAvailable;
  }

  private appendShowMoreLess(fragment: DocumentFragment) {
    if (!this.facet.options.enableMoreLess) {
      return;
    }

    if (this.shouldEnableShowLess) {
      fragment.appendChild(this.buildShowLess());
    }

    if (this.shouldEnableShowMore) {
      fragment.appendChild(this.buildShowMore());
    }
  }

  public render(fragment: DocumentFragment) {
    this.element = this.renderer.render();
    fragment.appendChild(this.element);

    this.children.forEach(facetValue => facetValue.render(fragment));
    this.appendShowMoreLess(fragment);

    return this.element;
  }

  public logSelectActionToAnalytics() {
    this.facet.logAnalyticsEvent(analyticsActionCauseList.dynamicFacetSelect);
  }
}
