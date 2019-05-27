import 'styling/DynamicFacet/_DynamicFacetValues';
import { $$ } from '../../../utils/Dom';
import { findWhere, find } from 'underscore';
import { DynamicFacetValue } from './DynamicFacetValue';
import { DynamicFacet } from '../DynamicFacet';
import { IFacetResponse } from '../../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { l } from '../../../strings/Strings';

export class DynamicFacetValues {
  private facetValues: DynamicFacetValue[];
  private list = $$('ul', { className: 'coveo-dynamic-facet-values' });
  private moreValuesAvailable: boolean;

  constructor(private facet: DynamicFacet) {
    this.resetValues();
  }

  public createFromResponse(response: IFacetResponse) {
    this.moreValuesAvailable = response.moreValuesAvailable;
    this.facetValues = response.values.map(
      facetValue =>
        new DynamicFacetValue(
          {
            value: facetValue.value,
            numberOfResults: facetValue.numberOfResults,
            state: facetValue.state
          },
          this.facet
        )
    );
  }

  public resetValues() {
    this.moreValuesAvailable = false;
    this.facetValues = [];
  }

  public get allFacetValues() {
    return this.facetValues;
  }

  public get allValues() {
    return this.facetValues.map(facetValue => facetValue.value);
  }

  public get selectedValues() {
    return this.facetValues.filter(value => value.isSelected).map(({ value }) => value);
  }

  public get activeFacetValues() {
    return this.facetValues.filter(value => !value.isIdle);
  }

  public get hasSelectedValues() {
    return !!findWhere(this.facetValues, { state: FacetValueState.selected });
  }

  public get hasActiveValues() {
    return !!this.activeFacetValues.length;
  }

  public get hasIdleValues() {
    return !!findWhere(this.facetValues, { state: FacetValueState.idle });
  }

  public clearAll() {
    this.facetValues.forEach(value => value.deselect());
  }

  public get isEmpty() {
    return !this.facetValues.length;
  }

  public hasSelectedValue(arg: string | DynamicFacetValue) {
    const value = typeof arg === 'string' ? arg : arg.value;
    const foundValue = find(this.facetValues, facetValue => facetValue.equals(value));
    return foundValue && foundValue.isSelected;
  }

  public get(arg: string | DynamicFacetValue) {
    const value = typeof arg === 'string' ? arg : arg.value;
    const facetValue = find(this.facetValues, facetValue => facetValue.equals(value));

    if (facetValue) {
      return facetValue;
    }

    const newFacetValue = new DynamicFacetValue({ value, state: FacetValueState.idle, numberOfResults: 0 }, this.facet);
    this.facetValues.push(newFacetValue);
    return newFacetValue;
  }

  private buildShowLess() {
    const showLessBtn = $$('button', { className: 'coveo-dynamic-facet-show-less' }, l('ShowLess'));
    const showLess = $$('li', null, showLessBtn);
    showLessBtn.on('click', () => {
      this.facet.enableFreezeFacetOrderFlag();
      this.facet.showLessValues();
    });
    return showLess.el;
  }

  private buildShowMore() {
    const showMoreBtn = $$('button', { className: 'coveo-dynamic-facet-show-more' }, l('ShowMore'));
    const showMore = $$('li', null, showMoreBtn);
    showMoreBtn.on('click', () => {
      this.facet.enableFreezeFacetOrderFlag();
      this.facet.showMoreValues();
    });
    return showMore.el;
  }

  private get shouldEnableShowLess() {
    const hasMoreValuesThenDefault = this.facetValues.length > this.facet.options.numberOfValues;

    return hasMoreValuesThenDefault && this.hasIdleValues;
  }

  public render() {
    this.list.empty();
    this.facetValues.forEach(facetValue => {
      this.list.append(facetValue.render());
    });

    if (this.shouldEnableShowLess) {
      this.list.append(this.buildShowLess());
    }

    if (this.moreValuesAvailable) {
      this.list.append(this.buildShowMore());
    }

    return this.list.el;
  }
}
