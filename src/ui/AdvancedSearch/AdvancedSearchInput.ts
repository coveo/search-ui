export interface IAdvancedSearchInput {
  build: () => HTMLElement,
  getValue: () => string,
  shouldUpdateQueryState: ()=>boolean;
  shouldUpdateOnBuildingQuery: ()=>boolean;
}
