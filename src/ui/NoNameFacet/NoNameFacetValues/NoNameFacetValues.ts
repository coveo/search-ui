import { findWhere } from 'underscore';
import { NoNameFacetValue, INoNameFacetValue } from './NoNameFacetValue';

export class NoNameFacetValues {
  private values: NoNameFacetValue[] = [];

  public createFromResults(values: INoNameFacetValue[]) {
    this.values = values.map(value => new NoNameFacetValue(value));
  }

  public getAll() {
    return this.values;
  }

  public hasSelectedValues() {
    return !!findWhere(this.values, { selected: true });
  }

  public clearAll() {
    this.values.forEach(value => (value.selected = false));
  }
}
