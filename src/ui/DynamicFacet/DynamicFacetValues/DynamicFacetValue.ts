import * as Globalize from 'globalize';
import { IDynamicFacet, IDynamicFacetValueProperties, IValueRenderer, IValueRendererKlass, IDynamicFacetValue } from '../IDynamicFacet';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { analyticsActionCauseList, IAnalyticsFacetMeta } from '../../Analytics/AnalyticsActionListMeta';
import { l } from '../../../strings/Strings';
import { RangeType } from '../../../rest/RangeValue';
import { FacetType } from '../../../rest/Facet/FacetRequest';
import { IAnalyticsFacetState } from '../../Analytics/IAnalyticsFacetState';

export class DynamicFacetValue implements IDynamicFacetValue {
  public value: string;
  public start: RangeType;
  public end: RangeType;
  public endInclusive: boolean;
  public state: FacetValueState;
  public numberOfResults: number;
  public position: number;
  public displayValue: string;
  public renderer: IValueRenderer;
  private element: HTMLElement = null;

  constructor(facetValue: IDynamicFacetValueProperties, private facet: IDynamicFacet, rendererKlass: IValueRendererKlass) {
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
    this.state === FacetValueState.selected ? this.deselect() : this.select();
  }

  public select() {
    this.state = FacetValueState.selected;
  }

  public deselect() {
    this.state = FacetValueState.idle;
  }

  public equals(arg: string | IDynamicFacetValue) {
    const value = typeof arg === 'string' ? arg : arg.value;
    return value.toLowerCase() === this.value.toLowerCase();
  }

  public get formattedCount(): string {
    return Globalize.format(this.numberOfResults, 'n0');
  }

  public get selectAriaLabel() {
    const selectOrUnselect = !this.isSelected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.formattedCount, this.numberOfResults);

    return `${l(selectOrUnselect, this.displayValue, resultCount)}`;
  }

  private get isRange() {
    return this.facet.facetType !== FacetType.specific;
  }

  private get analyticsValue() {
    return this.isRange ? `${this.start}..${this.end}` : this.value;
  }

  private get rangeFacetState() {
    if (!this.isRange) {
      return null;
    }

    return {
      start: `${this.start}`,
      end: `${this.end}`,
      endInclusive: this.endInclusive
    };
  }

  public get analyticsFacetState(): IAnalyticsFacetState {
    return {
      ...this.facet.basicAnalyticsFacetState,
      ...this.rangeFacetState,
      value: this.analyticsValue,
      valuePosition: this.position,
      displayValue: this.displayValue,
      state: this.state
    };
  }

  private get rangeFacetMeta() {
    if (!this.isRange) {
      return null;
    }

    return {
      facetRangeStart: `${this.start}`,
      facetRangeEnd: `${this.end}`,
      facetRangeEndInclusive: this.endInclusive
    };
  }

  public get analyticsFacetMeta(): IAnalyticsFacetMeta {
    return {
      ...this.facet.basicAnalyticsFacetMeta,
      ...this.rangeFacetMeta,
      facetValue: this.analyticsValue
    };
  }

  public logSelectActionToAnalytics() {
    const action =
      this.state === FacetValueState.selected ? analyticsActionCauseList.dynamicFacetSelect : analyticsActionCauseList.dynamicFacetDeselect;

    this.facet.logAnalyticsEvent(action, this.analyticsFacetMeta);
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
