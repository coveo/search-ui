import { Facet } from './Facet';
import { FacetValue } from './FacetValue';
import { StringUtils } from '../../utils/StringUtils';
import { FacetSort } from './FacetSort';
import { IIndexFieldValue } from '../../rest/FieldValue';
import * as _ from 'underscore';

export class FacetValuesOrder {
  constructor(public facet: Facet, public facetSort: FacetSort) {}

  public reorderValues(facetValues: IIndexFieldValue[]): IIndexFieldValue[];
  public reorderValues(facetValues: FacetValue[]): FacetValue[];
  public reorderValues(facetValues: any[]): FacetValue[] | IIndexFieldValue[] {
    if (this.facetSort && this.facetSort.activeSort) {
      if (this.usingCustomSort) {
        return this.reorderValuesWithCustomOrder(facetValues);
      }

      if (this.usingAlphabeticalSort) {
        return this.reorderValuesWithCustomCaption(facetValues);
      }
    }
    return facetValues;
  }

  public reorderValuesIfUsingCustomSort(values: FacetValue[]) {
    return this.usingCustomSort ? this.reorderValuesWithCustomOrder(values) : values;
  }

  public reorderValuesIfUsingAlphabeticalSort(values: FacetValue[]) {
    return this.usingAlphabeticalSort ? this.reorderValuesWithCustomCaption(values) : values;
  }

  private get usingCustomSort() {
    return this.facetSort.activeSort.name == 'custom' && this.facet.options.customSort != undefined;
  }

  private get usingAlphabeticalSort() {
    return this.facetSort.activeSort.name.indexOf('alpha') != -1;
  }

  private reorderValuesWithCustomOrder(facetValues: FacetValue[]) {
    let customSortsLowercase = _.map(this.facet.options.customSort, customSort => customSort.toLowerCase());
    let valueIndexPair = _.map(facetValues, (facetValue, i) => {
      // Get the index of the current value in the custom sort array.
      // If it's not found, put it's index to it's original value + the length of customSort so that's always after the specified custom sort order.
      let index = _.findIndex(customSortsLowercase, customSort => {
        return (
          StringUtils.equalsCaseInsensitive(<string>customSort, facetValue.value) ||
          (facetValue.lookupValue != null && StringUtils.equalsCaseInsensitive(<string>customSort, facetValue.lookupValue))
        );
      });
      if (index == -1) {
        index = i + customSortsLowercase.length;
      }
      return { facetValue: facetValue, index: index };
    });
    let sorted = _.sortBy(valueIndexPair, 'index');
    sorted = this.facetSort.customSortDirection == 'ascending' ? sorted : sorted.reverse();
    return _.pluck(sorted, 'facetValue');
  }

  private reorderValuesWithCustomCaption(facetValues: FacetValue[]) {
    let sorted = facetValues.sort((firstValue, secondValue) => {
      return this.facet.getValueCaption(firstValue).localeCompare(this.facet.getValueCaption(secondValue), String['locale'], {
        sensitivity: 'base'
      });
    });
    if (this.facetSort.activeSort.name.indexOf('descending') != -1) {
      sorted = sorted.reverse();
    }
    return sorted;
  }
}
