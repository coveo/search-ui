import { CategoryFacet } from '../CategoryFacet';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { CategoryFacetValueRenderer } from './CategoryFacetValueRenderer';

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

  public toggleSelect() {
    this.state === FacetValueState.selected ? this.deselect() : this.select();
  }

  public select() {
    this.state = FacetValueState.selected;
  }

  public deselect() {
    this.state = FacetValueState.idle;
    this.preventAutoSelect = true;
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
