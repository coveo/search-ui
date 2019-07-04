import * as Globalize from 'globalize';
import { DynamicFacetValueRenderer } from './DynamicFacetValueRenderer';
import { FacetUtils } from '../../Facet/FacetUtils';
import { DynamicFacet } from '../DynamicFacet';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { IAnalyticsDynamicFacetMeta, analyticsActionCauseList } from '../../Analytics/AnalyticsActionListMeta';
import { l } from '../../../strings/Strings';

export interface ValueRenderer {
  render(): HTMLElement;
}

export interface IValueRendererKlass {
  new (facetValue: DynamicFacetValue, facet: DynamicFacet): ValueRenderer;
}

export interface IDynamicFacetValue {
  value: string;
  displayValue?: string;
  state: FacetValueState;
  numberOfResults: number;
  position: number;
}

export class DynamicFacetValue implements IDynamicFacetValue {
  public value: string;
  public state: FacetValueState;
  public numberOfResults: number;
  public position: number;
  public displayValue: string;
  public renderer: ValueRenderer;

  constructor(
    { value, state, numberOfResults, position, displayValue }: IDynamicFacetValue,
    private facet: DynamicFacet,
    rendererKlass: IValueRendererKlass = DynamicFacetValueRenderer
  ) {
    this.value = value;
    this.state = state;
    this.numberOfResults = numberOfResults;
    this.position = position;
    this.displayValue = displayValue;
    this.renderer = new rendererKlass(this, facet);
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

  public get selectAriaLabel() {
    const selectOrUnselect = !this.isSelected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.formattedCount);

    return `${l(selectOrUnselect, this.valueCaption, resultCount)}`;
  }

  public get analyticsMeta(): IAnalyticsDynamicFacetMeta {
    return {
      ...this.facet.basicAnalyticsFacetState,
      value: this.value,
      valuePosition: this.position,
      displayValue: this.displayValue ? this.displayValue : this.valueCaption,
      state: this.state
    };
  }

  public logSelectActionToAnalytics() {
    const action =
      this.state === FacetValueState.selected ? analyticsActionCauseList.dynamicFacetSelect : analyticsActionCauseList.dynamicFacetDeselect;

    this.facet.logAnalyticsEvent(action, this.analyticsMeta);
  }

  public render() {
    return this.renderer.render();
  }
}
