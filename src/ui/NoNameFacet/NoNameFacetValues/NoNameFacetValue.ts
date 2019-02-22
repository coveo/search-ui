import * as Globalize from 'globalize';
import { NoNameFacetValueRenderer } from './NoNameFacetValueRenderer';
import { FacetUtils } from '../../Facet/FacetUtils';
import { NoNameFacet } from '../NoNameFacet';

export interface INoNameFacetValue {
  value: string;
  selected: boolean;
  numberOfResults: number;
}

export class NoNameFacetValue implements INoNameFacetValue {
  public value: string;
  public selected: boolean;
  public numberOfResults: number;
  private renderer: NoNameFacetValueRenderer;

  constructor({ value, selected, numberOfResults }: INoNameFacetValue, private facet: NoNameFacet) {
    this.value = value;
    this.selected = selected;
    this.numberOfResults = numberOfResults;
    this.renderer = new NoNameFacetValueRenderer(this, facet);
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
