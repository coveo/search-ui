import * as Globalize from 'globalize';
import { DynamicFacetValueRenderer } from './DynamicFacetValueRenderer';
import { DynamicFacet } from '../DynamicFacet';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { IAnalyticsDynamicFacetMeta, analyticsActionCauseList } from '../../Analytics/AnalyticsActionListMeta';
import { l } from '../../../strings/Strings';
import { IRangeValue, RangeType } from '../../../rest/RangeValue';
import { FacetType } from '../../../rest/Facet/FacetRequest';

export interface ValueRenderer {
  render(): HTMLElement;
}

export interface IValueRendererKlass {
  new (facetValue: DynamicFacetValue, facet: DynamicFacet): ValueRenderer;
}

export interface IDynamicFacetValue extends IRangeValue {
  value: string;
  displayValue: string;
  state: FacetValueState;
  numberOfResults: number;
  position: number;
}

export class DynamicFacetValue implements IDynamicFacetValue {
  public value: string;
  public start: RangeType;
  public end: RangeType;
  public endInclusive: boolean;
  public state: FacetValueState;
  public numberOfResults: number;
  public position: number;
  public displayValue: string;
  public renderer: ValueRenderer;
  private element: HTMLElement = null;

  constructor(facetValue: IDynamicFacetValue, private facet: DynamicFacet, rendererKlass: IValueRendererKlass = DynamicFacetValueRenderer) {
    this.value = facetValue.value;
    this.start = facetValue.start;
    this.end = facetValue.end;
    this.endInclusive = facetValue.endInclusive;
    this.state = facetValue.state;
    this.numberOfResults = facetValue.numberOfResults;
    this.position = facetValue.position;
    this.displayValue = facetValue.displayValue;
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

  public get selectAriaLabel() {
    const selectOrUnselect = !this.isSelected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.formattedCount);

    return `${l(selectOrUnselect, this.displayValue, resultCount)}`;
  }

  public get rangeAnalyticsMeta() {
    if (this.facet.facetType === FacetType.specific) {
      return null;
    }

    return {
      start: this.start,
      end: this.end,
      endInclusive: this.endInclusive
    };
  }

  public get analyticsMeta(): IAnalyticsDynamicFacetMeta {
    return {
      ...this.facet.basicAnalyticsFacetState,
      ...this.rangeAnalyticsMeta,
      value: this.value,
      valuePosition: this.position,
      displayValue: this.displayValue,
      state: this.state
    };
  }

  public logSelectActionToAnalytics() {
    const action =
      this.state === FacetValueState.selected ? analyticsActionCauseList.dynamicFacetSelect : analyticsActionCauseList.dynamicFacetDeselect;

    this.facet.logAnalyticsEvent(action, this.analyticsMeta);
  }

  private render() {
    this.element = this.renderer.render();
    return this.element;
  }

  public get renderedElement() {
    if (this.element) {
      return this.element;
    }

    return this.render();
  }
}
