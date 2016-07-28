export interface IAdvancedSearchInput {
  buildInput: () => HTMLElement,
  getValue: () => string
  clear: () => void
}
