import { CategoryFacet } from '../CategoryFacet';
import { IFacetResponse, IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { CategoryFacetValue } from './CategoryFacetValue';
import { FacetUtils } from '../../Facet/FacetUtils';
import { $$ } from '../../../utils/Dom';
import { find } from 'underscore';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { Utils } from '../../../utils/Utils';

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
    const displayValue = FacetUtils.getDisplayValueFromValueCaption(
      responseValue.value,
      this.facet.options.field as string,
      this.facet.options.valueCaption
    );
    const children = responseValue.children
      ? responseValue.children.map(responseValue => this.createFacetValueFromResponse(responseValue, newPath))
      : [];

    return new CategoryFacetValue({
      value: responseValue.value,
      numberOfResults: responseValue.numberOfResults,
      state: responseValue.state,
      moreValuesAvailable: responseValue.moreValuesAvailable,
      preventAutoSelect: false,
      path: newPath,
      displayValue,
      children
    }, this.facet);
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
      facetValue = find(facetValues, facetValue => facetValue.value === value);

      if (!facetValue) {
        return null;
      }
      facetValues = facetValue.children;
    } while (remainingPath.length);

    return facetValue;
  }

  private createFacetValueWithPath(path: string[], children: CategoryFacetValue[] = []): CategoryFacetValue {
    const value = path[path.length - 1]
    return new CategoryFacetValue({
      value,
      path,
      displayValue: this.formatDisplayValue(value),
      numberOfResults: 0,
      state: FacetValueState.idle,
      moreValuesAvailable: false,
      preventAutoSelect: false,
      children
    }, this.facet);
  }

  private createFacetValueAtPath(path: string[]) {
    const remainingPath = [...path];
    const ultimateFacetValue = this.createFacetValueWithPath([...remainingPath]);
    let facetValue = ultimateFacetValue;

    while (remainingPath.length > 1) {
      remainingPath.pop()
      const parentFacetValue = this.findValueWithPath(remainingPath) || this.createFacetValueWithPath([...remainingPath]);
      parentFacetValue.children.push(facetValue);
      facetValue = parentFacetValue;
    }

    this.facetValues.push(facetValue);
    return ultimateFacetValue;
  }

  public get(path: string[]) {
    const facetValue = this.findValueWithPath(path);

    if (facetValue) {
      return facetValue;
    }

    const newFacetValue = this.createFacetValueAtPath(path);
    return newFacetValue;
  }

  private clearHierarchyLevel(facetValues: CategoryFacetValue[], path: string[], level = 1) {
    facetValues.forEach(facetValue => {
      facetValue.state = FacetValueState.idle;
      facetValue.children = facetValue.children.filter(child => path[level] && Utils.arrayEqual(path.slice(0, level + 1), child.path));
      this.clearHierarchyLevel(facetValue.children, path, level + 1);
    });
  }

  public clearHierarchy(path: string[]) {
    this.clearHierarchyLevel(this.facetValues, [...path]);
  }

  public render() {
    const fragment = document.createDocumentFragment();
    $$(this.list).empty();

    this.facetValues.forEach(facetValue => {
      facetValue.render(fragment);
    });

    // TODO: append see more/less
    this.list.appendChild(fragment);
    return this.list;
  }
}
