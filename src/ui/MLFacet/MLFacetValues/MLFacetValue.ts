import * as Globalize from 'globalize';
import { MLFacetValueRenderer } from './MLFacetValueRenderer';
import { FacetUtils } from '../../Facet/FacetUtils';
import { MLFacet } from '../MLFacet';

export interface IMLFacetValue {
  value: string;
  selected: boolean;
  numberOfResults: number;
}

export class MLFacetValue implements IMLFacetValue {
  public value: string;
  public selected: boolean;
  public numberOfResults: number;
  private renderer: MLFacetValueRenderer;

  constructor({ value, selected, numberOfResults }: IMLFacetValue, private facet: MLFacet) {
    this.value = value;
    this.selected = selected;
    this.numberOfResults = numberOfResults;
    this.renderer = new MLFacetValueRenderer(this, facet);
  }

  public toggleSelect() {
    this.selected = !this.selected;
  }

  public select() {
    this.selected = true;
  }

  public deselect() {
    this.selected = false;
  }

  public equals(arg: string | MLFacetValue) {
    const value = typeof arg === 'string' ? arg : arg.value;
    return value.toLowerCase() === this.value.toLowerCase();
  }

  public get formattedCount(): string {
    if (this.numberOfResults === 0) {
      return '';
    }

    return Globalize.format(this.numberOfResults, 'n0');
  }

  public get valueCaption(): string {
    let returnValue = FacetUtils.tryToGetTranslatedCaption(<string>this.facet.options.field, this.value);

    if (this.facet.options.valueCaption && typeof this.facet.options.valueCaption === 'object') {
      returnValue = this.facet.options.valueCaption[this.value] || returnValue;
    }

    return returnValue;
  }

  public render() {
    return this.renderer.render();
  }
}
