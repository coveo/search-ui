import * as Globalize from 'globalize';
import { CategoryFacet } from '../CategoryFacet';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { CategoryFacetValueRenderer } from './CategoryFacetValueRenderer';
import { l } from '../../../strings/Strings';

export interface ICategoryFacetValue {
  value: string;
  path: string[];
  displayValue: string;
  state: FacetValueState;
  numberOfResults: number;
  moreValuesAvailable: boolean;
  preventAutoSelect: boolean;
  children: CategoryFacetValue[];
}

export class CategoryFacetValue implements ICategoryFacetValue {
  public renderer: CategoryFacetValueRenderer;
  private element: HTMLElement = null;

  constructor(private facetValue: ICategoryFacetValue, facet: CategoryFacet) {
    this.renderer = new CategoryFacetValueRenderer(this, facet);
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

  public render(fragment: DocumentFragment) {
    this.element = this.renderer.render();
    fragment.appendChild(this.element);

    this.children.forEach(facetValue => facetValue.render(fragment));

    return this.element;
  }

  public logSelectActionToAnalytics() {
    // TODO: add Analytics
  }
}
