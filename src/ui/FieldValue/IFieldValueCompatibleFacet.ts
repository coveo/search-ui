export interface IFieldValueCompatibleFacet {
  hasSelectedValue(value: string): boolean;
  selectValue(value: string): void;
  deselectValue(value: string): void;
}

export function isFacetFieldValueCompatible(facet: any) {
  return facet.hasSelectedValue && facet.selectValue && !!facet.deselectValue;
}
