import { CategoryFacet } from '../CategoryFacet';
import { IFacetResponse, IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { CategoryFacetValue } from './CategoryFacetValue';
import { FacetUtils } from '../../Facet/FacetUtils';
import { $$ } from '../../../utils/Dom';
import { find } from 'underscore';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { StringUtils } from '../../../utils/StringUtils';

export class CategoryFacetValues {
  private facetValues: CategoryFacetValue[];
  private list = $$('ul', { className: 'coveo-dynamic-category-facet-values' }).el;

  constructor(private facet: CategoryFacet) {
    this.resetValues();
  }

  private formatDisplayValue(value: string) {
    let returnValue = FacetUtils.tryToGetTranslatedCaption(<string>this.facet.options.field, value);

    if (this.facet.options.valueCaption && typeof this.facet.options.valueCaption === 'object') {
      returnValue = this.facet.options.valueCaption[value] || returnValue;
    }

    return returnValue;
  }

  public createFromResponse(response: IFacetResponse) {
    this.facetValues = response.values.map(responseValue => this.createFacetValueFromResponse(responseValue));
  }

  private createFacetValueFromResponse(responseValue: IFacetResponseValue, path: string[] = []): CategoryFacetValue {
    const newPath = [...path, responseValue.value];
    return new CategoryFacetValue({
      value: responseValue.value,
      path: newPath,
      displayValue: this.formatDisplayValue(responseValue.value),
      numberOfResults: responseValue.numberOfResults,
      state: responseValue.state,
      moreValuesAvailable: responseValue.moreValuesAvailable,
      children: responseValue.children
        ? responseValue.children.map(responseValue => this.createFacetValueFromResponse(responseValue, newPath))
        : []
    }, this.facet);
  }

  private createFacetValueAtPathLevel(path: string[], level = 0): CategoryFacetValue {
    const value = path[level];
    const children = path[level + 1]
      ? [this.createFacetValueAtPathLevel(path, level + 1)]
      : [];

    return new CategoryFacetValue({
      value,
      path: path.slice(level),
      displayValue: this.formatDisplayValue(value),
      numberOfResults: 0,
      state: FacetValueState.idle,
      moreValuesAvailable: false,
      children
    }, this.facet);
  }

  public get allValues() {
    return this.facetValues.map(facetValue => facetValue.value);
  }

  private get displayedValues() {
    return this.facetValues.filter(value => !value.isIdle || value.numberOfResults > 0);
  }

  public get allFacetValues() {
    return this.facetValues;
  }

  public resetValues() {
    this.facetValues = [];
  }

  private findValueWithPath(path: string[]) {
    let facetValues = this.facetValues;
    let facetValue: CategoryFacetValue;
    let remainingPath = [...path];

    do {
      const value = remainingPath.shift();
      facetValue = find(facetValues, facetValue => StringUtils.equalsCaseInsensitive(facetValue.value, value));

      if (!facetValue) {
        return null;
      }
      facetValues = facetValue.children;
    } while (remainingPath.length);

    return facetValue;
  }

  public get(path: string[]) {
    const facetValue = this.findValueWithPath(path);

    if (facetValue) {
      return facetValue;
    }

    const newFacetValue = this.createFacetValueAtPathLevel(path);
    if (!newFacetValue) {
      return null;
    }

    this.facetValues.push(newFacetValue);
    return newFacetValue;
  }

  private clearHierarchyLevel(facetValues: CategoryFacetValue[], path: string[], level = 0) {
    facetValues.forEach(facetValue => {
      const nextPathValue = path[level + 1];
      facetValue.state = FacetValueState.idle;
      facetValue.children = facetValue.children.filter(child => nextPathValue && StringUtils.equalsCaseInsensitive(child.value, nextPathValue));
      this.clearHierarchyLevel(facetValue.children, path, level + 1);
    })
  }

  public clearHierarchy(path: string[]) {
    this.clearHierarchyLevel(this.facetValues, path);
  }

  public render() {
    const fragment = document.createDocumentFragment();
    $$(this.list).empty();

    this.displayedValues.forEach(facetValue => {
      facetValue.render(fragment);
    });

    // TODO: append see more/less
    this.list.appendChild(fragment);
    return this.list;
  }
}
