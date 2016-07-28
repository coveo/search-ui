export interface IAdvancedSearchInput {
  build: () => HTMLElement,
  getValue: () => string,
  shouldUpdateQueryState: () => boolean;
  shouldUpdateOnBuildingQuery: () => boolean;
}

export interface IAdvancedSearchSection {
  name: string,
  inputs: IAdvancedSearchInput[]
}
