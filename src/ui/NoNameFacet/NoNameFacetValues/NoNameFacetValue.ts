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
    this.value = value;
    this.selected = selected;
    this.numberOfResults = numberOfResults;
  }

  public toggleSelect() {
    this.selected = !this.selected;
  }

  public select() {
    this.selected = true;
  }

  public deselect() {
    this.selected = false;
  }
}
