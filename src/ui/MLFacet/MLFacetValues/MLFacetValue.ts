import * as Globalize from 'globalize';
import { MLFacetValueRenderer } from './MLFacetValueRenderer';
import { FacetUtils } from '../../Facet/FacetUtils';
import { MLFacet } from '../MLFacet';
import { FacetValueState as MLFacetValueState } from '../../../rest/Facet/FacetValueState';
export { FacetValueState as MLFacetValueState } from '../../../rest/Facet/FacetValueState';

export interface IMLFacetValue {
  value: string;
  state: MLFacetValueState;
  numberOfResults: number;
}

export class MLFacetValue implements IMLFacetValue {
  public value: string;
  public state: MLFacetValueState;
  public numberOfResults: number;
  private renderer: MLFacetValueRenderer;

  constructor({ value, state, numberOfResults }: IMLFacetValue, private facet: MLFacet) {
    this.value = value;
    this.state = state;
    this.numberOfResults = numberOfResults;
    this.renderer = new MLFacetValueRenderer(this, facet);
  }

  public get isSelected() {
    return this.state === MLFacetValueState.selected;
  }

  public toggleSelect() {
    this.state = this.state === MLFacetValueState.selected ? MLFacetValueState.idle : MLFacetValueState.selected;
  }

  public select() {
    this.state = MLFacetValueState.selected;
  }

  public deselect() {
    this.state = MLFacetValueState.idle;
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
