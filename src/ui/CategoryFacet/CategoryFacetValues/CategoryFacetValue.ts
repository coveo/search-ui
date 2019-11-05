import * as Globalize from 'globalize';
import { CategoryFacet } from '../CategoryFacet';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { CategoryFacetValueRenderer } from './CategoryFacetValueRenderer';
import { l } from '../../../strings/Strings';

export interface ValueRenderer {
  render(): HTMLElement;
}

export interface IValueRendererKlass {
  new(facetValue: CategoryFacetValue, facet: CategoryFacet): ValueRenderer;
}

export interface ICategoryFacetValue {
  value: string;
  path: string[];
  displayValue: string;
  state: FacetValueState;
  numberOfResults: number;
  moreValuesAvailable: boolean;
  preventAutoSelect?: boolean;
  children: CategoryFacetValue[];
}

export class CategoryFacetValue implements ICategoryFacetValue {
  public value: string;
  public path: string[];
  public state: FacetValueState;
  public moreValuesAvailable: boolean;
  public preventAutoSelect = false;
  public numberOfResults: number;
  public position: number;
  public displayValue: string;
  public children: CategoryFacetValue[];
  public renderer: ValueRenderer;
  private element: HTMLElement = null;

  constructor(facetValue: ICategoryFacetValue, facet: CategoryFacet, rendererKlass: IValueRendererKlass = CategoryFacetValueRenderer) {
    this.value = facetValue.value;
    this.path = facetValue.path;
    this.state = facetValue.state;
    this.numberOfResults = facetValue.numberOfResults;
    this.displayValue = facetValue.displayValue;
    this.moreValuesAvailable = facetValue.moreValuesAvailable;
    this.children = facetValue.children;
    this.renderer = new rendererKlass(this, facet);
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
