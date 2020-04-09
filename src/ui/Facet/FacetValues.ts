import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { IGroupByResult } from '../../rest/GroupByResult';
import { FacetValue } from './FacetValue';
import * as _ from 'underscore';

export class FacetValues {
  private values: FacetValue[];

  constructor(groupByResult?: IGroupByResult) {
    if (Utils.exists(groupByResult)) {
      this.values = _.map(groupByResult.values, groupByValue => FacetValue.createFromGroupByValue(groupByValue));
    } else {
      this.values = [];
    }
  }

  add(facetValue: FacetValue) {
    Assert.exists(facetValue);
    Assert.check(!this.contains(facetValue.value));
    this.values.push(facetValue);
  }

  remove(value: string) {
    Assert.isNonEmptyString(value);
    value = value;
    this.values = _.filter(this.values, (elem: FacetValue) => elem.value != value);
  }

  size(): number {
    return this.values.length;
  }

  isEmpty(): boolean {
    return this.values.length == 0;
  }

  at(index: number): FacetValue {
    Assert.isLargerOrEqualsThan(0, index);
    Assert.isSmallerThan(this.values.length, index);
    return this.values[index];
  }

  get(value: string): FacetValue {
    return _.find(this.values, (elem: FacetValue) => elem.value.toLowerCase() == value.toLowerCase());
  }

  contains(value: string): boolean {
    return Utils.exists(this.get(value));
  }

  getAll(): FacetValue[] {
    return this.values;
  }

  getSelected(): FacetValue[] {
    return _.filter(this.values, (value: FacetValue) => value.selected);
  }

  getExcluded(): FacetValue[] {
    return _.filter(this.values, (value: FacetValue) => value.excluded);
  }

  hasSelectedOrExcludedValues(): boolean {
    return this.getSelected().length != 0 || this.getExcluded().length != 0;
  }

  hasSelectedAndExcludedValues(): boolean {
    return this.getSelected().length != 0 && this.getExcluded().length != 0;
  }

  hasOnlyExcludedValues(): boolean {
    return this.getSelected().length == 0 && this.getExcluded().length != 0;
  }

  hasOnlySelectedValues(): boolean {
    return this.getSelected().length != 0 && this.getExcluded().length == 0;
  }

  reset() {
    _.each(this.values, (elem: FacetValue) => elem.reset());
  }

  importActiveValuesFromOtherList(other: FacetValues) {
    Assert.exists(other);

    _.each(other.getSelected(), (otherValue: FacetValue) => {
      var myValue = this.get(otherValue.value);
      if (Utils.exists(myValue)) {
        myValue.selected = true;
      } else {
        this.values.push(otherValue.cloneWithZeroOccurrences());
      }
    });

    _.each(other.getExcluded(), (otherValue: FacetValue) => {
      var myValue = this.get(otherValue.value);
      if (Utils.exists(myValue)) {
        myValue.excluded = true;
      } else if (otherValue.occurrences != 0) {
        var occurrences = otherValue.occurrences;
        var clone = otherValue.cloneWithZeroOccurrences();
        clone.occurrences = occurrences;
        this.values.push(clone);
      } else {
        this.values.push(otherValue.cloneWithZeroOccurrences());
      }
    });
  }

  updateCountsFromNewValues(newValues: FacetValues) {
    Assert.exists(newValues);

    this.values = _.map(this.values, (myValue: FacetValue) => {
      var newValue = newValues.get(myValue.value);
      if (Utils.exists(newValue)) {
        myValue.updateCountsFromNewValue(newValue);
        return myValue;
      } else if (myValue.occurrences == null) {
        return myValue.cloneWithZeroOccurrences();
      }
      return myValue;
    });
  }

  updateDeltaWithFilteredFacetValues(filtered: FacetValues, isMultiValueField: boolean) {
    Assert.exists(filtered);
    _.each(this.values, (unfilteredValue: FacetValue) => {
      var filteredValue = filtered.get(unfilteredValue.value);
      unfilteredValue.waitingForDelta = false;
      if (Utils.exists(filteredValue)) {
        if (unfilteredValue.occurrences - filteredValue.occurrences > 0) {
          // When there are only exclusion in the facet, there should be no "delta"
          // The number of value for each facet will be what is selected, no addition.
          if (this.hasOnlyExcludedValues()) {
            unfilteredValue.delta = null;
            unfilteredValue.occurrences = filteredValue.occurrences;
          } else {
            unfilteredValue.delta = unfilteredValue.occurrences - filteredValue.occurrences;
          }
        } else {
          unfilteredValue.delta = null;
        }
      } else if (!unfilteredValue.selected && !unfilteredValue.excluded) {
        if (isMultiValueField && filtered.values.length == 0) {
          unfilteredValue.delta = null;
          unfilteredValue.occurrences = 0;
        } else {
          unfilteredValue.delta = unfilteredValue.occurrences;
        }
      }
    });
  }

  mergeWithUnfilteredFacetValues(unfiltered: FacetValues) {
    Assert.exists(unfiltered);

    var values: FacetValue[] = [];
    _.each(unfiltered.values, (unfilteredValue: FacetValue) => {
      var filteredValue = this.get(unfilteredValue.value);
      if (Utils.exists(filteredValue)) {
        if (filteredValue.occurrences == unfilteredValue.occurrences) {
          values.push(filteredValue);
        } else {
          values.push(unfilteredValue.cloneWithDelta(unfilteredValue.occurrences, unfilteredValue.occurrences - filteredValue.occurrences));
        }
      } else {
        values.push(unfilteredValue.cloneWithDelta(unfilteredValue.occurrences, unfilteredValue.occurrences));
      }
    });

    var index = 0;
    _.each(this.values, (value: FacetValue) => {
      var unfilteredValue = unfiltered.get(value.value);
      if (!Utils.exists(unfilteredValue)) {
        if (value.selected || value.excluded) {
          values.splice(index, 0, value);
          index++;
        }
      } else {
        for (var i = 0; i < values.length; i++) {
          if (values[i].value == value.value) {
            index = i + 1;
            break;
          }
        }
      }
    });
    this.values = values;
  }

  sortValuesDependingOnStatus(excludeLastIndex?: number) {
    this.values = _.sortBy(this.values, (value: FacetValue) => {
      if (value.selected) {
        return 1;
      } else if (value.excluded) {
        return 3;
      } else {
        return 2;
      }
    });
    if (excludeLastIndex != null && excludeLastIndex < this.values.length) {
      var nbExclude = this.getExcluded().length;
      var excludes = this.values.splice(this.values.length - nbExclude, nbExclude);
      Array.prototype.splice.apply(this.values, (<any[]>[excludeLastIndex - nbExclude, 0]).concat(excludes));
    }
  }
}
