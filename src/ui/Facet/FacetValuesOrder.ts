import {Facet} from './Facet';
import {FacetValue} from './FacetValues';
import {StringUtils} from '../../utils/StringUtils';
import {FacetSort} from './FacetSort';
import {IIndexFieldValue} from '../../rest/FieldValue';

export class FacetValuesOrder {
  constructor(public facet: Facet, public facetSort: FacetSort) {

  }

  public reorderValues(facetValues: IIndexFieldValue[]): IIndexFieldValue[];
  public reorderValues(facetValues: FacetValue[]): FacetValue[];
  public reorderValues(facetValues: any[]): FacetValue[] | IIndexFieldValue[] {
    if (this.facetSort) {
      if (this.facetSort.activeSort.name == 'custom' && this.facet.options.customSort != undefined) {
        return this.reorderValuesWithCustomOrder(facetValues);
      } else if (this.facetSort.activeSort.name.indexOf('alpha') != -1) {
        return this.reorderValuesWithCustomCaption(facetValues);
      }
    }
    return facetValues;
  }

  private reorderValuesWithCustomOrder(facetValues: FacetValue[]) {
    var notFoundIndex = facetValues.length;
    var customSortsLowercase = _.map(this.facet.options.customSort, (customSort) => customSort.toLowerCase());
    var valueIndexPair = _.map(facetValues, (facetValue) => {
      var index = _.reduce(customSortsLowercase, (memo, customSort, i) => {
        if (memo != -1) {
          return memo;
        }
        if (StringUtils.equalsCaseInsensitive(<string>customSort, facetValue.value) || (facetValue.lookupValue != null && StringUtils.equalsCaseInsensitive(<string>customSort, facetValue.lookupValue))) {
          return i;
        }
        return -1;
      }, -1);
      index = index == -1 ? ++notFoundIndex : index;
      return {facetValue: facetValue, index: index};
    });
    var sorted = _.sortBy(valueIndexPair, 'index');
    sorted = this.facetSort.customSortDirection == 'ascending' ? sorted : sorted.reverse();
    return _.pluck(sorted, 'facetValue');
  }

  private reorderValuesWithCustomCaption(facetValues: FacetValue[]) {
    let sorted = _.sortBy(facetValues, (facetValue: FacetValue) => {
      return this.facet.getValueCaption(facetValue).toLowerCase();
    })
    if (this.facetSort.activeSort.name.indexOf('descending') != -1) {
      sorted = sorted.reverse();
    }
    return sorted;
  }
}
