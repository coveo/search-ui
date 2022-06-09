import { Component } from '../Base/Component';

export function isFacetFieldValueCompatible(facet: Component): facet is IFieldValueCompatibleFacet {
  return !!facet['isFieldValueCompatible'];
}

export interface IFieldValueCompatibleFacet extends Component {
  isFieldValueCompatible: boolean;
  isFieldValueHierarchical: boolean;
  hasSelectedValue(value: string): boolean;
  selectValue(value: string): void;
  deselectValue(value: string): void;
  getCaptionForStringValue(value: string): string;
}
