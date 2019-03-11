import { $$ } from '../../../utils/Dom';
import { findWhere, find } from 'underscore';
import { MLFacetValue, IMLFacetValue } from './MLFacetValue';
import { MLFacet } from '../MLFacet';

export class MLFacetValues {
  private facetValues: MLFacetValue[] = [];
  private list = $$('ul', { className: 'coveo-facet-values' });

  constructor(private facet: MLFacet) {}

  public createFromResults(facetValues: IMLFacetValue[]) {
    this.facetValues = facetValues.map(value => new MLFacetValue(value, this.facet));
  }

  public get allFacetValues() {
    return this.facetValues;
  }

  public get allValues() {
    return this.facetValues.map(facetValue => facetValue.value);
  }

  public get selectedValues() {
    return this.facetValues.filter(value => value.selected).map(value => value.value);
  }

  public hasSelectedValues() {
    return !!findWhere(this.facetValues, { selected: true });
  }

  public clearAll() {
    this.facetValues.forEach(value => (value.selected = false));
  }

  public isEmpty() {
    return !this.facetValues.length;
  }

  public get(arg: string | MLFacetValue) {
    const value = typeof arg === 'string' ? arg : arg.value;
    const facetValue = find(this.facetValues, facetValue => facetValue.equals(value));

    if (facetValue) {
      return facetValue;
    }

    const newFacetValue = new MLFacetValue({ value, selected: false, numberOfResults: 0 }, this.facet);
    this.facetValues.push(newFacetValue);
    return newFacetValue;
  }

  public render() {
    this.list.empty();
    this.facetValues.forEach(facetValue => {
      this.list.append(facetValue.render());
    });

    return this.list.el;
  }
}
