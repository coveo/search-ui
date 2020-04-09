import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { IGroupByValue } from '../../rest/GroupByValue';
import { IIndexFieldValue } from '../../rest/FieldValue';
import * as Globalize from 'globalize';
import { isString, isObject } from 'underscore';

/**
 * A class which holds information and operation available on a single facet value returned by a {@link IGroupByRequest}.<br/>
 * This class is used extensively in the {@link Facet} component.
 */
export class FacetValue {
  value: string;
  lookupValue: string;
  occurrences: number;
  computedField: number;
  delta: number;
  score: number;
  selected: boolean = false;
  excluded: boolean = false;
  waitingForDelta: boolean = false;

  reset() {
    this.selected = false;
    this.excluded = false;
  }

  updateCountsFromNewValue(newValue: FacetValue) {
    Assert.exists(newValue);
    this.occurrences = newValue.occurrences;
    this.delta = newValue.delta;
    this.computedField = newValue.computedField;
  }

  clone(): FacetValue {
    this.computedField = undefined;
    this.delta = undefined;
    return this;
  }

  cloneWithZeroOccurrences(): FacetValue {
    this.occurrences = 0;
    return this.clone();
  }

  cloneWithDelta(count: number, delta: number): FacetValue {
    Assert.isLargerOrEqualsThan(0, count);
    var clone = this.cloneWithZeroOccurrences();
    clone.delta = delta;
    clone.occurrences = count;
    return clone;
  }

  getFormattedCount() {
    var count: string = undefined;
    if (Utils.exists(this.delta) && this.delta > 0) {
      count = '+' + Globalize.format(this.delta, 'n0');
    } else {
      if (this.occurrences > 0) {
        count = Globalize.format(this.occurrences, 'n0');
      }
    }
    return count;
  }

  getFormattedComputedField(format: string) {
    if (this.computedField != 0) {
      return Globalize.format(this.computedField, format);
    } else {
      return undefined;
    }
  }

  static create(value: any): FacetValue {
    if (isString(value)) {
      return FacetValue.createFromValue(value);
    } else if (isObject(value)) {
      if ('computedFieldResults' in value) {
        return FacetValue.createFromGroupByValue(value);
      } else {
        return FacetValue.createFromFieldValue(value);
      }
    } else {
      throw new Error("Can't create value from " + value);
    }
  }

  static createFromValue(value: string): FacetValue {
    Assert.isNonEmptyString(value);

    var facetValue = new FacetValue();
    facetValue.value = value;
    facetValue.lookupValue = value;

    return facetValue;
  }

  static createFromGroupByValue(groupByValue: IGroupByValue): FacetValue {
    Assert.exists(groupByValue);

    Assert.exists(groupByValue);

    var facetValue = new FacetValue();
    facetValue.value = groupByValue.value;
    facetValue.lookupValue = Utils.exists(groupByValue.lookupValue) ? groupByValue.lookupValue : groupByValue.value;
    facetValue.occurrences = groupByValue.numberOfResults;
    facetValue.computedField = Utils.isNonEmptyArray(groupByValue.computedFieldResults) ? groupByValue.computedFieldResults[0] : undefined;
    facetValue.score = groupByValue.score;

    return facetValue;
  }

  static createFromFieldValue(fieldValue: IIndexFieldValue): FacetValue {
    Assert.exists(fieldValue);

    var facetValue = new FacetValue();
    facetValue.value = fieldValue.value;
    facetValue.lookupValue = fieldValue.lookupValue;
    facetValue.occurrences = fieldValue.numberOfResults;

    return facetValue;
  }
}
