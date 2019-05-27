import * as Globalize from 'globalize';
import { DynamicFacetValueRenderer } from './DynamicFacetValueRenderer';
import { FacetUtils } from '../../Facet/FacetUtils';
import { DynamicFacet } from '../DynamicFacet';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { IAnalyticsDynamicFacetMeta, AnalyticsDynamicFacetType } from '../../Analytics/AnalyticsActionListMeta';

export interface IDynamicFacetValue {
  value: string;
  state: FacetValueState;
  numberOfResults: number;
}

export class DynamicFacetValue implements IDynamicFacetValue {
  public value: string;
  public state: FacetValueState;
  public numberOfResults: number;
  private renderer: DynamicFacetValueRenderer;

  constructor({ value, state, numberOfResults }: IDynamicFacetValue, private facet: DynamicFacet) {
    this.value = value;
    this.state = state;
    this.numberOfResults = numberOfResults;
    this.renderer = new DynamicFacetValueRenderer(this, facet);
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

  public equals(arg: string | DynamicFacetValue) {
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

  public get analyticsMeta(): IAnalyticsDynamicFacetMeta {
    return {
      facetId: this.facet.options.id,
      facetField: this.facet.options.field.toString(),
      facetTitle: this.facet.options.title,
      facetType: AnalyticsDynamicFacetType.string,
      facetValue: this.value,
      facetDisplayValue: this.valueCaption,
      facetValueState: this.state
    };
  }

  public render() {
    return this.renderer.render();
  }
}
