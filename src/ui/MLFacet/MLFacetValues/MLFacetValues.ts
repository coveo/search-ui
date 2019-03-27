import 'styling/MLFacet/_MLFacetValues';
import { $$ } from '../../../utils/Dom';
import { findWhere, find } from 'underscore';
import { MLFacetValue } from './MLFacetValue';
import { MLFacet } from '../MLFacet';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';

export class MLFacetValues {
  private facetValues: MLFacetValue[] = [];
  private list = $$('ul', { className: 'coveo-ml-facet-values' });

  constructor(private facet: MLFacet) {}

  public createFromResults(facetValues: IFacetResponseValue[]) {
    this.facetValues = facetValues.map(
      facetValue =>
        new MLFacetValue(
          {
            value: facetValue.value,
            numberOfResults: facetValue.numberOfResults,
            state: facetValue.state
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
    return this.facetValues.filter(value => value.isSelected).map(value => value.value);
  }

  public hasSelectedValues() {
    return !!findWhere(this.facetValues, { state: FacetValueState.selected });
  }

  public clearAll() {
    this.facetValues.forEach(value => value.deselect());
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

    const newFacetValue = new MLFacetValue({ value, state: FacetValueState.idle, numberOfResults: 0 }, this.facet);
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
