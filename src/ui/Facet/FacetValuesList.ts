/// <reference path="Facet.ts" />

import {FacetValueElement, IFacetValueElementKlass} from './FacetValueElement';
import {Facet} from './Facet';
import {$$} from '../../utils/Dom';
import {ValueElement} from './ValueElement';
import {FacetValue} from './FacetValues';
import {Utils} from '../../utils/Utils';
import {FacetUtils} from './FacetUtils';

export class FacetValuesList {
  // Dictionary of values. The key is always in lowercase.
  private valueList: { [value: string]: FacetValueElement } = {};

  public valueContainer: HTMLElement;

  constructor(public facet: Facet, public facetValueElementKlass: IFacetValueElementKlass) {
  }

  public build(): HTMLElement {
    this.valueContainer = document.createElement('ul');
    $$(this.valueContainer).addClass('coveo-facet-values');
    return this.valueContainer;
  }

  public getAll(): ValueElement[] {
    return _.toArray<ValueElement>(this.valueList);
  }

  public getAllFacetValue(): FacetValue[] {
    return _.map(this.getAll(), (v: ValueElement) => {
      return v.facetValue
    })
  }

  public get(value: FacetValue): ValueElement;
  public get(value: string): ValueElement;
  public get(value: any): ValueElement {
    var getter;
    if (value instanceof FacetValue) {
      getter = value.value;
    } else {
      value = Utils.anyTypeToString(value);
      getter = value;
    }
    this.ensureFacetValueIsInList(value);
    return this.valueList[getter.toLowerCase()];
  }

  public select(value: FacetValue): ValueElement;
  public select(value: string): ValueElement;
  public select(value: any): ValueElement {
    var valueElement = this.get(value);
    valueElement.select();
    return valueElement;
  }

  public unselect(value: FacetValue): ValueElement;
  public unselect(value: string): ValueElement;
  public unselect(value: any): ValueElement {
    var valueElement = this.get(value);
    valueElement.unselect();
    return valueElement;
  }

  public exclude(value: FacetValue): ValueElement;
  public exclude(value: string): ValueElement;
  public exclude(value: any): ValueElement {
    var valueElement = this.get(value);
    valueElement.exclude();
    return valueElement;
  }

  public unExclude(value: FacetValue): ValueElement;
  public unExclude(value: string): ValueElement;
  public unExclude(value: any): ValueElement {
    var valueElement = this.get(value);
    valueElement.unexclude();
    return valueElement;
  }

  public toggleSelect(value: FacetValue): ValueElement;
  public toggleSelect(value: string): ValueElement;
  public toggleSelect(value: any): ValueElement {
    var valueElement = this.get(value);
    if (valueElement.facetValue.selected) {
      valueElement.unselect();
    } else {
      valueElement.select();
    }
    return valueElement;
  }

  public toggleExclude(value: FacetValue): ValueElement;
  public toggleExclude(value: string): ValueElement;
  public toggleExclude(value: any): ValueElement {
    var valueElement = this.get(value);
    if (valueElement.facetValue.excluded) {
      valueElement.unexclude();
    } else {
      valueElement.exclude();
    }
    return valueElement;
  }

  public rebuild(numberOfValues: number): void {
    $$(this.valueContainer).empty();
    var allValues = this.getValuesToBuildWith();
    var toCompare = numberOfValues
    _.each(allValues, (facetValue: FacetValue, index?: number, list?) => {
      if (this.facetValueShouldBeRemoved(facetValue)) {
        this.facet.values.remove(facetValue.value);
        toCompare += 1
      } else if (index < toCompare) {
        var valueElement = new this.facetValueElementKlass(this.facet, facetValue, true);
        this.valueList[facetValue.value.toLowerCase()] = valueElement;
        var valueListElement = valueElement.build().renderer.listElement;
        this.valueContainer.appendChild(valueListElement);
      }
    });
    FacetUtils.addNoStateCssClassToFacetValues(this.facet, this.valueContainer);
    FacetUtils.clipCaptionsToAvoidOverflowingTheirContainer(this.facet);
  }

  protected getValuesToBuildWith() {
    return this.facet.facetSort.reorderValues(this.facet.values.getAll());
  }

  private facetValueShouldBeRemoved(facetValue: FacetValue): boolean {
    return facetValue.occurrences == 0 &&
      (facetValue.delta == 0 || facetValue.delta == undefined) && !facetValue.selected && !facetValue.excluded && !this.facet.keepDisplayedValuesNextTime
  }

  private ensureFacetValueIsInList(value: any) {
    var facetValue: FacetValue;
    if (value instanceof FacetValue) {
      facetValue = this.facet.values.get((<FacetValue>value).value);
      if (facetValue == null) {
        this.facet.values.add(value);
        facetValue = value;
      }
    } else {
      facetValue = this.facet.values.get(value);
      if (facetValue == null) {
        facetValue = FacetValue.createFromValue(value);
        this.facet.values.add(facetValue);
      }
    }

    var key = facetValue.value.toLowerCase();
    var found = this.valueList[key];
    if (found == undefined) {
      found = this.valueList[key] = new FacetValueElement(this.facet, facetValue, true);
      found.build();
    } else {
      found.facetValue = facetValue;
    }
  }
}
