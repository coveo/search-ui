import { $$ } from '../../../utils/Dom';
import { findWhere, find } from 'underscore';
import { MLFacetValue } from './MLFacetValue';
import { MLFacet } from '../MLFacet';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';

export class MLFacetValues {
  private facetValues: MLFacetValue[] = [];
  private list = $$('ul', { className: 'coveo-facet-values' });

  constructor(private facet: MLFacet) {}

  public createFromResults(facetValues: IFacetResponseValue[]) {
    this.facetValues = facetValues.map(
      facetValue =>
        new MLFacetValue(
          {
            value: facetValue.value,
            numberOfResults: facetValue.numberOfResults,
            selected: facetValue.state === FacetValueState.selected
          },
          this.facet
        )
    );
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
