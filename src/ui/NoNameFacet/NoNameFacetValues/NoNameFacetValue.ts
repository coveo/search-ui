export interface INoNameFacetValue {
  value: string;
  selected: boolean;
  numberOfResults: number;
}

export class NoNameFacetValue implements INoNameFacetValue {
  public value: string;
  public selected: boolean;
  public numberOfResults: number;

  constructor({ value, selected, numberOfResults }: INoNameFacetValue) {
    // TODO: add asserts
    this.value = value;
    this.selected = selected;
    this.numberOfResults = numberOfResults;
  }

  public toggleSelection() {
    this.selected = !this.selected;
  }
}
