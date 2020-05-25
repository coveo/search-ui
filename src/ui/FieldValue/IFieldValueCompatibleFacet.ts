import { Component } from '../Base/Component';

export function isFacetFieldValueCompatible(facet: Component): facet is IFieldValueCompatibleFacet {
  return !!(facet['hasSelectedValue'] && facet['selectValue'] && facet['deselectValue']);
}

export interface IFieldValueCompatibleFacet extends Component {
  hasSelectedValue(value: string): boolean;
  selectValue(value: string): void;
  deselectValue(value: string): void;
}
