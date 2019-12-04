import * as Globalize from 'globalize';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { CategoryFacetValueRenderer } from './CategoryFacetValueRenderer';
import { l } from '../../../strings/Strings';
import { DynamicFacetValueShowMoreLessButton } from '../../DynamicFacet/DynamicFacetValues/DynamicFacetValueMoreLessButton';
import { ICategoryFacetValue, ICategoryFacet, ICategoryFacetValueProperties } from '../ICategoryFacet';

export class CategoryFacetValue implements ICategoryFacetValue {
  private renderer: CategoryFacetValueRenderer;
  private element: HTMLElement = null;
  public retrieveCount: number;

  constructor(private facetValue: ICategoryFacetValueProperties, private facet: ICategoryFacet) {
    this.renderer = new CategoryFacetValueRenderer(this, this.facet);
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

  public get preventAutoSelect() {
    return this.facetValue.preventAutoSelect;
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

  public set children(children: ICategoryFacetValue[]) {
    this.facetValue.children = children;
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
    return `${l('SelectValueWithResultCount', this.displayValue, resultCount)}`;
  }

  public get formattedCount(): string {
    return Globalize.format(this.numberOfResults, 'n0');
  }

  private buildShowLess() {
    const showLess = new DynamicFacetValueShowMoreLessButton({
      className: 'coveo-dynamic-category-facet-show-less coveo-with-space',
      ariaLabel: l('ShowLessCategoryResults', this.displayValue),
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
      className: 'coveo-dynamic-category-facet-show-more coveo-with-space',
      ariaLabel: l('ShowMoreCategoryResults', this.displayValue),
      label: l('ShowMore'),
      action: () => {
        this.facet.enableFreezeFacetOrderFlag();
        this.retrieveCount += this.facet.options.pageSize;
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
    // TODO: add Analytics
  }
}
