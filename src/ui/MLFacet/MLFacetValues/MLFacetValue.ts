import * as Globalize from 'globalize';
import { MLFacetValueRenderer } from './MLFacetValueRenderer';
import { FacetUtils } from '../../Facet/FacetUtils';
import { MLFacet } from '../MLFacet';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';

export interface IMLFacetValue {
  value: string;
  state: FacetValueState;
  numberOfResults: number;
}

export class MLFacetValue implements IMLFacetValue {
  public value: string;
  public state: FacetValueState;
  public numberOfResults: number;
  private renderer: MLFacetValueRenderer;

  constructor({ value, state, numberOfResults }: IMLFacetValue, private facet: MLFacet) {
    this.value = value;
    this.state = state;
    this.numberOfResults = numberOfResults;
    this.renderer = new MLFacetValueRenderer(this, facet);
  }

  public get isSelected() {
    return this.state === FacetValueState.selected;
  }

  public get isIdle() {
    return this.state === FacetValueState.idle;
  }

  public toggleSelect() {
    this.state = this.state === FacetValueState.selected ? FacetValueState.idle : FacetValueState.selected;
  }

  public select() {
    this.state = FacetValueState.selected;
  }

  public deselect() {
    this.state = FacetValueState.idle;
  }

  public equals(arg: string | MLFacetValue) {
    const value = typeof arg === 'string' ? arg : arg.value;
    return value.toLowerCase() === this.value.toLowerCase();
  }

  public get formattedCount(): string {
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
